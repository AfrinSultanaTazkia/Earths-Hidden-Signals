import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SOUTH_ASIA_LOCATIONS, COUNTRY_GROUPS } from '../data/southAsiaLocations';
import { fetchLiveRegionData, compareLiveToTrend, getWindDirection } from '../services/openMeteoApi';
import { REGIONS } from '../data/earthSignalsData';

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// ── Fly map to location when selected changes ────────────────
function FlyToLocation({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    const t1 = setTimeout(() => map.invalidateSize(), 80);
    const t2 = setTimeout(() => map.invalidateSize(), 400);

    if (lat && lng) {
      map.flyTo([lat, lng], 9, { duration: 1.0, easeLinearity: 0.5 });
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [lat, lng, map]);
  return null;
}

// ── Status level → colors ────────────────────────────────────
const LEVEL_COLOR = {
  danger:  { bg: 'rgba(239,68,68,0.12)',  border: '#EF4444' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: '#F59E0B' },
  good:    { bg: 'rgba(16,185,129,0.12)', border: '#10B981' },
  normal:  { bg: 'rgba(6,182,212,0.10)',  border: '#06B6D4' },
  low:     { bg: 'rgba(99,102,241,0.12)', border: '#6366F1' }
};

// ── Animated number counter ──────────────────────────────────
function AnimNum({ value, decimals = 1 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const target = parseFloat(value) || 0;
    let current = 0;
    const steps = 24;
    const step = (target - current) / steps;
    let count = 0;
    const timer = setInterval(() => {
      count++;
      current += step;
      setDisplay(current);
      if (count >= steps) { setDisplay(target); clearInterval(timer); }
    }, 600 / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toFixed(decimals)}</>;
}

// ── Single metric card ───────────────────────────────────────
function MetricCard({ emoji, label, value, unit, decimals = 1, level = 'normal', sub }) {
  const c = LEVEL_COLOR[level] || LEVEL_COLOR.normal;
  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}44`,
      borderRadius: '10px',
      padding: '13px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
      <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{emoji}</span>
      <div style={{ fontSize: '0.62rem', color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#FFF', lineHeight: 1 }}>
        <AnimNum value={value} decimals={decimals} />
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: c.border, marginLeft: '3px' }}>{unit}</span>
      </div>
      {sub && (
        <div style={{ fontSize: '0.62rem', color: '#6B7280', lineHeight: 1.3, marginTop: '2px' }}>{sub}</div>
      )}
    </div>
  );
}

// ── Horizontal comparison bar ────────────────────────────────
function CompareBar({ emoji, label, live, baseline, max, unit, color }) {
  const liveW    = Math.min(100, (live     / max) * 100);
  const baselineW = Math.min(100, (baseline / max) * 100);
  const diff = live - baseline;
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: '700' }}>{emoji} {label}</span>
        <div style={{ fontSize: '0.72rem', display: 'flex', gap: '10px' }}>
          <span style={{ color }}>Live: <strong>{live.toFixed(1)}{unit}</strong></span>
          <span style={{ color: '#6B7280' }}>Avg: {baseline.toFixed(1)}{unit}</span>
          <span style={{ color: diff > 0 ? '#F59E0B' : '#10B981', fontWeight: '700' }}>
            ({diff >= 0 ? '+' : ''}{diff.toFixed(1)})
          </span>
        </div>
      </div>
      <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'visible' }}>
        {/* 20-year baseline marker */}
        <div style={{
          position: 'absolute',
          left: `${baselineW}%`,
          top: '-3px',
          width: '2px',
          height: '14px',
          background: 'rgba(255,255,255,0.55)',
          borderRadius: '2px',
          zIndex: 2
        }} />
        {/* Live bar */}
        <div style={{
          width: `${liveW}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}55, ${color})`,
          borderRadius: '4px',
          transition: 'width 0.9s ease'
        }} />
      </div>
      <div style={{ fontSize: '0.6rem', color: '#4B5563', marginTop: '2px' }}>
        White line = 20-year NASA average
      </div>
    </div>
  );
}

// ── Build suggestions based on live data ─────────────────────
function buildSuggestions(live, location) {
  const regionId = ['bangladesh', 'india', 'nepal', 'pakistan'].includes(location.country)
    ? location.country : 'india';
  const suggestions = [];

  const tempS = compareLiveToTrend('temp',          live.temp,          regionId);
  const humS  = compareLiveToTrend('humidity',      live.humidity,      regionId);
  const soilS = compareLiveToTrend('soilMoisture',  live.soilMoisture,  regionId);
  const rainS = compareLiveToTrend('precipitation', live.precipitation, regionId);
  const windS = compareLiveToTrend('windSpeed',     live.windSpeed,     regionId);

  // Temperature
  if (tempS.level === 'danger') suggestions.push({
    icon: '🥵', level: 'danger',
    title: 'Very Hot Outside!',
    body: `Temperature is ${live.temp.toFixed(1)}°C — way above the normal range! Stay indoors, drink water every hour 💧. Children and elderly should avoid going outside between 11 AM and 4 PM.`
  });
  else if (tempS.level === 'warning') suggestions.push({
    icon: '🌡️', level: 'warning',
    title: 'Temperature is Higher than Usual',
    body: `It's ${live.temp.toFixed(1)}°C — a bit warmer than the ${(live.temp - tempS.diff).toFixed(1)}°C long-term average. Carry water and wear a hat if going outside.`
  });

  // Humidity
  if (humS.level === 'danger') suggestions.push({
    icon: '💦', level: 'danger',
    title: 'Extremely High Humidity!',
    body: `Humidity is at ${live.humidity}% — the air feels very thick and sticky! Empty water containers around your home; mosquitoes breed in standing water. Health workers should alert communities about dengue risk.`
  });
  else if (humS.level === 'warning') suggestions.push({
    icon: '🌫️', level: 'warning',
    title: 'High Humidity Today',
    body: `${live.humidity}% humidity — the air feels heavy. Ventilate your home. Perishable food spoils faster in humid conditions.`
  });

  // Precipitation
  if (rainS.level === 'danger') suggestions.push({
    icon: '⚠️', level: 'danger',
    title: `Heavy Rain Alert — ${location.name}!`,
    body: `${live.precipitation.toFixed(1)} mm of rain is falling right now! ${location.disasterIcon} ${location.disaster} risk is HIGH. Move to higher ground if you live near rivers or low areas. Never walk through flooded streets!`
  });
  else if (rainS.level === 'warning') suggestions.push({
    icon: '🌧️', level: 'warning',
    title: 'Moderate Rain — Stay Alert',
    body: `${live.precipitation.toFixed(1)} mm of rain currently falling. Farmers should check drainage channels. Avoid low-lying roads and underpasses.`
  });

  // Soil moisture — landslide for Nepal, flood for Bangladesh
  if (soilS.level === 'danger') {
    if (location.country === 'nepal') suggestions.push({
      icon: '⛰️', level: 'danger',
      title: 'Soil Very Saturated — Landslide Risk!',
      body: `Soil moisture is ${live.soilMoisture}%! Hillsides become unstable when the soil is this wet. Stay well away from steep slopes and riverbeds after heavy rain. Emergency teams should monitor mountain corridors.`
    });
    else if (location.country === 'bangladesh') suggestions.push({
      icon: '🌊', level: 'danger',
      title: 'Soil Saturated — Flooding is Very Likely!',
      body: `Soil moisture at ${live.soilMoisture}% means rain water cannot be absorbed — it runs directly into rivers, raising flood risk. Move important belongings to higher shelves now!`
    });
  }

  // Dry soil → wildfire risk for India
  if (soilS.level === 'low' && location.country === 'india') suggestions.push({
    icon: '🔥', level: 'warning',
    title: 'Dry Soil — Wildfire Risk Increasing',
    body: `Soil moisture is only ${live.soilMoisture}% — forests are drying out! Avoid burning anything near forested areas. Forestry teams should increase fire patrols.`
  });

  // Wind
  if (windS.level === 'danger') suggestions.push({
    icon: '🌪️', level: 'danger',
    title: 'Very Strong Winds!',
    body: `Wind speed is ${live.windSpeed.toFixed(1)} km/h — strong enough to damage rooftops and knock over trees! Stay indoors and secure all loose outdoor objects.`
  });

  // Low pressure
  if (live.pressure < 1000) suggestions.push({
    icon: '📉', level: 'warning',
    title: 'Low Air Pressure — Rain Approaching!',
    body: `Pressure reading of ${live.pressure} hPa is below normal. This usually means storms or heavy rain are on the way. Check local weather alerts!`
  });

  // All clear
  if (suggestions.length === 0) suggestions.push({
    icon: '✅', level: 'good',
    title: `All Clear in ${location.name}! 🎉`,
    body: `Current conditions look normal — temperature ${live.temp.toFixed(1)}°C, humidity ${live.humidity}%. All readings are within safe ranges. It's a good day to go outside and enjoy nature! 🌳`
  });

  return suggestions;
}

