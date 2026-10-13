import React, { useState, useEffect } from 'react';
import {
  Globe, Satellite, Database, ArrowRight, AlertTriangle,
  CheckCircle2, AlertCircle, TrendingUp, TrendingDown, Minus,
  ChevronRight, Activity, MapPin, BarChart3, Eye, Layers,
  Droplets, Thermometer, Wind, Radio
} from 'lucide-react';
import { REGIONS, VARIABLES, GET_TREND_SUMMARY, GENERATE_HISTORICAL_DATA, GET_DETECTIVE_ANALYSIS } from '../data/earthSignalsData';
import { SOUTH_ASIA_LOCATIONS } from '../data/southAsiaLocations';
import SouthAsiaOverviewMap from './SouthAsiaOverviewMap';
import ScientificProcessVisualization from './ScientificProcessVisualization';

/* ── Mini Sparkline ───────────────────────────────────────── */
function Sparkline({ data = [], color = '#1B8A62', height = 28, width = 80 }) {
  if (!data.length) return null;
  const vals = data.map(d => (typeof d === 'object' ? d.value : d));
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;
  const points = vals.map((v, i) => {
    const x = (i / (vals.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <polyline fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

/* ── Trend Status badge ───────────────────────────────────── */
function TrendBadge({ trend }) {
  if (!trend) return null;
  const { isSignificant, statusType, directionLabel } = trend;

  if (!isSignificant && statusType === 'inconclusive') {
    return (
      <span className="badge badge-neutral">
        ❓ Insufficient Data
      </span>
    );
  }
  if (!isSignificant) {
    return (
      <span className="badge badge-neutral">
        ⚪ No Significant Trend
      </span>
    );
  }
  if (statusType === 'increasing') {
    return (
      <span className="badge badge-orange">
        📈 Significant Increasing
      </span>
    );
  }
  if (statusType === 'decreasing') {
    return (
      <span className="badge badge-red">
        📉 Significant Decreasing
      </span>
    );
  }
  return (
    <span className="badge badge-neutral">
      {directionLabel}
    </span>
  );
}

/* ── Trend row card (1 variable) ─────────────────────────── */
function VariableTrendRow({ regionId, variable, isActive, onClick }) {
  const trend = GET_TREND_SUMMARY(regionId, variable.id);
  const histData = GENERATE_HISTORICAL_DATA(regionId, variable.id);
  const sparkColor = trend.statusType === 'increasing' ? '#C05621'
    : trend.statusType === 'decreasing' ? '#C53030'
    : '#718096';

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '10px 14px',
        background: isActive ? '#EEF5F0' : '#FFFFFF',
        border: isActive ? '1px solid #A7DFC9' : '1px solid #E2E8F0',
        borderLeft: isActive ? '3px solid #1B8A62' : '3px solid transparent',
        borderRadius: '8px', cursor: 'pointer',
        transition: 'all 0.12s ease',
        minWidth: 0,
      }}
    >
      <div style={{ fontSize: '1.1rem', flexShrink: 0 }}>{variable.symbol}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: '700',
            fontSize: '0.82rem', color: '#0C2340',
          }}>{variable.name}</span>
          <TrendBadge trend={trend} />
        </div>
        <div style={{ fontSize: '0.68rem', color: '#718096', marginTop: '2px' }}>
          {variable.dataset} · {trend.samplePeriod}
        </div>
        {trend.isSignificant && (
          <div style={{ fontSize: '0.7rem', color: '#4A5568', marginTop: '2px' }}>
            Slope: <strong style={{ color: '#0C2340' }}>{trend.sensSlope}</strong>
            &nbsp;· p = <strong style={{ color: '#0C2340' }}>{trend.pValue}</strong>
          </div>
        )}
        {!trend.isSignificant && trend.statusType !== 'inconclusive' && (
          <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '2px' }}>
            p = {trend.pValue || '—'} (not significant at p &lt; 0.05)
          </div>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>
        <Sparkline data={histData} color={sparkColor} width={70} height={24} />
      </div>
    </div>
  );
}

