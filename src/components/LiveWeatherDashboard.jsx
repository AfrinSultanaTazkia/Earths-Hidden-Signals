import React, { useState, useEffect, useCallback } from 'react';
import { fetchLiveRegionData, compareLiveToTrend, getWindDirection } from '../services/openMeteoApi';
import { REGIONS, GET_TREND_SUMMARY, GENERATE_HISTORICAL_DATA } from '../data/earthSignalsData';

// ─── Kid-Friendly suggestion engine ──────────────────────────────────────────
function buildSuggestions(liveData, regionId) {
  const region = REGIONS.find(r => r.id === regionId) || REGIONS[0];
  const suggestions = [];

  const tempStatus = compareLiveToTrend('temp', liveData.temp, regionId);
  const humidStatus = compareLiveToTrend('humidity', liveData.humidity, regionId);
  const soilStatus = compareLiveToTrend('soilMoisture', liveData.soilMoisture, regionId);
  const rainStatus = compareLiveToTrend('precipitation', liveData.precipitation, regionId);
  const windStatus = compareLiveToTrend('windSpeed', liveData.windSpeed, regionId);

  // Temperature suggestions
  if (tempStatus.level === 'danger') {
    suggestions.push({
      icon: '🥵', color: '#EF4444', level: 'danger',
      title: 'It is Very, Very HOT outside!',
      body: `The temperature is ${liveData.temp.toFixed(1)}°C — way hotter than usual! Stay inside, drink lots of water 💧, and don't go out in the sun between 11am and 4pm!`,
      whoShouldAct: '👨‍👩‍👧 Everyone, especially kids & elderly'
    });
  } else if (tempStatus.level === 'warning') {
    suggestions.push({
      icon: '🌡️', color: '#F59E0B', level: 'warning',
      title: 'Temperature is a bit high today',
      body: `It's ${liveData.temp.toFixed(1)}°C — a little warmer than the usual ${(liveData.temp - tempStatus.diff).toFixed(1)}°C. Keep a water bottle nearby and wear light clothes!`,
      whoShouldAct: '🌾 Farmers: Water crops in early morning or evening'
    });
  }

  // Humidity suggestions
  if (humidStatus.level === 'danger') {
    suggestions.push({
      icon: '💦', color: '#EF4444', level: 'danger',
      title: 'Air is Extremely Humid (Sticky & Heavy)!',
      body: `Humidity is at ${liveData.humidity}%! When it's this sticky, diseases like dengue mosquitoes love to breed in standing water. Help empty any open containers of water near your home!`,
      whoShouldAct: '🏥 Health Workers: Alert communities about mosquito breeding'
    });
  } else if (humidStatus.level === 'warning') {
    suggestions.push({
      icon: '🌫️', color: '#F59E0B', level: 'warning',
      title: 'It\'s Quite Humid Today',
      body: `The air moisture is ${liveData.humidity}%, which feels heavy. Make sure your home is well-ventilated, and avoid keeping food uncovered as it can spoil faster.`,
      whoShouldAct: '🏠 Families: Keep doors open and use fans'
    });
  }

  // Rain / Precipitation
  if (rainStatus.level === 'danger') {
    suggestions.push({
      icon: '⚠️', color: '#EF4444', level: 'danger',
      title: `Heavy Rain Alert for ${region.name}!`,
      body: `Right now ${liveData.precipitation.toFixed(1)} mm of rain is falling — this is a LOT! ${region.disasterIcon} ${region.disasterType} risk is HIGH. Move to higher ground if near rivers. Don't walk through flooded streets — the water may be deeper than it looks!`,
      whoShouldAct: '🚑 Emergency Teams: Prepare rescue equipment now'
    });
  } else if (rainStatus.level === 'warning') {
    suggestions.push({
      icon: '🌧️', color: '#06B6D4', level: 'warning',
      title: 'Moderate Rain Right Now',
      body: `${liveData.precipitation.toFixed(1)} mm of rain is currently falling. Farmers should check if drainage ditches are clear! Families should avoid low-lying roads.`,
      whoShouldAct: '🌾 Farmers: Check field drainage channels'
    });
  }

  // Soil Moisture — relevant for Nepal landslides, India wildfire, Bangladesh flood
  if (soilStatus.level === 'danger') {
    if (regionId === 'nepal') {
      suggestions.push({
        icon: '⛰️', color: '#EF4444', level: 'danger',
        title: 'DANGER: Soil is Very Wet — Landslide Risk!',
        body: `Soil moisture is at ${liveData.soilMoisture}%! When mountain soil gets this wet, rocks and mud can slide down slopes very fast. Stay far from steep hills and river banks right now!`,
        whoShouldAct: '🚑 Responders: Monitor slopes & alert mountain communities'
      });
    } else if (regionId === 'bangladesh') {
      suggestions.push({
        icon: '🌊', color: '#EF4444', level: 'danger',
        title: 'Soil is Saturated — Flooding is Very Likely!',
        body: `The soil is ${liveData.soilMoisture}% full of water! When soil is this full, rain water cannot be absorbed and runs straight into rivers, causing them to overflow. Prepare early!`,
        whoShouldAct: '🏠 Families: Move important items to higher shelves now'
      });
    } else if (regionId === 'india') {
      suggestions.push({
        icon: '💧', color: '#06B6D4', level: 'normal',
        title: 'Good News: Soil Moisture is Normal',
        body: `Soil moisture at ${liveData.soilMoisture}% means forests aren't too dry today, which reduces wildfire risk. But keep an eye on temperatures!`,
        whoShouldAct: '🌾 Farmers: Good conditions for planting right now'
      });
    }
  } else if (soilStatus.level === 'low' && regionId === 'india') {
    suggestions.push({
      icon: '🔥', color: '#F59E0B', level: 'warning',
      title: 'Dry Soil Alert — Wildfire Risk Increasing',
      body: `Soil moisture is only ${liveData.soilMoisture}% — the ground is getting dry! Dry soil + hot temperatures = higher chance of forest fires. Forestry teams should be on alert!`,
      whoShouldAct: '🌾 Farmers: Irrigate crops; avoid burning anything'
    });
  }

  // Wind
  if (windStatus.level === 'danger') {
    suggestions.push({
      icon: '🌪️', color: '#EF4444', level: 'danger',
      title: 'Very Strong Winds!',
      body: `Wind speed is ${liveData.windSpeed.toFixed(1)} km/h — strong enough to knock down tree branches and loosen rooftops! Stay indoors and secure any loose objects outside your home.`,
      whoShouldAct: '🏠 Everyone: Stay indoors and secure loose items'
    });
  }

  // If everything is fine, add a positive message
  if (suggestions.length === 0) {
    suggestions.push({
      icon: '✅', color: '#10B981', level: 'good',
      title: `All Clear in ${region.name} Right Now! 🎉`,
      body: `Current weather conditions look normal compared to the long-term average. Temperature is ${liveData.temp.toFixed(1)}°C, humidity ${liveData.humidity}% — all within safe ranges. A good day to go outside and play! 🌳`,
      whoShouldAct: '😊 Enjoy the day, but stay weather-aware!'
    });
  }

  return suggestions;
}

