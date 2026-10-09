import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { REGIONS, GET_TREND_SUMMARY, VARIABLES } from '../data/earthSignalsData';
import { Layers, MapPin, Sparkles, ZoomIn, Info, CheckCircle2 } from 'lucide-react';

// Fix Leaflet default icon paths in bundler environments
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// Custom pulsing SVG DivIcon generator
function createPulseIcon(color, isSelected, flag, label) {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: absolute; inset: -4px; border-radius: 50%; background: ${color}; opacity: ${isSelected ? 0.35 : 0.15}; animation: pulse ${isSelected ? '1.6s' : '3s'} infinite;"></div>
        <div style="width: 30px; height: 30px; border-radius: 50%; background: #0D1527; border: 2px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 ${isSelected ? '14px' : '6px'} ${color};">
          <span style="font-size: 14px; line-height: 1;">${flag}</span>
        </div>
        ${isSelected ? `<div style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); background: rgba(5,8,22,0.92); color: #FFF; border: 1px solid ${color}; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; white-space: nowrap; font-family: 'JetBrains Mono', monospace;">${label}</div>` : ''}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
}

// Controller component to handle dynamic map resizing and pan/zoom transitions
function MapController({ selectedRegionId }) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size on mount to prevent grey/broken tiles in tabs/modals
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 120);

    const region = REGIONS.find(r => r.id === selectedRegionId);
    if (region && region.lat && region.lng) {
      map.flyTo([region.lat, region.lng], region.zoom || 6, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }

    return () => clearTimeout(timer);
  }, [selectedRegionId, map]);

  return null;
}