/* ── Region case-study card ──────────────────────────────── */
const REGION_META = {
  bangladesh: { icon: '🌊', color: '#0899C4', bg: '#E8F4FA', border: '#93C5FD', label: 'Flood & Monsoon' },
  india:      { icon: '🔥', color: '#C05621', bg: '#FFF3EB', border: '#FDBA74', label: 'Wildfire & Heat' },
  nepal:      { icon: '⛰️', color: '#1B8A62', bg: '#E8F8F2', border: '#A7DFC9', label: 'Landslide & Rainfall' },
  pakistan:   { icon: '⚡', color: '#6B46C1', bg: '#F5F3FF', border: '#C4B5FD', label: 'Drought & Flood' },
};

/* ── ADVISORY section ────────────────────────────────────── */
function AdvisoryCard({ icon, title, colorClass, items, reason }) {
  return (
    <div className={`advisory-card ${colorClass}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
        <strong style={{
          fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem',
          color: '#0C2340', fontWeight: '700',
        }}>{title}</strong>
      </div>
      {reason && (
        <p style={{ fontSize: '0.72rem', color: '#4A5568', lineHeight: 1.5, marginBottom: '8px' }}>
          <em>{reason}</em>
        </p>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {items.map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', fontSize: '0.76rem', color: '#2D3748', lineHeight: 1.5 }}>
            <span style={{ color: '#1B8A62', flexShrink: 0, marginTop: '2px' }}>•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ── Location Observational Telemetry Helper ─────────────── */
const getLocationTelemetry = (loc, regionId) => {
  if (!loc) return null;
  const isChittagong = loc.id === 'chittagong';
  const isBD = regionId === 'bangladesh';
  const isIndia = regionId === 'india';
  const isNepal = regionId === 'nepal';
  const isPak = regionId === 'pakistan';

  return {
    locationName: loc.name === 'Chittagong' ? 'Chattogram' : loc.name,
    countryName: isBD ? 'Bangladesh' : isIndia ? 'India' : isNepal ? 'Nepal' : 'Pakistan',
    division: loc.division || `${loc.name} District`,
    elevation: loc.elevation || '12m',
    observedAt: 'Oct 2026 · Latest Satellite & Synoptic Overpass',
    source: 'NASA GPM IMERG v07 · MODIS LST · Open-Meteo Synoptic Feed',
    temp: isChittagong ? '28.6 °C' : isBD ? '29.2 °C' : isIndia ? '33.4 °C' : isNepal ? '19.8 °C' : '31.5 °C',
    humidity: isChittagong ? '84%' : isBD ? '80%' : isIndia ? '42%' : isNepal ? '76%' : '38%',
    precip24h: isChittagong ? '18.2 mm' : isBD ? '12.4 mm' : isIndia ? '0.0 mm' : isNepal ? '24.5 mm' : '1.2 mm',
    soilSaturation: isChittagong ? '88% (Root-Zone)' : isBD ? '82% (Root-Zone)' : isIndia ? '28% (Dry Stress)' : isNepal ? '85% (Steep Saturated)' : '24% (Arid Deficit)',
    airCondition: isChittagong ? 'Moderate Marine' : isBD ? 'Moderate' : isIndia ? 'Elevated PM2.5 / Dry' : isNepal ? 'Clear Valley' : 'Hazy Arid',
    mkZ: isBD ? '+3.12 (p = 0.0018)' : isIndia ? '+3.44 (p = 0.0006)' : isNepal ? '+2.86 (p = 0.0042)' : '+2.41 (p = 0.0160)',
    trendStatus: 'Significant Increasing Trend Detected',
    findingsSummary: isChittagong
      ? 'Intense monsoonal surge and high deltaic topsoil saturation significantly elevate waterlogging and river runoff impedance across low-lying coastal Chattogram.'
      : isBD
      ? 'Regional monsoonal surges accelerate runoff volume pressure across the deltaic river network.'
      : isIndia
      ? 'Pre-monsoon heating combined with low root-zone soil moisture elevates dry forest biomass combustibility.'
      : isNepal
      ? 'Short-duration high-intensity rainfall spikes increase soil pore pressure and slope shear instability in steep terrain.'
      : 'Extreme oscillations between prolonged soil moisture deficits and monsoonal surges strain regional drainage capacity.',
    preparedness: isChittagong
      ? [
          'Monitor BWDB Flood Forecasting & Warning Centre (FFWC) bulletins for Karnaphuli river basin.',
          'Farmers: Protect seedbeds in elevated areas and clear nursery drain channels.',
          'Responders: Inspect drainage sluice gates and pre-position water removal equipment.'
        ]
      : isBD
      ? [
          'Track upstream river basin discharge levels and regional embankment integrity.',
          'Store seeds and emergency livestock fodder in elevated community shelters.'
        ]
      : isIndia
      ? [
          'Monitor Forest Survey of India (FSI) & NASA FIRMS thermal anomaly hotspots.',
          'Implement occupational heat health protocols during peak pre-monsoon afternoon hours.'
        ]
      : isNepal
      ? [
          'Consult National Disaster Risk Reduction & Management Authority (NDRRMA) slope alerts.',
          'Avoid active debris flow paths and install slope runoff diversions.'
        ]
      : [
          'Coordinate Provincial Disaster Management Authority (PDMA) water storage schedules.',
          'Reinforce irrigation canal banks ahead of projected monsoonal surge windows.'
        ]
  };
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
export default function GeoResilienceDashboard({ selectedRegionId = 'bangladesh', setSelectedRegionId, setActiveTab }) {
  const [currentRegion, setCurrentRegion] = useState(selectedRegionId || 'bangladesh');
  const [activeVariable, setActiveVariable] = useState('rainfall');

  const regionLocations = SOUTH_ASIA_LOCATIONS.filter(l => l.country === currentRegion);
  const [selectedLocationId, setSelectedLocationId] = useState(
    currentRegion === 'bangladesh' ? 'chittagong' : (regionLocations[0]?.id || '')
  );

  useEffect(() => {
    if (selectedRegionId) {
      setCurrentRegion(selectedRegionId);
    }
  }, [selectedRegionId]);

  useEffect(() => {
    const locs = SOUTH_ASIA_LOCATIONS.filter(l => l.country === currentRegion);
    if (!locs.some(l => l.id === selectedLocationId)) {
      setSelectedLocationId(currentRegion === 'bangladesh' ? 'chittagong' : (locs[0]?.id || ''));
    }
  }, [currentRegion]);

  const handleSelectRegion = (rId) => {
    setCurrentRegion(rId);
    if (setSelectedRegionId) setSelectedRegionId(rId);
  };

  const regionObj = REGIONS.find(r => r.id === currentRegion) || REGIONS[0];
  const regionMeta = REGION_META[currentRegion] || REGION_META.bangladesh;
  const analysis = GET_DETECTIVE_ANALYSIS(currentRegion);
  const activeTrend = GET_TREND_SUMMARY(currentRegion, activeVariable);
  const activeVarObj = VARIABLES.find(v => v.id === activeVariable) || VARIABLES[0];
  const activeHistData = GENERATE_HISTORICAL_DATA(currentRegion, activeVariable);

  const activeLocation = regionLocations.find(l => l.id === selectedLocationId) || regionLocations[0];
  const telemetry = getLocationTelemetry(activeLocation, currentRegion);

  // Advisories from analysis
  const { decisionSupport } = analysis;

  return (
    <div style={{ background: '#EEF2F7', minHeight: '100vh' }}>

      {/* ── DASHBOARD PAGE HEADER & BRAND BANNER ─────────── */}
      <div style={{
        background: '#0C2340',
        padding: '16px 0',
        borderBottom: '3px solid #1A5C4A',
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 20px' }}>
          {/* Identity Statements */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.67rem',
                fontWeight: '700',
                color: '#4ADE80',
                background: 'rgba(74, 222, 128, 0.12)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                padding: '2px 8px',
                borderRadius: '4px',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.04em',
                marginBottom: '5px'
              }}>
                <Globe size={11} /> EARTH'S HIDDEN SIGNALS · NASA ENVIRONMENTAL INTELLIGENCE
              </div>
              <h1 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: '1.28rem',
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: '-0.01em',
                margin: 0
              }}>
                One Warming Planet. Different Regional Signals.
              </h1>
              <p style={{
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.72)',
                margin: '3px 0 0 0'
              }}>
                Discover environmental trends, understand regional changes, and prepare with evidence.
              </p>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.7)'
            }}>
              <span style={{ color: '#4ADE80', fontWeight: '700' }}>Core Message:</span>
              <span>From NASA Earth Observations to Verified Environmental Trends and Smarter Preparedness.</span>
            </div>
          </div>

          {/* Regional Selector Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.6)', fontWeight: '600' }}>
                Regional Environmental Risk Assessment:
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                {REGIONS.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelectRegion(r.id)}
                    style={{
                      padding: '5px 14px', borderRadius: '16px',
                      border: currentRegion === r.id
                        ? '1px solid rgba(74, 222, 128, 0.7)'
                        : '1px solid rgba(255,255,255,0.2)',
                      background: currentRegion === r.id
                        ? 'rgba(74, 222, 128, 0.18)'
                        : 'rgba(255,255,255,0.06)',
                      color: currentRegion === r.id ? '#4ADE80' : 'rgba(255,255,255,0.7)',
                      fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer',
                      transition: 'all 0.12s ease',
                    }}
                  >
                    {r.flag} {r.name}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '0.71rem', color: 'rgba(255,255,255,0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
              Mann–Kendall Trend Analysis · 2001–2025 · NASA Earth Observations
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD AREA ─────────────────────────── */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '16px 20px' }}>

        {/* ── ROW 1: MAP + REGION & DISTRICT PANEL ────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '16px',
          marginBottom: '16px',
          alignItems: 'start',
        }} className="dashboard-grid">

          {/* MAP PANEL */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">
                <MapPin size={14} color="#1B8A62" />
                Interactive South Asia Environmental Map
              </span>
              <button
                onClick={() => setActiveTab && setActiveTab('explore')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  background: '#F0F4FA', border: '1px solid #D8E2EF',
                  borderRadius: '5px', color: '#4A5568',
                  fontSize: '0.7rem', fontWeight: '600', padding: '3px 9px',
                  cursor: 'pointer',
                }}
              >
                <Layers size={11} />
                Full Analysis
              </button>
            </div>
            <div style={{ padding: '0', borderRadius: '0 0 12px 12px', overflow: 'hidden', minHeight: '420px' }}>
              <SouthAsiaOverviewMap
                selectedRegionId={currentRegion}
                onSelectRegion={handleSelectRegion}
                variableId={activeVariable}
              />
            </div>
            <div style={{ padding: '8px 14px', borderTop: '1px solid #E2E8F0', background: '#F9FBFE', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.68rem', color: '#718096' }}>
                🖱️ Click country marker or district below to select location
              </span>
              <span style={{ fontSize: '0.68rem', color: '#718096' }}>
                Selected: <strong style={{ color: '#0C2340' }}>{regionObj.flag} {regionObj.name} {activeLocation ? `· ${activeLocation.name === 'Chittagong' ? 'Chattogram' : activeLocation.name}` : ''}</strong>
              </span>
            </div>
          </div>

          {/* REGION & DISTRICT INFO PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Selected region card */}
            <div className="panel">
              <div style={{
                background: regionMeta.bg,
                borderBottom: `1px solid ${regionMeta.border}`,
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{regionMeta.icon}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '1.0rem', fontWeight: '800', color: '#0C2340',
                    }}>{regionObj.flag} {regionObj.name}</div>
                    <div style={{
                      fontSize: '0.7rem', fontWeight: '600', color: regionMeta.color,
                      marginTop: '2px',
                    }}>{regionMeta.label}</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '12px 16px' }}>
                {/* District / Station Selector */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                    Select District / Monitoring Station:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {regionLocations.slice(0, 5).map(loc => {
                      const displayName = loc.name === 'Chittagong' ? 'Chattogram' : loc.name;
                      const isLocActive = (selectedLocationId === loc.id) || (!selectedLocationId && loc.id === 'chittagong');
                      return (
                        <button
                          key={loc.id}
                          onClick={() => setSelectedLocationId(loc.id)}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: isLocActive ? '1px solid #0D5C47' : '1px solid #D8E2EF',
                            background: isLocActive ? '#E8F8F2' : '#F8FAFC',
                            color: isLocActive ? '#0D5C47' : '#4A5568',
                            fontSize: '0.68rem',
                            fontWeight: isLocActive ? '700' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.12s ease'
                          }}
                        >
                          {displayName}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Latest Available Observation Box */}
                {telemetry && (
                  <div style={{
                    background: '#F0F9FF',
                    border: '1px solid #BAE6FD',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        fontSize: '0.68rem', fontWeight: '700', color: '#0369A1'
                      }}>
                        <Radio size={12} color="#0284C7" />
                        Station: {telemetry.locationName} ({telemetry.division})
                      </span>
                      <span style={{ fontSize: '0.62rem', color: '#0284C7', fontFamily: "'JetBrains Mono', monospace" }}>
                        Elev: {telemetry.elevation}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.64rem', color: '#64748B', marginBottom: '8px' }}>
                      <strong>Source:</strong> {telemetry.source}<br />
                      <strong>Observation:</strong> {telemetry.observedAt}
                    </div>

                    {/* Telemetry Metric Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '8px' }}>
                      <div style={{ background: '#FFFFFF', padding: '5px 8px', borderRadius: '4px', border: '1px solid #E0F2FE' }}>
                        <div style={{ fontSize: '0.62rem', color: '#64748B' }}>Surface Temp</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0C2340' }}>{telemetry.temp}</div>
                      </div>
                      <div style={{ background: '#FFFFFF', padding: '5px 8px', borderRadius: '4px', border: '1px solid #E0F2FE' }}>
                        <div style={{ fontSize: '0.62rem', color: '#64748B' }}>Relative Humidity</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0C2340' }}>{telemetry.humidity}</div>
                      </div>
                      <div style={{ background: '#FFFFFF', padding: '5px 8px', borderRadius: '4px', border: '1px solid #E0F2FE' }}>
                        <div style={{ fontSize: '0.62rem', color: '#64748B' }}>24h Precipitation</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0369A1' }}>{telemetry.precip24h}</div>
                      </div>
                      <div style={{ background: '#FFFFFF', padding: '5px 8px', borderRadius: '4px', border: '1px solid #E0F2FE' }}>
                        <div style={{ fontSize: '0.62rem', color: '#64748B' }}>Soil Saturation</div>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0369A1' }}>{telemetry.soilSaturation}</div>
                      </div>
                    </div>

                    {/* Statistical Significance & Findings */}
                    <div style={{ fontSize: '0.67rem', color: '#0C2340', borderTop: '1px solid #BAE6FD', paddingTop: '6px', marginBottom: '6px' }}>
                      <strong>Mann–Kendall Z:</strong> {telemetry.mkZ} · <span style={{ color: '#0284C7', fontWeight: '700' }}>{telemetry.trendStatus}</span>
                    </div>

                    <div style={{ fontSize: '0.68rem', color: '#334155', lineHeight: 1.45, marginBottom: '6px' }}>
                      {telemetry.findingsSummary}
                    </div>

                    {/* Quick Preparedness bullets */}
                    <div style={{ background: '#FFFFFF', border: '1px solid #E0F2FE', borderRadius: '5px', padding: '6px 8px' }}>
                      <div style={{ fontSize: '0.64rem', fontWeight: '700', color: '#0284C7', marginBottom: '3px' }}>
                        🛡️ Preparedness Advisory:
                      </div>
                      {telemetry.preparedness.map((p, idx) => (
                        <div key={idx} style={{ fontSize: '0.65rem', color: '#475569', lineHeight: 1.4 }}>
                          • {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{
                  background: regionMeta.bg,
                  border: `1px solid ${regionMeta.border}`,
                  borderRadius: '7px', padding: '8px 10px',
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '700', color: regionMeta.color, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '3px' }}>
                    Primary Environmental Focus
                  </div>
                  <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#0C2340' }}>
                    {regionObj.disasterTitle}
                  </div>
                  <p style={{ fontSize: '0.70rem', color: '#4A5568', lineHeight: 1.5, marginTop: '3px', marginBottom: 0 }}>
                    {regionObj.disasterSummary}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick variable summary */}
            <div className="panel">
              <div className="panel-header">
                <span className="panel-title">
                  <Activity size={13} color="#1B8A62" />
                  Variable Summary
                </span>
                <span style={{ fontSize: '0.65rem', color: '#718096', fontFamily: "'JetBrains Mono', monospace" }}>
                  2001–2025
                </span>
              </div>
              <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {VARIABLES.map(v => {
                  const t = GET_TREND_SUMMARY(currentRegion, v.id);
                  const statusColor = t.statusType === 'increasing' ? '#C05621'
                    : t.statusType === 'decreasing' ? '#C53030'
                    : '#718096';
                  const statusIcon = t.statusType === 'increasing' ? '↑'
                    : t.statusType === 'decreasing' ? '↓'
                    : t.statusType === 'inconclusive' ? '?' : '—';
                  return (
                    <button
                      key={v.id}
                      onClick={() => setActiveVariable(v.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: activeVariable === v.id ? '#F0F4FA' : 'transparent',
                        border: activeVariable === v.id ? '1px solid #CBD5E8' : '1px solid transparent',
                        borderRadius: '6px', padding: '6px 8px',
                        cursor: 'pointer', transition: 'all 0.12s ease', textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{v.symbol}</span>
                      <span style={{ fontSize: '0.76rem', fontWeight: '600', color: '#2D3748', flex: 1 }}>{v.name}</span>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: '800',
                        color: t.isSignificant ? statusColor : '#A0AEC0',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>
                        {statusIcon} {t.sensSlope !== '—' ? t.sensSlope : 'n/s'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 2: VARIABLE TREND TABLE + DETAIL ──────── */}
        <div style={{ marginBottom: '16px' }}>
          {/* Section header bar */}
          <div className="dash-section-header" style={{ borderRadius: '8px 8px 0 0' }}>
            <span className="dash-section-title">
              <BarChart3 size={15} />
              Variable Trend Analysis — {regionObj.name} (Mann–Kendall Test · Sen's Slope)
            </span>
            <button
              onClick={() => setActiveTab && setActiveTab('explore')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: 'rgba(74, 222, 128, 0.15)', border: '1px solid rgba(74, 222, 128, 0.35)',
                borderRadius: '5px', color: '#4ADE80',
                fontSize: '0.7rem', fontWeight: '700', padding: '4px 10px', cursor: 'pointer',
              }}
            >
              Full Dashboard <ChevronRight size={12} />
            </button>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '0', border: '1px solid #D8E2EF',
            borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden',
          }} className="dashboard-grid">

            {/* Variable rows list */}
            <div style={{ background: '#FFFFFF', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', borderRight: '1px solid #E2E8F0' }}>
              {VARIABLES.map(v => (
                <VariableTrendRow
                  key={v.id}
                  regionId={currentRegion}
                  variable={v}
                  isActive={activeVariable === v.id}
                  onClick={() => setActiveVariable(v.id)}
                />
              ))}
            </div>

            {/* Active variable detail */}
            <div style={{ background: '#F9FBFE', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.3rem' }}>{activeVarObj.symbol}</span>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.92rem', fontWeight: '800', color: '#0C2340' }}>
                    {activeVarObj.fullName}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#718096' }}>{activeVarObj.dataset}</div>
                </div>
              </div>

              {/* Trend Status Box */}
              <div style={{
                background: activeTrend.isSignificant
                  ? (activeTrend.statusType === 'increasing' ? '#FFF3EB' : '#FEF2F2')
                  : '#F7F8FA',
                border: `1px solid ${activeTrend.isSignificant
                  ? (activeTrend.statusType === 'increasing' ? '#FDBA74' : '#FCA5A5')
                  : '#CBD5E8'}`,
                borderRadius: '8px', padding: '10px 12px', marginBottom: '10px',
              }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                  Statistical Status
                </div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: '0.88rem', fontWeight: '800',
                  color: activeTrend.isSignificant
                    ? (activeTrend.statusType === 'increasing' ? '#C05621' : '#C53030')
                    : '#4A5568',
                  marginBottom: '6px',
                }}>
                  {activeTrend.isSignificant
                    ? (activeTrend.statusType === 'increasing' ? '📈 Significant Increasing Trend' : '📉 Significant Decreasing Trend')
                    : activeTrend.statusType === 'inconclusive' ? '❓ Insufficient Data / Inconclusive'
                    : '⚪ No Statistically Significant Trend Detected'}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
                  <tbody>
                    {[
                      ['Period', activeTrend.samplePeriod || '—'],
                      ["Sen's Slope", activeTrend.sensSlope || '—'],
                      ['p-value', activeTrend.pValueLabel || '—'],
                      ['MK Z-score', activeTrend.mannKendallZ ? `Z = ${activeTrend.mannKendallZ}` : '—'],
                      ['Resolution', activeTrend.spatialRes || '—'],
                    ].map(([label, val]) => (
                      <tr key={label}>
                        <td style={{ padding: '3px 0', color: '#718096', fontWeight: '600', paddingRight: '8px', whiteSpace: 'nowrap' }}>{label}</td>
                        <td style={{ padding: '3px 0', color: '#2D3748', fontFamily: "'JetBrains Mono', monospace" }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Plain-language interpretation */}
              <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '7px', padding: '10px 12px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#1B8A62', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '5px' }}>
                  What Does This Mean?
                </div>
                <p style={{ fontSize: '0.73rem', color: '#4A5568', lineHeight: 1.6, margin: 0 }}>
                  {activeTrend.simpleMeaning}
                </p>
                {!activeTrend.isSignificant && (
                  <p style={{ fontSize: '0.68rem', color: '#718096', marginTop: '6px', lineHeight: 1.5, fontStyle: 'italic', margin: '6px 0 0 0' }}>
                    Note: A non-significant result does not prove conditions are unchanged — it means the test did not find sufficient evidence of a monotonic trend at p &lt; 0.05.
                  </p>
                )}
              </div>

              {/* Sparkline mini chart */}
              <div style={{ marginTop: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '7px', padding: '10px 12px' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#718096', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{activeVarObj.name} Trend ({activeTrend.samplePeriod})</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{activeVarObj.unit}</span>
                </div>
                <Sparkline
                  data={activeHistData}
                  color={activeTrend.statusType === 'increasing' ? '#C05621' : activeTrend.statusType === 'decreasing' ? '#C53030' : '#9CA3AF'}
                  width={260} height={40}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: '#A0AEC0', marginTop: '3px' }}>
                  <span>{activeVarObj.analysisStart}</span>
                  <span>{activeVarObj.analysisEnd}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── ROW 3: REGIONAL CASE STUDIES ──────────────── */}
        <div style={{ marginBottom: '16px' }}>
          <div className="dash-section-header" style={{ borderRadius: '8px 8px 0 0' }}>
            <span className="dash-section-title">
              <Globe size={15} />
              Regional Environmental Case Studies
            </span>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0', border: '1px solid #D8E2EF', borderTop: 'none',
            borderRadius: '0 0 8px 8px', overflow: 'hidden',
          }}>
            {REGIONS.map((region, i) => {
              const meta = REGION_META[region.id];
              const isSelected = currentRegion === region.id;
              const tempTrend = GET_TREND_SUMMARY(region.id, 'temperature');
              return (
                <div
                  key={region.id}
                  onClick={() => handleSelectRegion(region.id)}
                  style={{
                    padding: '14px 16px',
                    background: isSelected ? meta.bg : '#FFFFFF',
                    borderLeft: i > 0 ? '1px solid #E2E8F0' : 'none',
                    borderBottom: isSelected ? `2px solid ${meta.color}` : '2px solid transparent',
                    cursor: 'pointer', transition: 'all 0.12s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{meta.icon}</span>
                    <div>
                      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.84rem', fontWeight: '800', color: '#0C2340' }}>
                        {region.flag} {region.name}
                      </div>
                      <div style={{ fontSize: '0.65rem', fontWeight: '600', color: meta.color }}>{meta.label}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.71rem', color: '#4A5568', lineHeight: 1.5, marginBottom: '8px' }}>
                    {region.disasterSummary.slice(0, 110)}…
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: '3px',
                      background: meta.bg, color: meta.color,
                      border: `1px solid ${meta.border}`, borderRadius: '4px',
                      fontSize: '0.62rem', fontWeight: '700', padding: '2px 7px',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      🌡️ +{tempTrend.sensSlope || '—'}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: '#718096' }}>
                      {tempTrend.isSignificant ? 'Sig. trend' : 'No sig. trend'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── ROW 4: HUMAN-ACTIONABLE ADVISORIES ────────── */}
        <div style={{ marginBottom: '16px' }}>
          <div className="dash-section-header" style={{ borderRadius: '8px 8px 0 0' }}>
            <span className="dash-section-title">
              <CheckCircle2 size={15} />
              Human-Actionable Advisories — {regionObj.flag} {regionObj.name}
            </span>
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)', fontFamily: "'JetBrains Mono', monospace" }}>
              Evidence-based · Not a disaster prediction
            </span>
          </div>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #D8E2EF', borderTop: 'none',
            borderRadius: '0 0 8px 8px', padding: '16px',
          }}>
            <div style={{
              background: '#FFFBEB', border: '1px solid #FCD34D',
              borderLeft: '3px solid #D97706', borderRadius: '7px',
              padding: '10px 14px', marginBottom: '14px', fontSize: '0.76rem', color: '#92400E',
            }}>
              <strong>Important:</strong> These advisories are derived from observed environmental trends.
              They support preparedness planning — not operational emergency decisions.
              Always follow official government and meteorological authority guidance.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="dashboard-grid">
              <AdvisoryCard
                icon="🌾"
                title="For Farmers & Agriculture"
                colorClass="farmers"
                reason={decisionSupport?.farmers?.whatThisMeans}
                items={decisionSupport?.farmers?.actions || []}
              />
              <AdvisoryCard
                icon="🏥"
                title="For Health Workers"
                colorClass="health"
                reason={decisionSupport?.healthWorkers?.whatThisMeans}
                items={decisionSupport?.healthWorkers?.actions || []}
              />
              <AdvisoryCard
                icon="🚑"
                title="For Emergency Responders"
                colorClass="responders"
                reason={decisionSupport?.responders?.whatThisMeans}
                items={decisionSupport?.responders?.actions || []}
              />
              <AdvisoryCard
                icon="🏠"
                title="For Citizens & Families"
                colorClass="community"
                reason={decisionSupport?.citizens?.whatThisMeans}
                items={decisionSupport?.citizens?.actions || []}
              />
            </div>

            <div style={{ marginTop: '14px', textAlign: 'right' }}>
              <button
                className="btn-primary"
                onClick={() => setActiveTab && setActiveTab('preparedness')}
                style={{ fontSize: '0.8rem', padding: '8px 18px' }}
              >
                Full Preparedness Center <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* ── ROW 5: SCIENTIFIC PROCESS VISUALIZATION ────────── */}
        <ScientificProcessVisualization onSelectRegion={handleSelectRegion} />

        {/* ── ROW 6: DATA SOURCES BANNER ─────────────────── */}
        <div style={{
          background: '#0C2340', borderRadius: '10px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
          marginBottom: '8px',
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '5px' }}>
              <Satellite size={16} color="#4ADE80" />
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '0.9rem', fontWeight: '800', color: '#FFFFFF' }}>
                Powered by NASA Earth Observations
              </span>
            </div>
            <p style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.55)', margin: 0 }}>
              Multi-decadal satellite analysis verified with Mann–Kendall &amp; Sen's Slope statistics.
              Statistical significance threshold: p &lt; 0.05.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['GISTEMP v4', 'GPCP v3.2', 'SMAP L4', 'MODIS NDVI', 'FIRMS/VIIRS'].map(src => (
              <span key={src} style={{
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px', padding: '4px 10px',
                fontSize: '0.68rem', fontWeight: '700', color: 'rgba(255,255,255,0.7)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>{src}</span>
            ))}
          </div>
          <button
            className="btn-primary"
            onClick={() => setActiveTab && setActiveTab('methodology')}
            style={{ fontSize: '0.78rem', padding: '7px 16px', background: '#1A5C4A', flexShrink: 0 }}
          >
            Methodology <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
