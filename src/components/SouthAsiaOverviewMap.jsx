import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { REGIONS, GET_TREND_SUMMARY } from '../data/earthSignalsData';

// Fix Leaflet default icon paths in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export default function SouthAsiaOverviewMap({ selectedRegionId, onSelectRegion, variableId }) {
  const centerLat = 24.0;
  const centerLng = 80.0;
  const zoomLevel = 5;

  const currentRegion = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];

  return (
    <div style={styles.mapWrapper} className="glass-panel">
      <MapContainer
        center={[currentRegion.lat || centerLat, currentRegion.lng || centerLng]}
        zoom={currentRegion.zoom || zoomLevel}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '440px', borderRadius: 'var(--radius-lg)' }}
      >
        {/* Dark CartoDB Matter Tile Layer for NASA Dark Aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Regional Hotspot Markers & Intensity Radii */}
        {REGIONS.map((region) => {
          const isSelected = region.id === selectedRegionId;
          const summary = GET_TREND_SUMMARY(region.id, variableId);
          
          let color = '#06B6D4';
          if (summary.statusType === 'increasing') color = '#F59E0B';
          if (summary.statusType === 'decreasing') color = '#EF4444';
          if (summary.statusType === 'neutral') color = '#10B981';

          return (
            <React.Fragment key={region.id}>
              {/* Hotspot Outer Signal Zone */}
              <Circle
                center={[region.lat, region.lng]}
                radius={isSelected ? 180000 : 100000}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: isSelected ? 0.25 : 0.1,
                  weight: isSelected ? 2 : 1
                }}
                eventHandlers={{
                  click: () => onSelectRegion(region.id)
                }}
              />

              {/* Marker with Interactive Popup */}
              <Marker
                position={[region.lat, region.lng]}
                eventHandlers={{
                  click: () => onSelectRegion(region.id)
                }}
              >
                <Popup>
                  <div style={styles.popupContainer}>
                    <div style={styles.popupHeader}>
                      <span>{region.flag} {region.name}</span>
                      <span className={`badge ${summary.statusType === 'increasing' ? 'badge-amber' : 'badge-cyan'}`}>
                        {summary.directionLabel}
                      </span>
                    </div>
                    <div style={styles.popupBody}>
                      <div style={{ fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '6px' }}>
                        Primary Signal: <strong style={{ color: '#FFF' }}>{region.primarySignal}</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                        Sen's Slope Rate: <strong style={{ color: 'var(--color-cyan)' }}>{summary.rate}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '2px' }}>
                        Mann-Kendall: <strong>{summary.confidence}</strong>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectRegion(region.id)}
                      style={styles.popupBtn}
                    >
                      View Detailed Regional Signals
                    </button>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}

const styles = {
  mapWrapper: {
    padding: '8px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden'
  },
  popupContainer: {
    minWidth: '220px',
    fontFamily: 'var(--font-sans)'
  },
  popupHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: '700',
    fontSize: '0.95rem',
    marginBottom: '8px',
    color: '#FFFFFF'
  },
  popupBody: {
    padding: '6px 0',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    marginBottom: '8px'
  },
  popupBtn: {
    width: '100%',
    background: 'var(--color-cyan-glow)',
    border: '1px solid var(--color-cyan)',
    color: 'var(--color-cyan)',
    fontSize: '0.78rem',
    fontWeight: '600',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer'
  }
};