export default function SouthAsiaOverviewMap({ selectedRegionId, onSelectRegion, variableId = 'rainfall' }) {
  const [tileError, setTileError] = useState(false);
  const currentRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];
  const variableObj = VARIABLES.find(v => v.id === variableId) || VARIABLES[0];

  const centerLat = currentRegion.lat || 23.685;
  const centerLng = currentRegion.lng || 85.0;
  const zoomLevel = currentRegion.zoom || 5;

  return (
    <div style={styles.container} className="glass-panel">
      {/* Top Map Action Bar */}
      <div style={styles.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>
            <MapPin size={11} />
            INTERACTIVE GEOSPATIAL MONITOR
          </span>
          <span style={{ fontSize: '0.8rem', color: '#A6B4C8', fontWeight: '600' }}>
            Viewing: <strong style={{ color: '#FFF' }}>{currentRegion.name}</strong> ({variableObj.name})
          </span>
        </div>

        {/* Quick Country Switcher Chips */}
        <div style={styles.chipsRow}>
          {REGIONS.map((r) => {
            const isSelected = r.id === selectedRegionId;
            return (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r.id)}
                style={{
                  ...styles.chipBtn,
                  ...(isSelected ? styles.chipBtnActive : {})
                }}
                aria-label={`Focus map on ${r.name}`}
              >
                <span>{r.flag}</span>
                <span>{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Map Viewport */}
      <div style={styles.mapViewport}>
        <MapContainer
          center={[centerLat, centerLng]}
          zoom={zoomLevel}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%', minHeight: '440px', background: '#050816' }}
        >
          {/* Tile Layer with Dark Carto Matter */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
            url={tileError 
              ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            }
            subdomains={['a', 'b', 'c', 'd']}
            maxZoom={18}
            eventHandlers={{
              tileerror: () => setTileError(true)
            }}
          />

          {/* Dynamic Map Controller */}
          <MapController selectedRegionId={selectedRegionId} />

          {/* Regional Signal Nodes */}
          {REGIONS.map((region) => {
            const isSelected = region.id === selectedRegionId;
            const summary = GET_TREND_SUMMARY(region.id, variableId);

            let nodeColor = '#55D6FF';
            if (summary.statusType === 'increasing') nodeColor = '#FFBF69';
            if (summary.statusType === 'decreasing') nodeColor = '#FF647C';
            if (summary.statusType === 'neutral') nodeColor = '#37D6A3';

            const customIcon = createPulseIcon(nodeColor, isSelected, region.flag, region.name);

            return (
              <React.Fragment key={region.id}>
                {/* Environmental Signal Spread Circle */}
                <Circle
                  center={[region.lat, region.lng]}
                  radius={isSelected ? 160000 : 90000}
                  pathOptions={{
                    color: nodeColor,
                    fillColor: nodeColor,
                    fillOpacity: isSelected ? 0.22 : 0.08,
                    weight: isSelected ? 2 : 1,
                    dashArray: isSelected ? null : '4 4'
                  }}
                  eventHandlers={{
                    click: () => onSelectRegion(region.id)
                  }}
                />

                {/* Interactive Country Pin Marker */}
                <Marker
                  position={[region.lat, region.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => onSelectRegion(region.id)
                  }}
                >
                  <Popup>
                    <div style={styles.popupCard}>
                      <div style={styles.popupHead}>
                        <span style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>
                          {region.flag} {region.name}
                        </span>
                        <span className={`badge ${summary.statusType === 'increasing' ? 'badge-amber' : summary.statusType === 'decreasing' ? 'badge-red' : 'badge-green'}`} style={{ fontSize: '0.62rem' }}>
                          {summary.directionLabel}
                        </span>
                      </div>

                      <div style={styles.popupBody}>
                        <div style={{ fontSize: '0.78rem', color: '#A6B4C8', marginBottom: '6px' }}>
                          {region.description}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#FFF', display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                          <span style={{ color: '#7E8EA6' }}>Measured Rate:</span>
                          <span style={{ fontWeight: '700', color: nodeColor }} className="mono">{summary.howFastRate || summary.rate}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#FFF', display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                          <span style={{ color: '#7E8EA6' }}>Statistical Test:</span>
                          <span style={{ fontWeight: '600', color: '#37D6A3' }}>{summary.pValue || summary.confidence}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectRegion(region.id)}
                        style={styles.popupActionBtn}
                      >
                        <span>Select {region.name} Evidence</span>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>

        {/* Floating Map Legend Overlay */}
        <div style={styles.legendOverlay}>
          <div style={{ fontSize: '0.68rem', fontWeight: '800', color: '#55D6FF', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
            Signal Legend · {variableObj.name}
          </div>
          <div style={styles.legendGrid}>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: '#FFBF69' }} />
              <span>Increasing Trend</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: '#FF647C' }} />
              <span>Decreasing Trend</span>
            </div>
            <div style={styles.legendItem}>
              <span style={{ ...styles.legendDot, background: '#37D6A3' }} />
              <span>No Significant Trend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    borderRadius: '16px',
    overflow: 'hidden',
    position: 'relative',
    border: '1px solid rgba(85, 214, 255, 0.2)',
    boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
  },
  topBar: {
    padding: '12px 18px',
    background: 'rgba(8, 13, 27, 0.95)',
    borderBottom: '1px solid rgba(38, 54, 75, 0.7)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
  },
  chipsRow: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  chipBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-subtle)',
    color: '#A6B4C8',
    fontSize: '0.76rem',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  chipBtnActive: {
    background: 'rgba(85, 214, 255, 0.15)',
    borderColor: '#55D6FF',
    color: '#FFF',
    boxShadow: '0 0 10px rgba(85, 214, 255, 0.2)',
  },
  mapViewport: {
    position: 'relative',
    height: '460px',
    width: '100%',
    overflow: 'hidden',
  },
  legendOverlay: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    background: 'rgba(5, 8, 22, 0.88)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(85, 214, 255, 0.25)',
    borderRadius: '8px',
    padding: '8px 12px',
    zIndex: 400,
    boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
  },
  legendGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '0.72rem',
    color: '#F4F7FB',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  popupCard: {
    padding: '4px',
    minWidth: '220px',
    fontFamily: "'Inter', sans-serif",
  },
  popupHead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  popupBody: {
    marginBottom: '10px',
  },
  popupActionBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #55D6FF 0%, #30BCE8 100%)',
    color: '#050816',
    border: 'none',
    borderRadius: '6px',
    padding: '7px 12px',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    transition: 'opacity 0.2s ease',
  },
};