// ─── Animated counter ────────────────────────────────────────────────────────
function AnimatedValue({ value, decimals = 1, unit = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value) || 0;
    const duration = 800;
    const steps = 30;
    const increment = (end - start) / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      start += increment;
      setDisplay(start);
      if (step >= steps) { setDisplay(end); clearInterval(timer); }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{display.toFixed(decimals)}{unit}</span>;
}

// ─── Alert level colors ──────────────────────────────────────────────────────
const LEVEL_COLORS = {
  danger:  { bg: 'rgba(239,68,68,0.12)', border: '#EF4444', badge: '#EF4444' },
  warning: { bg: 'rgba(245,158,11,0.12)', border: '#F59E0B', badge: '#F59E0B' },
  good:    { bg: 'rgba(16,185,129,0.12)', border: '#10B981', badge: '#10B981' },
  normal:  { bg: 'rgba(6,182,212,0.10)',  border: '#06B6D4', badge: '#06B6D4' },
  low:     { bg: 'rgba(99,102,241,0.12)', border: '#6366F1', badge: '#6366F1' }
};

// ─── Single live metric card ─────────────────────────────────────────────────
function LiveMetricCard({ emoji, label, value, unit, status, decimals = 1, trendDesc, helpText }) {
  const c = LEVEL_COLORS[status?.level || 'normal'];
  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      transition: 'all 0.4s ease'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1.8rem' }}>{emoji}</span>
        <span style={{
          fontSize: '0.68rem', fontWeight: '800', padding: '2px 8px',
          borderRadius: '20px', background: c.badge + '22', color: c.badge,
          border: `1px solid ${c.badge}44`
        }}>
          {status?.label || '🟢 Normal'}
        </span>
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FFFFFF', lineHeight: 1 }}>
        <AnimatedValue value={value} decimals={decimals} unit="" />
        <span style={{ fontSize: '1rem', fontWeight: '600', color: c.border, marginLeft: '4px' }}>{unit}</span>
      </div>
      {status?.diff !== undefined && (
        <div style={{ fontSize: '0.72rem', color: status.diff >= 0 ? '#F59E0B' : '#10B981' }}>
          {status.diffStr} vs. 20-yr baseline
        </div>
      )}
      {helpText && (
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.3, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px', marginTop: '2px' }}>
          {helpText}
        </div>
      )}
    </div>
  );
}