// ── Country baselines (20-yr NASA approximate regional values) ─
const BASELINES = {
  bangladesh: { temp: 27.2, humidity: 76, rain: 5.0, soil: 65 },
  india:      { temp: 28.5, humidity: 58, rain: 3.5, soil: 40 },
  nepal:      { temp: 22.0, humidity: 68, rain: 6.0, soil: 58 },
  pakistan:   { temp: 30.0, humidity: 42, rain: 1.5, soil: 28 },
  srilanka:   { temp: 27.0, humidity: 74, rain: 5.0, soil: 55 },
  bhutan:     { temp: 15.0, humidity: 65, rain: 4.0, soil: 50 },
  myanmar:    { temp: 26.0, humidity: 70, rain: 4.5, soil: 52 }
};

// ══════════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ══════════════════════════════════════════════════════════════
export default function ExploreLive({ selectedRegionId, setSelectedRegionId }) {
  const [selectedLoc, setSelectedLoc] = useState(
    SOUTH_ASIA_LOCATIONS.find(l => l.id === 'dhaka') || SOUTH_ASIA_LOCATIONS[0]
  );
  const [liveData, setLiveData]   = useState(null);
  const [loading, setLoading]     = useState(false);
  const [filterCountry, setFilterCountry] = useState('all');

  // Fetch live weather data from Open-Meteo
  const fetchData = useCallback(async (loc) => {
    setLoading(true);
    setLiveData(null);
    try {
      const data = await fetchLiveRegionData(loc.lat, loc.lng);
      setLiveData(data);
    } catch (e) {
      console.error('fetchLiveRegionData error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedLoc);
    const interval = setInterval(() => fetchData(selectedLoc), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedLoc, fetchData]);

  const handleSelect = (loc) => {
    setSelectedLoc(loc);
    if (setSelectedRegionId) setSelectedRegionId(loc.country);
  };

  const regionId = ['bangladesh', 'india', 'nepal', 'pakistan'].includes(selectedLoc.country)
    ? selectedLoc.country : 'india';
  const bl = BASELINES[selectedLoc.country] || BASELINES.india;
  const windDir = liveData ? getWindDirection(liveData.windDirection) : { arrow: '↑', label: 'N' };
  const suggestions = liveData ? buildSuggestions(liveData, selectedLoc) : [];
  const filteredLocs = filterCountry === 'all'
    ? SOUTH_ASIA_LOCATIONS
    : SOUTH_ASIA_LOCATIONS.filter(l => l.country === filterCountry);
  const selectedGroup = COUNTRY_GROUPS[selectedLoc.country] || COUNTRY_GROUPS.india;

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh' }}>

      {/* ── Header ── */}
      <div style={{ background: 'linear-gradient(180deg,rgba(6,182,212,0.07) 0%,transparent 100%)', padding: '44px 0 24px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '660px', margin: '0 auto 28px' }}>
            <div className="badge badge-cyan" style={{ marginBottom: '10px', display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981', animation: 'pulse 2s ease-in-out infinite' }} />
              LIVE EARTH MONITOR — OPEN-METEO API
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: '900', color: '#FFF', marginBottom: '10px', lineHeight: 1.15 }}>
              🗺️ Click Any City in South Asia
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>
              Click any city marker on the map to see <strong>real-time weather data</strong> fetched live from satellites — then compare it with <strong>20 years of NASA trend data</strong> and get simple suggestions!
            </p>
          </div>

          {/* Country filter tabs */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[{ key: 'all', name: 'All Countries', flag: '🌍', color: '#06B6D4' },
              ...Object.entries(COUNTRY_GROUPS).map(([key, g]) => ({ key, ...g }))
            ].map(g => (
              <button
                key={g.key}
                onClick={() => setFilterCountry(g.key)}
                style={{
                  padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700',
                  border: `1px solid ${filterCountry === g.key ? g.color : 'rgba(255,255,255,0.12)'}`,
                  background: filterCountry === g.key ? g.color + '22' : 'transparent',
                  color: filterCountry === g.key ? g.color : '#9CA3AF',
                  cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                {g.flag} {g.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="container" style={{ paddingBottom: '60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,1fr)',
          gap: '20px',
          alignItems: 'start'
        }}>

          {/* ══ LEFT COLUMN: Map ══ */}
          <div style={{ position: 'sticky', top: '78px' }}>
            <div style={{
              background: 'rgba(17,24,39,0.7)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              {/* Map legend strip */}
              <div style={{ display: 'flex', gap: '14px', padding: '10px 16px', flexWrap: 'wrap', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Legend:
                </span>
                {Object.entries(COUNTRY_GROUPS).map(([key, g]) => (
                  <span key={key} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: '#9CA3AF' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.color, display: 'inline-block', flexShrink: 0 }} />
                    {g.flag} {g.name}
                  </span>
                ))}
              </div>

              {/* Leaflet map */}
              <MapContainer
                center={[23.0, 80.0]}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: '480px', width: '100%' }}
                preferCanvas={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com/">CARTO</a> | &copy; <a href="https://openstreetmap.org">OSM</a>'
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  maxZoom={19}
                  subdomains="abcd"
                />

                {/* Fly to selected city */}
                <FlyToLocation lat={selectedLoc.lat} lng={selectedLoc.lng} />

                {/* Render all filtered city markers */}
                {filteredLocs.map((loc) => {
                  const isSelected = selectedLoc.id === loc.id;
                  const grp = COUNTRY_GROUPS[loc.country] || { color: '#06B6D4' };
                  return (
                    <CircleMarker
                      key={loc.id}
                      center={[loc.lat, loc.lng]}
                      radius={isSelected ? 13 : 7}
                      pathOptions={{
                        color:       grp.color,
                        fillColor:   grp.color,
                        fillOpacity: isSelected ? 1 : 0.65,
                        weight:      isSelected ? 3 : 1.5,
                        opacity:     1
                      }}
                      eventHandlers={{ click: () => handleSelect(loc) }}
                    >
                      <Popup maxWidth={250} minWidth={200}>
                        <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '0.95rem' }}>{loc.flag} {loc.name}</strong>
                            <span style={{
                              fontSize: '0.65rem', padding: '2px 7px', borderRadius: '20px',
                              background: grp.color + '25', color: grp.color,
                              border: `1px solid ${grp.color}55`, fontWeight: '700'
                            }}>
                              {loc.label}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '3px' }}>
                            📍 {loc.lat.toFixed(3)}°N, {loc.lng.toFixed(3)}°E
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '3px' }}>
                            🏔️ {loc.elevation} elev. &nbsp;·&nbsp; 👥 {loc.population}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#d97706', marginBottom: '10px' }}>
                            {loc.disasterIcon} Primary risk: {loc.disaster}
                          </div>
                          <button
                            onClick={() => handleSelect(loc)}
                            style={{
                              width: '100%', background: grp.color,
                              border: 'none', color: '#FFF',
                              borderRadius: '6px', padding: '8px 10px',
                              fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer'
                            }}
                          >
                            📡 Load Live Weather
                          </button>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>

              {/* Quick city selector chips */}
              <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.68rem', color: '#6B7280', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Quick select — {filteredLocs.length} cities
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
                  {filteredLocs.map(loc => {
                    const isActive = selectedLoc.id === loc.id;
                    const grp = COUNTRY_GROUPS[loc.country] || { color: '#06B6D4' };
                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleSelect(loc)}
                        style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '700',
                          border: `1px solid ${isActive ? grp.color : 'rgba(255,255,255,0.1)'}`,
                          background: isActive ? grp.color + '25' : 'transparent',
                          color: isActive ? grp.color : '#9CA3AF',
                          cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.12s'
                        }}
                      >
                        {loc.flag} {loc.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ══ RIGHT COLUMN: Live data panel ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Location header card */}
            <div className="glass-panel glass-panel-glow" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.4rem' }}>{selectedLoc.flag}</span>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: selectedGroup.color, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {selectedGroup.name}
                    </div>
                    <h2 style={{ fontSize: '1.55rem', fontWeight: '900', color: '#FFF', margin: '0 0 2px' }}>
                      {selectedLoc.name}
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {selectedLoc.label} · {selectedLoc.division} · {selectedLoc.elevation} elev.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  {liveData && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                      borderRadius: '10px', padding: '8px 14px'
                    }}>
                      <span style={{ fontSize: '1.8rem' }}>{liveData.weatherEmoji}</span>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#FFF', lineHeight: 1 }}>
                          {liveData.temp.toFixed(1)}°C
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{liveData.weatherLabel}</div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => fetchData(selectedLoc)}
                    disabled={loading}
                    style={{
                      background: 'var(--color-cyan-glow)', border: '1px solid var(--color-cyan)',
                      color: 'var(--color-cyan)', fontSize: '0.78rem', fontWeight: '700',
                      padding: '9px 14px', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? '⏳ Loading...' : '🔄 Refresh'}
                  </button>
                </div>
              </div>

              {/* Status row */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#6B7280', fontFamily: 'monospace' }}>
                  📍 {selectedLoc.lat.toFixed(4)}°N, {selectedLoc.lng.toFixed(4)}°E
                </span>
                <span style={{ fontSize: '0.7rem', color: '#F59E0B' }}>
                  {selectedLoc.disasterIcon} Primary risk: {selectedLoc.disaster}
                </span>
                {liveData && (
                  <span style={{ marginLeft: 'auto', fontSize: '0.68rem', color: liveData.isRealApi ? '#10B981' : '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: liveData.isRealApi ? '#10B981' : '#F59E0B',
                      display: 'inline-block',
                      animation: liveData.isRealApi ? 'pulse 2s ease-in-out infinite' : 'none'
                    }} />
                    {liveData.isRealApi ? `Live · ${liveData.timezone} · ${liveData.timestamp}` : 'Estimated (no network)'}
                  </span>
                )}
              </div>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px',
                padding: '30px', background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border-subtle)', borderRadius: '12px'
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  border: '3px solid rgba(6,182,212,0.2)', borderTopColor: '#06B6D4',
                  animation: 'spin 0.8s linear infinite'
                }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Fetching live weather for {selectedLoc.name}...
                </span>
              </div>
            )}

            {/* Live data */}
            {liveData && !loading && (
              <>
                {/* API status banner */}
                <div style={{
                  padding: '8px 14px', borderRadius: '8px', fontSize: '0.78rem',
                  background: liveData.isRealApi ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                  border: `1px solid ${liveData.isRealApi ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                  color: liveData.isRealApi ? '#10B981' : '#F59E0B'
                }}>
                  {liveData.isRealApi
                    ? `✅ Live data from Open-Meteo API — updated at ${liveData.timestamp}`
                    : '⚠️ Estimated data — could not reach the live API. Data will retry every 5 minutes.'}
                </div>

                {/* 8 metric cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                  <MetricCard emoji="🌡️" label="Temperature" value={liveData.temp} unit="°C"
                    level={compareLiveToTrend('temp', liveData.temp, regionId).level}
                    sub={`Feels like ${liveData.feelsLike.toFixed(1)}°C`} />
                  <MetricCard emoji="💧" label="Humidity" value={liveData.humidity} unit="%" decimals={0}
                    level={compareLiveToTrend('humidity', liveData.humidity, regionId).level}
                    sub="Relative humidity in the air" />
                  <MetricCard emoji="🌧️" label="Rain Right Now" value={liveData.precipitation} unit=" mm"
                    level={compareLiveToTrend('precipitation', liveData.precipitation, regionId).level}
                    sub="Current precipitation" />
                  <MetricCard emoji="🌱" label="Soil Moisture" value={liveData.soilMoisture} unit="%" decimals={0}
                    level={compareLiveToTrend('soilMoisture', liveData.soilMoisture, regionId).level}
                    sub="Top-layer soil saturation" />
                  <MetricCard emoji={`💨 ${windDir.arrow}`} label={`Wind (${windDir.label})`} value={liveData.windSpeed} unit=" km/h"
                    level={compareLiveToTrend('windSpeed', liveData.windSpeed, regionId).level}
                    sub={`Blowing from the ${windDir.label}`} />
                  <MetricCard emoji="🌍" label="Air Pressure" value={liveData.pressure} unit=" hPa" decimals={0}
                    level={liveData.pressure < 1000 ? 'warning' : 'normal'}
                    sub={liveData.pressure < 1000 ? '⚠️ Low = storm incoming' : '✅ Normal range'} />
                  <MetricCard emoji="☁️" label="Cloud Cover" value={liveData.cloudCover} unit="%" decimals={0}
                    level="normal"
                    sub={liveData.cloudCover > 80 ? 'Very cloudy' : liveData.cloudCover > 40 ? 'Partly cloudy' : 'Clear sky'} />
                  <MetricCard emoji="🪨" label="Soil Temp" value={liveData.soilTemp} unit="°C"
                    level="normal" sub="Ground-surface temperature" />
                </div>

                {/* Trend comparison bars */}
                <div className="glass-panel" style={{ padding: '18px', borderRadius: '12px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFF', marginBottom: '3px' }}>
                      📊 Live vs. 20-Year NASA Baseline
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                      White line = long-term average. Color bar = today's live reading.
                    </div>
                  </div>
                  <CompareBar emoji="🌡️" label="Temperature" live={liveData.temp} baseline={bl.temp} max={50} unit="°C" color="#F59E0B" />
                  <CompareBar emoji="💧" label="Humidity"    live={liveData.humidity} baseline={bl.humidity} max={100} unit="%" color="#06B6D4" />
                  <CompareBar emoji="🌧️" label="Precipitation" live={liveData.precipitation} baseline={bl.rain} max={60} unit=" mm" color="#3B82F6" />
                  <CompareBar emoji="🌱" label="Soil Moisture" live={liveData.soilMoisture} baseline={bl.soil} max={100} unit="%" color="#10B981" />
                </div>

                {/* Long-term disaster trend context */}
                {(() => {
                  const trendRegion = REGIONS.find(r => r.id === selectedLoc.country);
                  if (!trendRegion) return null;
                  return (
                    <div style={{
                      background: 'rgba(245,158,11,0.07)',
                      border: '1px solid rgba(245,158,11,0.25)',
                      borderRadius: '12px', padding: '16px',
                      display: 'flex', gap: '14px', alignItems: 'flex-start'
                    }}>
                      <span style={{ fontSize: '2rem', flexShrink: 0 }}>{trendRegion.disasterIcon}</span>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#F59E0B', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                          20-Year NASA Trend — {trendRegion.name}
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
                          {trendRegion.disasterTitle}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#9CA3AF', lineHeight: 1.55, margin: 0 }}>
                          {trendRegion.disasterSummary}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Suggestions */}
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.4rem' }}>💡</span>
                    <div>
                      <div style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF' }}>
                        What Should You Do Right Now?
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>
                        Simple advice for everyone — easy enough for a child to understand! 🧒
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {suggestions.map((s, i) => {
                      const c = LEVEL_COLOR[s.level] || LEVEL_COLOR.normal;
                      return (
                        <div key={i} style={{
                          background: c.bg,
                          borderLeft: `4px solid ${c.border}`,
                          border: `1px solid ${c.border}30`,
                          borderLeftWidth: '4px',
                          borderRadius: '0 10px 10px 0',
                          padding: '14px'
                        }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '1.6rem', lineHeight: 1, flexShrink: 0 }}>{s.icon}</span>
                            <div>
                              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#FFF', marginBottom: '5px' }}>
                                {s.title}
                              </div>
                              <p style={{ fontSize: '0.82rem', color: '#D1D5DB', lineHeight: 1.65, margin: 0 }}>
                                {s.body}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer attribution */}
                <div style={{
                  fontSize: '0.68rem', color: '#4B5563', lineHeight: 1.6,
                  borderTop: '1px solid var(--border-subtle)', paddingTop: '12px',
                  display: 'flex', gap: '6px', alignItems: 'flex-start'
                }}>
                  <span>📡</span>
                  <span>
                    Real-time weather: <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" style={{ color: '#06B6D4' }}>Open-Meteo.com</a> (free, no API key).
                    Historical trends: NASA GISTEMP v4 · GPCP v3.2 · SMAP L4 · MODIS MOD13A2.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
