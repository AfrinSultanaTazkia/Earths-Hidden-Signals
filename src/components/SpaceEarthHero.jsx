import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Satellite, ShieldCheck, MapPin, Sparkles, Search, Compass, AlertTriangle, CheckCircle2, Sliders, ExternalLink, Activity, Radio } from 'lucide-react';
import earthGlobeImg from '../assets/earth_globe.jpg';
import { REGIONS, VARIABLES, GET_TREND_SUMMARY } from '../data/earthSignalsData';

export default function SpaceEarthHero({ onExploreClick, onHowItWorksClick, setSelectedRegionId, setActiveTab }) {
  const [selectedPin, setSelectedPin] = useState('bangladesh');
  const [searchQuery, setSearchQuery] = useState('');

  const currentRegion = REGIONS.find(r => r.id === selectedPin) || REGIONS[0];
  const summary = GET_TREND_SUMMARY(selectedPin, 'rainfall');

  const telemetryPins = [
    { id: 'bangladesh', name: 'Bangladesh', tag: 'Delta Floodplain', metric: '+11.2% Surge', top: '46%', left: '58%', flag: '🇧🇩', color: '#55D6FF' },
    { id: 'nepal', name: 'Nepal', tag: 'Himalayan Slopes', metric: '+4.8 mm/day', top: '38%', left: '53%', flag: '🇳🇵', color: '#37D6A3' },
    { id: 'india', name: 'India', tag: 'Peninsular & Forests', metric: '+0.85°C Anomaly', top: '50%', left: '42%', flag: '🇮🇳', color: '#FFBF69' },
    { id: 'pakistan', name: 'Pakistan', tag: 'Indus River Basin', metric: 'Hydro Variance', top: '40%', left: '33%', flag: '🇵🇰', color: '#818CF8' },
  ];

  const handleSelectRegion = (rId) => {
    setSelectedPin(rId);
    if (setSelectedRegionId) setSelectedRegionId(rId);
  };

  const handleLaunchDashboard = (rId) => {
    if (setSelectedRegionId) setSelectedRegionId(rId || selectedPin);
    if (setActiveTab) setActiveTab('explore');
    else if (onExploreClick) onExploreClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section style={styles.heroSection} aria-label="NASA Earth Intelligence Command Center">
      {/* Background Ambience */}
      <div style={styles.spaceAtmosphere} aria-hidden="true" />
      <div style={styles.subtleStars} aria-hidden="true" />

      <div className="container" style={styles.heroContainer}>
        {/* TOP COMMAND HEADER */}
        <div style={styles.topHudBar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={styles.nasaPill}>NASA</span>
            <span style={styles.hudTitle}>EARTH’S HIDDEN SIGNALS · MISSION CONTROL</span>
          </div>
          <div style={styles.statusBadgeRow}>
            <span style={styles.livePulseDot} />
            <span style={{ fontSize: '0.72rem', color: '#55D6FF', fontFamily: "'JetBrains Mono', monospace", fontWeight: '700' }}>
              TELEMETRY FEED ACTIVE · 44-YR MULTI-MISSION BASELINE
            </span>
          </div>
        </div>

        {/* MAIN HUD GRID: GLOBE + TELEMETRY + IA INSIGHTS */}
        <div style={styles.hudMainGrid}>
          {/* CENTER-LEFT: HOLOGRAPHIC EARTH GLOBE VIEWPORT */}
          <div style={styles.globeViewport} className="glass-panel">
            {/* Ambient Aura */}
            <div style={styles.atmoGlow} />

            {/* NASA Earth Visual */}
            <img
              src={earthGlobeImg}
              alt="Planet Earth NASA satellite observation focus on South Asia"
              style={styles.globeImage}
            />

            <div style={styles.rimOverlay} />

            {/* Interactive Pins on Globe */}
            {telemetryPins.map((pin) => {
              const isSelected = selectedPin === pin.id;
              return (
                <div
                  key={pin.id}
                  style={{
                    position: 'absolute',
                    top: pin.top,
                    left: pin.left,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 20,
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelectRegion(pin.id)}
                >
                  <div style={{ ...styles.pinPulseRing, borderColor: pin.color, opacity: isSelected ? 0.8 : 0.3 }} />
                  <div
                    style={{
                      ...styles.pinCenterDot,
                      background: pin.color,
                      boxShadow: `0 0 12px ${pin.color}`,
                      transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                    }}
                  >
                    <span style={{ fontSize: '10px' }}>{pin.flag}</span>
                  </div>

                  {/* Pin label */}
                  <div
                    style={{
                      ...styles.pinLabelBox,
                      ...(isSelected ? styles.pinLabelBoxActive : {}),
                    }}
                  >
                    <span style={{ fontWeight: '700', color: '#FFF' }}>{pin.name}</span>
                    <span style={{ color: pin.color, fontSize: '0.62rem' }}>{pin.metric}</span>
                  </div>
                </div>
              );
            })}

            {/* Center "EXPLORE" Capsule Button on Globe */}
            <button
              onClick={() => handleLaunchDashboard(selectedPin)}
              style={styles.globeExploreBtn}
              aria-label="Launch Full Analysis Dashboard"
            >
              <span>EXPLORE {currentRegion.name.toUpperCase()}</span>
              <ArrowRight size={14} />
            </button>

            {/* Bottom Search / Ask Bar inside Globe Card */}
            <div style={styles.globeSearchBar}>
              <Sparkles size={16} color="#55D6FF" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask or search environmental signal: e.g. 'Jamuna flood surge' or 'Himalayan slope saturation'..."
                style={styles.searchInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLaunchDashboard(selectedPin);
                }}
              />
              <button
                onClick={() => handleLaunchDashboard(selectedPin)}
                style={styles.searchSubmitBtn}
              >
                <Search size={14} />
              </button>
            </div>
          </div>

          {/* CENTER-RIGHT: HUD TELEMETRY DATA CARD (From Image 1) */}
          <div style={styles.hudTelemetryCard} className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#7E8EA6', fontFamily: "'JetBrains Mono', monospace" }}>MISSION ID</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#FFF', margin: '2px 0 0' }}>
                  {currentRegion.name} <span style={{ fontSize: '1rem' }}>{currentRegion.flag}</span>
                </h3>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '0.62rem' }}>
                {currentRegion.code}-OBS
              </span>
            </div>

            <div style={styles.telemetryStatGrid}>
              <div style={styles.statCell}>
                <span style={styles.statCellLabel}>OBSERVATION SENSOR</span>
                <span style={styles.statCellVal}>GPM / SMAP</span>
              </div>
              <div style={styles.statCell}>
                <span style={styles.statCellLabel}>ORBITAL VELOCITY</span>
                <span style={{ ...styles.statCellVal, color: '#55D6FF' }}>7.5 KM/S</span>
              </div>
              <div style={styles.statCell}>
                <span style={styles.statCellLabel}>TIME BASELINE</span>
                <span style={styles.statCellVal}>44 YRS</span>
              </div>
              <div style={styles.statCell}>
                <span style={styles.statCellLabel}>CONFIDENCE</span>
                <span style={{ ...styles.statCellVal, color: '#37D6A3' }}>p &lt; 0.05</span>
              </div>
              <div style={{ ...styles.statCell, gridColumn: 'span 2' }}>
                <span style={styles.statCellLabel}>ENVIRONMENTAL FOCUS</span>
                <span style={{ ...styles.statCellVal, fontSize: '0.82rem', color: '#FFF' }}>
                  {currentRegion.disasterTitle}
                </span>
              </div>
            </div>

            {/* Radar Mini Widget */}
            <div style={styles.radarWidget}>
              <div style={styles.radarCircle}>
                <div style={styles.radarSweep} />
                <div style={styles.radarCenter} />
                <div style={{ position: 'absolute', top: '25%', left: '60%', width: '4px', height: '4px', borderRadius: '50%', background: '#55D6FF', boxShadow: '0 0 6px #55D6FF' }} />
                <div style={{ position: 'absolute', top: '70%', left: '35%', width: '4px', height: '4px', borderRadius: '50%', background: '#37D6A3', boxShadow: '0 0 6px #37D6A3' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.68rem', fontWeight: '700', color: '#55D6FF', textTransform: 'uppercase' }}>
                  Geospatial Radar Scan
                </div>
                <div style={{ fontSize: '0.74rem', color: '#A6B4C8', marginTop: '2px' }}>
                  {currentRegion.subRegions.length} study zones active in {currentRegion.name}
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => handleLaunchDashboard(selectedPin)}
              style={{ width: '100%', padding: '10px', fontSize: '0.85rem', marginTop: '14px' }}
            >
              <span>Launch Regional Synthesis</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* RIGHT SIDEBAR: IA INSIGHTS / REGIONAL EVIDENCE CARDS (From Image 1) */}
          <div style={styles.iaInsightsCard} className="glass-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sparkles size={16} color="#55D6FF" />
              <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#FFF', margin: 0 }}>
                IA Regional Insights
              </h3>
            </div>

            <div style={styles.iaScrollArea}>
              {/* Prediction/Evidence Card 1 */}
              <div
                style={{
                  ...styles.iaItemCard,
                  ...(selectedPin === 'bangladesh' ? styles.iaItemCardActive : {}),
                }}
                onClick={() => handleSelectRegion('bangladesh')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#55D6FF' }}>🇧🇩 BANGLADESH DELTA</span>
                  <ExternalLink size={12} color="#7E8EA6" />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
                  Precipitation & Soil Saturation Surge
                </div>
                <div style={styles.iaAlertPill}>
                  <AlertTriangle size={11} color="#FFBF69" />
                  <span>+11.2% Monsoonal Runoff Impedance</span>
                </div>
              </div>

              {/* Prediction/Evidence Card 2 */}
              <div
                style={{
                  ...styles.iaItemCard,
                  ...(selectedPin === 'nepal' ? styles.iaItemCardActive : {}),
                }}
                onClick={() => handleSelectRegion('nepal')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#37D6A3' }}>🇳🇵 NEPAL HIMALAYA</span>
                  <ExternalLink size={12} color="#7E8EA6" />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
                  Localized Slope Rain Bursts
                </div>
                <div style={styles.iaAlertPill}>
                  <AlertTriangle size={11} color="#37D6A3" />
                  <span>+4.8 mm/day Intensity Departure</span>
                </div>
              </div>

              {/* Prediction/Evidence Card 3 */}
              <div
                style={{
                  ...styles.iaItemCard,
                  ...(selectedPin === 'india' ? styles.iaItemCardActive : {}),
                }}
                onClick={() => handleSelectRegion('india')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#FFBF69' }}>🇮🇳 INDIA FORESTS</span>
                  <ExternalLink size={12} color="#7E8EA6" />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
                  Thermal Warming & Dry Biomass Stress
                </div>
                <div style={styles.iaAlertPill}>
                  <AlertTriangle size={11} color="#FF647C" />
                  <span>+0.85°C / Decade Surface Warming</span>
                </div>
              </div>

              {/* Prediction/Evidence Card 4 */}
              <div
                style={{
                  ...styles.iaItemCard,
                  ...(selectedPin === 'pakistan' ? styles.iaItemCardActive : {}),
                }}
                onClick={() => handleSelectRegion('pakistan')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#818CF8' }}>🇵🇰 PAKISTAN INDUS</span>
                  <ExternalLink size={12} color="#7E8EA6" />
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
                  Hydroclimatic Variance & Droughts
                </div>
                <div style={styles.iaAlertPill}>
                  <AlertTriangle size={11} color="#818CF8" />
                  <span>Monsoon Surges & Arid Deficits</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 BOTTOM METRICS HUD PANELS (From Image 1) */}
        <div style={styles.bottomHudGrid}>
          {/* Card 1: Observations by Country */}
          <div style={styles.bottomMetricCard} className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={styles.bottomCardTitle}>OBSERVATIONS BY REGION</span>
              <ExternalLink size={12} color="#7E8EA6" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFF', marginBottom: '10px' }}>
              44 <span style={{ fontSize: '0.85rem', color: '#55D6FF', fontWeight: '600' }}>Years (1981–2025)</span>
            </div>
            {/* Glowing bar visualizer */}
            <div style={styles.barVisualizerRow}>
              {[
                { label: 'BD', val: '85%' },
                { label: 'IN', val: '92%' },
                { label: 'NP', val: '78%' },
                { label: 'PK', val: '88%' },
              ].map((b, i) => (
                <div key={i} style={styles.barVisualizerCol}>
                  <div style={{ height: '50px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: b.val, background: 'linear-gradient(180deg, #55D6FF 0%, #0099FF 100%)', borderRadius: '4px' }} />
                  </div>
                  <span style={{ fontSize: '0.65rem', color: '#7E8EA6', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Recent NASA Satellite Passes */}
          <div style={styles.bottomMetricCard} className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={styles.bottomCardTitle}>VERIFIED SATELLITE MISSIONS</span>
              <ExternalLink size={12} color="#7E8EA6" />
            </div>
            <div style={styles.missionsList}>
              {[
                { date: 'NASA GISTEMP v4', desc: 'Land Surface Temp Grid', status: 'Continuous' },
                { date: 'NASA GPM IMERG', desc: 'Precipitation Microwave', status: 'Near Real-Time' },
                { date: 'NASA SMAP L4', desc: 'Root-Zone Soil Saturation', status: '3-Hourly' },
              ].map((m, i) => (
                <div key={i} style={styles.missionItem}>
                  <span style={styles.missionDatePill}>{m.date}</span>
                  <div style={{ flex: 1, fontSize: '0.74rem', color: '#A6B4C8' }}>{m.desc}</div>
                  <span style={{ fontSize: '0.65rem', color: '#37D6A3', fontFamily: "'JetBrains Mono', monospace" }}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Signals by Variable Breakdown */}
          <div style={styles.bottomMetricCard} className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={styles.bottomCardTitle}>SIGNALS BY VARIABLE</span>
              <ExternalLink size={12} color="#7E8EA6" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Precipitation Intensity', pct: '88%', color: '#55D6FF' },
                { name: 'Surface Temperature', pct: '94%', color: '#FF647C' },
                { name: 'Root-Zone Soil Moisture', pct: '82%', color: '#37D6A3' },
                { name: 'Vegetation Canopy (NDVI)', pct: '75%', color: '#FFBF69' },
              ].map((v, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#A6B4C8', marginBottom: '3px' }}>
                    <span>{v.name}</span>
                    <strong style={{ color: '#FFF' }}>{v.pct}</strong>
                  </div>
                  <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: v.pct, background: v.color, borderRadius: '3px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  heroSection: {
    position: 'relative',
    padding: '30px 0 60px 0',
    background: '#050816',
    overflow: 'hidden',
  },
  spaceAtmosphere: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(ellipse at 50% 20%, rgba(85, 214, 255, 0.12) 0%, rgba(5, 8, 22, 0.98) 75%)',
    pointerEvents: 'none',
  },
  subtleStars: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(1px 1px at 25px 35px, rgba(255,255,255,0.6), rgba(0,0,0,0)),
      radial-gradient(1px 1px at 120px 80px, rgba(85,214,255,0.5), rgba(0,0,0,0)),
      radial-gradient(1.5px 1.5px at 280px 190px, rgba(255,255,255,0.7), rgba(0,0,0,0)),
      radial-gradient(1px 1px at 450px 70px, rgba(85,214,255,0.4), rgba(0,0,0,0))
    `,
    backgroundRepeat: 'repeat',
    backgroundSize: '500px 500px',
    opacity: 0.7,
    pointerEvents: 'none',
  },
  heroContainer: {
    position: 'relative',
    zIndex: 10,
  },
  topHudBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
    paddingBottom: '14px',
    borderBottom: '1px solid rgba(85, 214, 255, 0.15)',
  },
  nasaPill: {
    background: 'linear-gradient(135deg, #0B3D91 0%, #105BD8 100%)',
    border: '1px solid rgba(85, 214, 255, 0.4)',
    color: '#FFF',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: '900',
    fontSize: '0.8rem',
    letterSpacing: '0.12em',
    padding: '3px 10px',
    borderRadius: '6px',
  },
  hudTitle: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.82rem',
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: '0.08em',
  },
  statusBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  livePulseDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#55D6FF',
    boxShadow: '0 0 8px #55D6FF',
    animation: 'pulse 1.8s infinite',
  },
  hudMainGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 0.9fr 1.1fr',
    gap: '18px',
    marginBottom: '24px',
  },
  globeViewport: {
    position: 'relative',
    borderRadius: '16px',
    minHeight: '440px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '20px',
    overflow: 'hidden',
    background: 'radial-gradient(circle at center, #0B1630 0%, #050816 85%)',
    border: '1px solid rgba(85, 214, 255, 0.3)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
  },
  atmoGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '380px',
    height: '380px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(85,214,255,0.22) 0%, rgba(85,214,255,0.03) 60%, transparent 75%)',
    pointerEvents: 'none',
  },
  globeImage: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    objectFit: 'cover',
    boxShadow: '0 0 50px rgba(85, 214, 255, 0.35)',
    pointerEvents: 'none',
  },
  rimOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '324px',
    height: '324px',
    borderRadius: '50%',
    border: '1.5px solid rgba(85, 214, 255, 0.6)',
    boxShadow: 'inset 0 0 30px rgba(85, 214, 255, 0.4)',
    pointerEvents: 'none',
  },
  pinPulseRing: {
    position: 'absolute',
    inset: '-8px',
    borderRadius: '50%',
    border: '1.5px solid',
    animation: 'pulse 2s infinite',
  },
  pinCenterDot: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  pinLabelBox: {
    position: 'absolute',
    bottom: '-32px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(5, 8, 22, 0.92)',
    border: '1px solid rgba(85, 214, 255, 0.3)',
    borderRadius: '6px',
    padding: '2px 8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    fontSize: '0.7rem',
  },
  pinLabelBoxActive: {
    borderColor: '#55D6FF',
    boxShadow: '0 0 10px rgba(85, 214, 255, 0.3)',
  },
  globeExploreBtn: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(13, 21, 39, 0.85)',
    border: '1px solid #55D6FF',
    color: '#55D6FF',
    fontFamily: "'Outfit', sans-serif",
    fontWeight: '800',
    fontSize: '0.78rem',
    padding: '7px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    boxShadow: '0 0 14px rgba(85, 214, 255, 0.3)',
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s ease',
  },
  globeSearchBar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(5, 8, 22, 0.85)',
    border: '1px solid rgba(85, 214, 255, 0.3)',
    borderRadius: '24px',
    padding: '8px 16px',
    backdropFilter: 'blur(10px)',
    zIndex: 25,
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#FFF',
    fontSize: '0.8rem',
    outline: 'none',
  },
  searchSubmitBtn: {
    background: '#55D6FF',
    border: 'none',
    color: '#050816',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  hudTelemetryCard: {
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    background: 'rgba(13, 21, 39, 0.85)',
    border: '1px solid rgba(85, 214, 255, 0.25)',
  },
  telemetryStatGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    margin: '10px 0',
  },
  statCell: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '8px',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statCellLabel: {
    fontSize: '0.62rem',
    color: '#7E8EA6',
    fontFamily: "'JetBrains Mono', monospace",
  },
  statCellVal: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: '#FFF',
    fontFamily: "'JetBrains Mono', monospace",
  },
  radarWidget: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(5, 8, 22, 0.6)',
    border: '1px solid rgba(85, 214, 255, 0.2)',
    borderRadius: '10px',
    padding: '10px',
    margin: '6px 0',
  },
  radarCircle: {
    position: 'relative',
    width: '46px',
    height: '46px',
    borderRadius: '50%',
    border: '1px solid rgba(85, 214, 255, 0.5)',
    background: 'radial-gradient(circle, rgba(85,214,255,0.15) 0%, transparent 80%)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  radarSweep: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '100%',
    background: 'linear-gradient(90deg, rgba(85,214,255,0.4), transparent)',
    transformOrigin: 'left center',
    animation: 'spin 3s linear infinite',
  },
  radarCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#55D6FF',
  },
  iaInsightsCard: {
    padding: '20px',
    borderRadius: '16px',
    background: 'rgba(13, 21, 39, 0.85)',
    border: '1px solid rgba(85, 214, 255, 0.25)',
    display: 'flex',
    flexDirection: 'column',
  },
  iaScrollArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    maxHeight: '360px',
  },
  iaItemCard: {
    background: 'rgba(5, 8, 22, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  iaItemCardActive: {
    borderColor: '#55D6FF',
    background: 'rgba(85, 214, 255, 0.08)',
    boxShadow: '0 0 12px rgba(85, 214, 255, 0.15)',
  },
  iaAlertPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.68rem',
    color: '#A6B4C8',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  bottomHudGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '18px',
  },
  bottomMetricCard: {
    padding: '18px',
    borderRadius: '14px',
    background: 'rgba(13, 21, 39, 0.75)',
    border: '1px solid rgba(85, 214, 255, 0.2)',
  },
  bottomCardTitle: {
    fontSize: '0.68rem',
    fontWeight: '800',
    color: '#55D6FF',
    letterSpacing: '0.08em',
    fontFamily: "'JetBrains Mono', monospace",
  },
  barVisualizerRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  },
  barVisualizerCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  missionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  missionItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '6px',
  },
  missionDatePill: {
    background: 'rgba(85, 214, 255, 0.12)',
    color: '#55D6FF',
    fontSize: '0.64rem',
    fontWeight: '700',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: "'JetBrains Mono', monospace",
    whiteSpace: 'nowrap',
  },
};