// ─── Trend comparison bar ────────────────────────────────────────────────────
function TrendCompareBar({ label, liveVal, baselineVal, max, unit, color }) {
  const liveWidth = Math.min(100, (liveVal / max) * 100);
  const baseWidth = Math.min(100, (baselineVal / max) * 100);
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700' }}>{label}</span>
        <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem' }}>
          <span style={{ color }}><span style={{ opacity: 0.7 }}>Live: </span><strong>{liveVal.toFixed(1)}{unit}</strong></span>
          <span style={{ color: 'var(--text-dim)' }}><span style={{ opacity: 0.7 }}>Avg: </span>{baselineVal.toFixed(1)}{unit}</span>
        </div>
      </div>
      <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px' }}>
        {/* baseline marker */}
        <div style={{
          position: 'absolute', left: `${baseWidth}%`, top: '-3px',
          width: '2px', height: '14px', background: 'rgba(255,255,255,0.4)', borderRadius: '2px',
          zIndex: 2
        }} title={`Baseline: ${baselineVal}${unit}`} />
        {/* live bar */}
        <div style={{
          width: `${liveWidth}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: '4px', transition: 'width 0.8s ease'
        }} />
      </div>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '2px' }}>
        ↑ White line = 20-year average baseline
      </div>
    </div>
  );
}

// ─── Main LiveWeatherDashboard Component ─────────────────────────────────────
export default function LiveWeatherDashboard({ regionId = 'bangladesh' }) {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const region = REGIONS.find(r => r.id === regionId) || REGIONS[0];

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLiveRegionData(region.lat, region.lng);
      setLiveData(data);
      setLastFetched(new Date());
      if (!data.isRealApi) setError('Showing estimated data — could not reach live API');
    } catch (e) {
      setError('Could not load live data: ' + e.message);
    } finally {
      setLoading(false);
    }
  }, [region.lat, region.lng]);

  // Auto-load when region changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Historical baselines for comparison bars
  const trendTemp = GET_TREND_SUMMARY(regionId, 'temperature');
  const trendRain = GET_TREND_SUMMARY(regionId, 'rainfall');
  const trendSoil = GET_TREND_SUMMARY(regionId, 'soil_moisture');

  // region baseline approximate values from historical data arrays
  const histTemp = GENERATE_HISTORICAL_DATA(regionId, 'temperature');
  const baselineTemp = histTemp.length > 0 ? histTemp[histTemp.length - 1].value : 28;

  const windDir = liveData ? getWindDirection(liveData.windDirection) : { arrow: '↑', label: 'N' };

  const suggestions = liveData ? buildSuggestions(liveData, regionId) : [];

  // Status objects for each metric
  const tempStatus = liveData ? compareLiveToTrend('temp', liveData.temp, regionId) : null;
  const humidStatus = liveData ? compareLiveToTrend('humidity', liveData.humidity, regionId) : null;
  const soilStatus = liveData ? compareLiveToTrend('soilMoisture', liveData.soilMoisture, regionId) : null;
  const rainStatus = liveData ? compareLiveToTrend('precipitation', liveData.precipitation, regionId) : null;
  const windStatus = liveData ? compareLiveToTrend('windSpeed', liveData.windSpeed, regionId) : null;

  return (
    <div style={S.wrapper}>
      {/* ── Header ── */}
      <div style={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={S.liveDot} />
              <span style={S.liveLabel}>LIVE WEATHER DATA</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                via Open-Meteo API
              </span>
            </div>
            <h3 style={S.regionTitle}>
              {region.flag} {region.name} — Right Now
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              📍 Coordinates: {region.lat.toFixed(2)}°N, {region.lng.toFixed(2)}°E
              {lastFetched && (
                <span style={{ marginLeft: '12px', color: 'var(--text-dim)' }}>
                  ⏱️ Updated: {lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {liveData && (
            <div style={S.weatherBig}>
              <span style={{ fontSize: '2.4rem' }}>{liveData.weatherEmoji}</span>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#FFF', lineHeight: 1 }}>
                  {liveData.temp.toFixed(1)}°C
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{liveData.weatherLabel}</div>
              </div>
            </div>
          )}
          <button onClick={loadData} style={S.refreshBtn} disabled={loading}>
            {loading ? '⏳' : '🔄'} {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── API status notice ── */}
      {!liveData?.isRealApi && liveData && (
        <div style={S.offlineBanner}>
          ⚠️ <strong>Offline / Estimated Mode:</strong> Showing approximate regional values because the live API could not be reached right now. Data will auto-retry every 5 minutes.
        </div>
      )}
      {liveData?.isRealApi && (
        <div style={S.onlineBanner}>
          ✅ <strong>Live Data Active</strong> — Real-time readings from Open-Meteo satellite analysis ({liveData.timezone} timezone)
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && !liveData && (
        <div style={S.loadingBox}>
          <div style={S.spinner} />
          <span style={{ color: 'var(--text-muted)', marginLeft: '12px' }}>
            Fetching live weather for {region.name}...
          </span>
        </div>
      )}

      {/* ── Live metric cards grid ── */}
      {liveData && (
        <>
          <div style={S.metricsGrid}>
            <LiveMetricCard
              emoji="🌡️" label="Temperature" value={liveData.temp} unit="°C"
              status={tempStatus} decimals={1}
              helpText={`Feels like ${liveData.feelsLike.toFixed(1)}°C with humidity & wind`}
            />
            <LiveMetricCard
              emoji="💧" label="Humidity" value={liveData.humidity} unit="%"
              status={humidStatus} decimals={0}
              helpText="Relative humidity — how much moisture is in the air"
            />
            <LiveMetricCard
              emoji="🌧️" label="Precipitation Now" value={liveData.precipitation} unit=" mm"
              status={rainStatus} decimals={1}
              helpText="Rain falling right now at this moment"
            />
            <LiveMetricCard
              emoji="🌱" label="Soil Moisture" value={liveData.soilMoisture} unit="%"
              status={soilStatus} decimals={0}
              helpText="How wet the top layer of soil is (affects floods & landslides)"
            />
            <LiveMetricCard
              emoji="💨" label={`Wind ${windDir.arrow} ${windDir.label}`} value={liveData.windSpeed} unit=" km/h"
              status={windStatus} decimals={1}
              helpText={`Blowing from the ${windDir.label} direction`}
            />
            <LiveMetricCard
              emoji="☁️" label="Cloud Cover" value={liveData.cloudCover} unit="%"
              status={{ level: 'normal', label: liveData.cloudCover > 80 ? '☁️ Cloudy' : liveData.cloudCover > 40 ? '⛅ Partly' : '☀️ Clear' }}
              decimals={0}
              helpText="How much of the sky is covered by clouds right now"
            />
            <LiveMetricCard
              emoji="🌍" label="Air Pressure" value={liveData.pressure} unit=" hPa"
              status={{ level: 'normal', label: liveData.pressure < 1000 ? '🟡 Low Pressure' : '🟢 Normal' }}
              decimals={0}
              helpText="Low pressure usually means rain is coming. High = clear weather!"
            />
            <LiveMetricCard
              emoji="🪨" label="Soil Temperature" value={liveData.soilTemp} unit="°C"
              status={{ level: 'normal', label: liveData.soilTemp > 35 ? '🟡 Warm' : '🟢 Normal' }}
              decimals={1}
              helpText="Temperature just under the ground surface"
            />
          </div>

          {/* ── Trend comparison bars ── */}
          <div style={S.compareSection} className="glass-panel">
            <div style={S.compareSectionTitle}>
              <span>📊</span>
              <div>
                <div style={S.compareSectionHeading}>Compare Live vs. 20-Year Trend Baseline</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  White line = NASA long-term average for {region.name}. Colored bar = Today's live reading.
                </div>
              </div>
            </div>
            <div style={S.barsWrapper}>
              <TrendCompareBar
                label="🌡️ Temperature (°C)"
                liveVal={liveData.temp}
                baselineVal={baselineTemp}
                max={50} unit="°C" color="#F59E0B"
              />
              <TrendCompareBar
                label="💧 Humidity (%)"
                liveVal={liveData.humidity}
                baselineVal={regionId === 'bangladesh' ? 76 : regionId === 'india' ? 58 : regionId === 'nepal' ? 68 : 42}
                max={100} unit="%" color="#06B6D4"
              />
              <TrendCompareBar
                label="🌧️ Precipitation (mm)"
                liveVal={liveData.precipitation}
                baselineVal={regionId === 'bangladesh' ? 5.0 : regionId === 'india' ? 3.5 : regionId === 'nepal' ? 6.0 : 1.5}
                max={60} unit=" mm" color="#3B82F6"
              />
              <TrendCompareBar
                label="🌱 Soil Moisture (%)"
                liveVal={liveData.soilMoisture}
                baselineVal={regionId === 'bangladesh' ? 65 : regionId === 'india' ? 40 : regionId === 'nepal' ? 58 : 28}
                max={100} unit="%" color="#10B981"
              />
            </div>
          </div>

          {/* ── Trend connection banner ── */}
          <div style={S.trendConnectionBox}>
            <div style={S.trendIcon}>{region.disasterIcon}</div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-amber)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
                Long-Term Trend for {region.name}
              </div>
              <div style={{ fontSize: '1rem', color: '#FFF', fontWeight: '700', marginBottom: '4px' }}>
                {region.disasterTitle}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {region.disasterSummary}
              </div>
              <div style={{ marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                ℹ️ The live readings above show <strong>today's snapshot</strong>. The long-term NASA trend is what has been changing over 20+ years. Compare them to understand if today is unusual.
              </div>
            </div>
          </div>

          {/* ── Child-friendly suggestions ── */}
          <div style={S.suggestionsSection}>
            <div style={S.suggestionHeading}>
              <span style={{ fontSize: '1.6rem' }}>💡</span>
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#FFF' }}>
                  What Should You Do Right Now?
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Simple advice anyone can follow — even a child can understand! 🧒
                </div>
              </div>
            </div>

            <div style={S.suggestionsGrid}>
              {suggestions.map((s, i) => {
                const c = LEVEL_COLORS[s.level] || LEVEL_COLORS.normal;
                return (
                  <div key={i} style={{
                    ...S.suggestionCard,
                    background: c.bg,
                    borderLeft: `4px solid ${c.border}`,
                    borderTop: `1px solid ${c.border}44`,
                    borderRight: `1px solid ${c.border}22`,
                    borderBottom: `1px solid ${c.border}22`,
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '2rem', lineHeight: 1 }}>{s.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF', marginBottom: '6px' }}>
                          {s.title}
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.6, margin: 0 }}>
                          {s.body}
                        </p>
                        <div style={{
                          marginTop: '10px', fontSize: '0.72rem', fontWeight: '700',
                          color: c.border, background: c.border + '15',
                          border: `1px solid ${c.border}33`,
                          borderRadius: '20px', padding: '3px 10px', display: 'inline-block'
                        }}>
                          {s.whoShouldAct}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Data source footnote ── */}
          <div style={S.footnote}>
            <span style={{ color: 'var(--color-cyan)' }}>📡</span>
            <span>
              Live weather data from <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-cyan)' }}>Open-Meteo.com</a> (open-access, zero API key). 
              Historical trends from NASA GISTEMP v4, GPCP v3.2, SMAP L4, MODIS MOD13A2.
            </span>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const S = {
  wrapper: {
    background: 'rgba(7, 10, 18, 0.6)',
    border: '1px solid var(--border-glow)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  liveDot: {
    display: 'inline-block',
    width: '8px', height: '8px',
    borderRadius: '50%',
    background: '#10B981',
    boxShadow: '0 0 8px #10B981',
    animation: 'pulse 2s ease-in-out infinite'
  },
  liveLabel: {
    fontSize: '0.72rem', fontWeight: '800',
    color: '#10B981', letterSpacing: '0.08em',
    textTransform: 'uppercase', fontFamily: 'monospace'
  },
  regionTitle: {
    fontSize: '1.5rem', fontWeight: '900', color: '#FFFFFF', margin: 0
  },
  weatherBig: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '12px', padding: '12px 18px'
  },
  refreshBtn: {
    background: 'var(--color-cyan-glow)',
    border: '1px solid var(--color-cyan)',
    color: 'var(--color-cyan)',
    fontSize: '0.82rem', fontWeight: '700',
    padding: '10px 16px', borderRadius: '8px',
    cursor: 'pointer', whiteSpace: 'nowrap'
  },
  onlineBanner: {
    background: 'rgba(16,185,129,0.08)',
    border: '1px solid rgba(16,185,129,0.3)',
    borderRadius: '8px', padding: '8px 14px',
    fontSize: '0.8rem', color: '#10B981'
  },
  offlineBanner: {
    background: 'rgba(245,158,11,0.08)',
    border: '1px solid rgba(245,158,11,0.3)',
    borderRadius: '8px', padding: '8px 14px',
    fontSize: '0.8rem', color: '#F59E0B'
  },
  loadingBox: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '40px', gap: '12px'
  },
  spinner: {
    width: '28px', height: '28px',
    border: '3px solid rgba(6,182,212,0.2)',
    borderTopColor: '#06B6D4',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '12px'
  },
  compareSection: {
    padding: '20px', borderRadius: '12px'
  },
  compareSectionTitle: {
    display: 'flex', gap: '12px', alignItems: 'flex-start',
    marginBottom: '18px', paddingBottom: '14px',
    borderBottom: '1px solid var(--border-subtle)'
  },
  compareSectionHeading: {
    fontSize: '1rem', fontWeight: '800', color: '#FFF', marginBottom: '2px'
  },
  barsWrapper: {
    display: 'flex', flexDirection: 'column', gap: '4px'
  },
  trendConnectionBox: {
    display: 'flex', gap: '16px', alignItems: 'flex-start',
    background: 'rgba(245,158,11,0.07)',
    border: '1px solid rgba(245,158,11,0.25)',
    borderRadius: '12px', padding: '18px'
  },
  trendIcon: {
    fontSize: '2.4rem', lineHeight: 1, flexShrink: 0
  },
  suggestionsSection: {
    display: 'flex', flexDirection: 'column', gap: '14px'
  },
  suggestionHeading: {
    display: 'flex', gap: '12px', alignItems: 'center'
  },
  suggestionsGrid: {
    display: 'flex', flexDirection: 'column', gap: '12px'
  },
  suggestionCard: {
    borderRadius: '0 12px 12px 0',
    padding: '18px', transition: 'all 0.3s ease'
  },
  footnote: {
    display: 'flex', gap: '8px', alignItems: 'flex-start',
    fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.5,
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: '14px'
  }
};
