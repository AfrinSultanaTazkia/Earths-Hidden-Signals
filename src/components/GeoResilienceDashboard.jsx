import React, { useState, useEffect } from 'react';
import {
  Globe, Bell, MessageSquare, User, Home as HomeIcon, LineChart, Users,
  Layers, FileText, Settings, Sparkles, AlertTriangle, CheckCircle2,
  AlertCircle, ArrowRight, Droplets, Flame, Mountain, Wheat, Database,
  Satellite, Maximize2, ZoomIn, ZoomOut, RefreshCw, ExternalLink
} from 'lucide-react';
import { REGIONS, VARIABLES, GET_TREND_SUMMARY, GENERATE_HISTORICAL_DATA } from '../data/earthSignalsData';
import SouthAsiaOverviewMap from './SouthAsiaOverviewMap';

// Custom SVG Speedometer Gauge
function SpeedometerGauge({ value, min = 0, max = 100, color = '#10B981', label = 'Normal' }) {
  const percentage = Math.min(Math.max((value - min) / (max - min), 0), 1);
  const angle = -90 + percentage * 180; // -90deg to +90deg

  return (
    <div style={{ position: 'relative', width: '90px', height: '50px', display: 'flex', justifyContent: 'center' }}>
      <svg viewBox="0 0 100 55" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Outer Arc (Green -> Yellow -> Red) */}
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 10 50 A 40 40 0 0 1 90 50"
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Needle */}
        <g transform={`rotate(${angle} 50 50)`} style={{ transition: 'transform 0.8s ease' }}>
          <line x1="50" y1="50" x2="50" y2="16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="50" cy="50" r="4.5" fill="#55D6FF" stroke="#050816" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

// Mini Sparkline SVG
function Sparkline({ data = [20, 24, 22, 28, 26, 32, 35, 30, 38, 42], color = '#55D6FF' }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 30;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 6) - 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function GeoResilienceDashboard({ selectedRegionId = 'bangladesh', setSelectedRegionId, setActiveTab }) {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [currentRegion, setCurrentRegion] = useState(selectedRegionId || 'bangladesh');
  const [activeVariable, setActiveVariable] = useState('rainfall');

  useEffect(() => {
    if (selectedRegionId) setCurrentRegion(selectedRegionId);
  }, [selectedRegionId]);

  const handleSelectCountry = (rId) => {
    setCurrentRegion(rId);
    if (setSelectedRegionId) setSelectedRegionId(rId);
  };

  const regionObj = REGIONS.find(r => r.id === currentRegion) || REGIONS[0];

  // Live Metric Indicators
  const indicatorCards = [
    {
      id: 'temperature',
      title: 'Temperature',
      dataset: 'NASA GISTEMP / MODIS',
      val: '+0.85°C',
      sub: 'Pre-Monsoon Anomaly',
      sparkData: [26.2, 26.5, 26.8, 27.1, 26.9, 27.4, 27.6, 27.9, 28.3, 28.7],
      gaugeVal: 78,
      gaugeColor: '#EF4444',
      isSig: true,
      sigLabel: 'Trend Significance',
      sigIcon: '✅',
      sigText: 'p < 0.01 (Mann-Kendall)',
      color: '#FF647C'
    },
    {
      id: 'rainfall',
      title: 'Rainfall',
      dataset: 'NASA GPCP / IMERG',
      val: '+11.2%',
      sub: 'Monsoon Surge Volume',
      sparkData: [1420, 1380, 1450, 1490, 1430, 1510, 1560, 1520, 1590, 1640],
      gaugeVal: 82,
      gaugeColor: '#55D6FF',
      isSig: true,
      sigLabel: 'Trend Significance',
      sigIcon: '✅',
      sigText: 'p < 0.05 (Mann-Kendall)',
      color: '#55D6FF'
    },
    {
      id: 'soil_moisture',
      title: 'Soil Moisture',
      dataset: 'NASA SMAP L4',
      val: '+18.4%',
      sub: 'Root-Zone Saturation',
      sparkData: [0.32, 0.34, 0.31, 0.35, 0.36, 0.38, 0.37, 0.39, 0.41, 0.42],
      gaugeVal: 65,
      gaugeColor: '#F59E0B',
      isSig: true,
      sigLabel: 'Trend Significance',
      sigIcon: '⚠️',
      sigText: 'Moderate Saturation',
      color: '#37D6A3'
    },
    {
      id: 'vegetation',
      title: 'Vegetation',
      dataset: 'MODIS MOD13A2 NDVI',
      val: '-0.02',
      sub: 'Dry Canopy Biomass',
      sparkData: [0.65, 0.64, 0.66, 0.63, 0.62, 0.64, 0.61, 0.60, 0.59, 0.58],
      gaugeVal: 45,
      gaugeColor: '#F59E0B',
      isSig: false,
      sigLabel: 'Trend Significance',
      sigIcon: '⚠️',
      sigText: 'Natural Inter-annual Var.',
      color: '#FFBF69'
    }
  ];

  return (
    <div style={styles.dashboardWrapper}>
      {/* 1. TOP APP HEADER (GeoWarn: South Asia Climate Resilience Platform) */}
      <div style={styles.topAppHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.appLogoBox}>
            <Globe size={20} color="#55D6FF" />
          </div>
          <div>
            <div style={styles.appTitle}>
              GeoWarn: South Asia Climate Resilience Platform
            </div>
            <div style={{ fontSize: '0.72rem', color: '#7E8EA6', fontFamily: "'JetBrains Mono', monospace" }}>
              NASA Earth's Hidden Signals · Environmental Trend Analysis & Preparedness
            </div>
          </div>
        </div>

        <div style={styles.topHeaderRight}>
          <button
            onClick={() => setActiveTab && setActiveTab('casestudies')}
            style={styles.headerActionBtn}
            title="Case Studies & Reports"
          >
            <MessageSquare size={16} />
          </button>

          <button
            onClick={() => setActiveTab && setActiveTab('explorelive')}
            style={styles.headerActionBtn}
            title="Live Sensor Alerts"
          >
            <div style={{ position: 'relative' }}>
              <Bell size={16} />
              <span style={styles.notifBadge}>1</span>
            </div>
          </button>

          <div style={styles.userProfileChip}>
            <div style={styles.userAvatar}>
              <User size={13} color="#FFF" />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#FFF', fontWeight: '600' }}>NASA-SpaceApps@Team</span>
          </div>
        </div>
      </div>

      {/* 2. BODY WITH LEFT VERTICAL ICON RAIL + MAIN CONTENT */}
      <div style={styles.mainLayout}>
        {/* LEFT VERTICAL ICON SIDEBAR */}
        <aside style={styles.leftSidebarRail}>
          <button
            onClick={() => { setActiveNav('dashboard'); if (setActiveTab) setActiveTab('home'); }}
            style={{ ...styles.railBtn, ...(activeNav === 'dashboard' ? styles.railBtnActive : {}) }}
            title="Dashboard Overview"
          >
            <HomeIcon size={18} />
          </button>

          <button
            onClick={() => { setActiveNav('trends'); if (setActiveTab) setActiveTab('explore'); }}
            style={{ ...styles.railBtn, ...(activeNav === 'trends' ? styles.railBtnActive : {}) }}
            title="Trend Charts (20 Yrs)"
          >
            <LineChart size={18} />
          </button>

          <button
            onClick={() => { setActiveNav('preparedness'); if (setActiveTab) setActiveTab('preparedness'); }}
            style={{ ...styles.railBtn, ...(activeNav === 'preparedness' ? styles.railBtnActive : {}) }}
            title="Decision Support & Preparedness"
          >
            <Users size={18} />
          </button>

          <button
            onClick={() => { setActiveNav('gis'); if (setActiveTab) setActiveTab('explorelive'); }}
            style={{ ...styles.railBtn, ...(activeNav === 'gis' ? styles.railBtnActive : {}) }}
            title="Interactive GIS Map"
          >
            <Layers size={18} />
          </button>

          <button
            onClick={() => { setActiveNav('methodology'); if (setActiveTab) setActiveTab('methodology'); }}
            style={{ ...styles.railBtn, ...(activeNav === 'methodology' ? styles.railBtnActive : {}) }}
            title="Science & Methodology"
          >
            <FileText size={18} />
          </button>

          <button
            onClick={() => { setActiveNav('evidence'); if (setActiveTab) setActiveTab('historical'); }}
            style={{ ...styles.railBtn, ...(activeNav === 'evidence' ? styles.railBtnActive : {}) }}
            title="Historical Evidence"
          >
            <Settings size={18} />
          </button>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main style={styles.contentContainer}>
          {/* SECTION 1: VARIABLE TREND (20 YEARS) & CURRENT NASA SATELLITE FEED (LIVE API) */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeaderRow}>
              <h2 style={styles.sectionMainTitle}>
                Variable Trend (20 Years) & Current NASA Satellite Feed (Live API)
              </h2>
              <div style={styles.commDropdown}>
                <span style={{ fontSize: '0.78rem', color: '#A6B4C8' }}>Region: </span>
                <select
                  value={currentRegion}
                  onChange={(e) => handleSelectCountry(e.target.value)}
                  style={styles.headerSelect}
                >
                  {REGIONS.map(r => (
                    <option key={r.id} value={r.id}>{r.flag} {r.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 4 VARIABLE GAUGE CARDS */}
            <div style={styles.fourGaugesGrid}>
              {indicatorCards.map((ind) => (
                <div
                  key={ind.id}
                  style={{
                    ...styles.gaugeCard,
                    ...(activeVariable === ind.id ? styles.gaugeCardActive : {})
                  }}
                  onClick={() => setActiveVariable(ind.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF' }}>{ind.title}</div>
                      <div style={{ fontSize: '0.65rem', color: '#7E8EA6' }}>{ind.dataset}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: '900', color: ind.color }}>{ind.val}</div>
                      <div style={{ fontSize: '0.62rem', color: '#A6B4C8' }}>{ind.sub}</div>
                    </div>
                  </div>

                  {/* Sparkline + Speedometer in row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 8px 0' }}>
                    <Sparkline data={ind.sparkData} color={ind.color} />
                    <SpeedometerGauge value={ind.gaugeVal} color={ind.gaugeColor} />
                  </div>

                  {/* Trend Significance Pill */}
                  <div style={styles.sigPillRow}>
                    <span style={{ fontSize: '0.68rem', color: '#A6B4C8', fontWeight: '700' }}>
                      {ind.sigLabel}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: ind.isSig ? '#10B981' : '#F59E0B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>{ind.sigIcon}</span>
                      <span>{ind.sigText}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 2: LARGE INTEGRATED SOUTH ASIA INTERACTIVE GIS MAP */}
          <div style={styles.mapSectionCard}>
            <div style={styles.mapCardHeader}>
              <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>
                Interactive GIS Map
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', color: '#A6B4C8' }}>Selected: <strong style={{ color: '#FFF' }}>{regionObj.name}</strong> ({regionObj.disasterTitle})</span>
                <button
                  onClick={() => setActiveTab && setActiveTab('explore')}
                  style={styles.mapExpandBtn}
                >
                  <Maximize2 size={12} />
                  <span>Full Screen Map</span>
                </button>
              </div>
            </div>

            {/* Embed Leaflet Overview Map */}
            <div style={styles.mapFrameWrapper}>
              <SouthAsiaOverviewMap
                selectedRegionId={currentRegion}
                onSelectRegion={handleSelectCountry}
                variableId={activeVariable}
              />
            </div>
          </div>

          {/* SECTION 3: REGIONAL DISASTER BREAKDOWN (Matched to Variable Change Patterns) */}
          <div style={styles.sectionCard}>
            <h2 style={styles.sectionMainTitle}>
              REGIONAL DISASTER BREAKDOWN <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#7E8EA6' }}>(Matched to Variable Change Patterns)</span>
            </h2>

            <div style={styles.disasterBreakdownGrid}>
              {/* Bangladesh */}
              <div
                style={{
                  ...styles.breakdownCard,
                  ...(currentRegion === 'bangladesh' ? styles.breakdownCardActive : {})
                }}
                onClick={() => handleSelectCountry('bangladesh')}
              >
                <div style={styles.breakdownIconWrapper}>
                  <span style={{ fontSize: '1.8rem' }}>🌊</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Bangladesh</span>
                    <span style={{ fontSize: '0.7rem', color: '#55D6FF' }}>🇧🇩</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#55D6FF', fontWeight: '700', marginTop: '2px' }}>
                    River Flood Risk and Flood zones
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#A6B4C8', marginTop: '4px', lineHeight: 1.4 }}>
                    Heavy upstream precipitation coupled with deltaic soil saturation increases runoff velocity.
                  </div>
                </div>
              </div>

              {/* India */}
              <div
                style={{
                  ...styles.breakdownCard,
                  ...(currentRegion === 'india' ? styles.breakdownCardActive : {})
                }}
                onClick={() => handleSelectCountry('india')}
              >
                <div style={{ ...styles.breakdownIconWrapper, background: 'rgba(255,191,105,0.12)', borderColor: 'rgba(255,191,105,0.3)' }}>
                  <span style={{ fontSize: '1.8rem' }}>🔥</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>India</span>
                    <span style={{ fontSize: '0.7rem', color: '#FFBF69' }}>🇮🇳</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#FFBF69', fontWeight: '700', marginTop: '2px' }}>
                    Wildfire Vulnerability & Hotspots
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#A6B4C8', marginTop: '4px', lineHeight: 1.4 }}>
                    Pre-monsoon heat and root-zone moisture deficits accelerate forest dry biomass stress.
                  </div>
                </div>
              </div>

              {/* Nepal */}
              <div
                style={{
                  ...styles.breakdownCard,
                  ...(currentRegion === 'nepal' ? styles.breakdownCardActive : {})
                }}
                onClick={() => handleSelectCountry('nepal')}
              >
                <div style={{ ...styles.breakdownIconWrapper, background: 'rgba(55,214,163,0.12)', borderColor: 'rgba(55,214,163,0.3)' }}>
                  <span style={{ fontSize: '1.8rem' }}>⛰️</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Nepal</span>
                    <span style={{ fontSize: '0.7rem', color: '#37D6A3' }}>🇳🇵</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#37D6A3', fontWeight: '700', marginTop: '2px' }}>
                    Landslide Monitoring on mountain slopes
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#A6B4C8', marginTop: '4px', lineHeight: 1.4 }}>
                    Intense rainfall spikes on steep slopes reduce soil shear strength, triggering slope failures.
                  </div>
                </div>
              </div>

              {/* Pakistan */}
              <div
                style={{
                  ...styles.breakdownCard,
                  ...(currentRegion === 'pakistan' ? styles.breakdownCardActive : {})
                }}
                onClick={() => handleSelectCountry('pakistan')}
              >
                <div style={{ ...styles.breakdownIconWrapper, background: 'rgba(129,140,248,0.12)', borderColor: 'rgba(129,140,248,0.3)' }}>
                  <span style={{ fontSize: '1.8rem' }}>🌾</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Pakistan</span>
                    <span style={{ fontSize: '0.7rem', color: '#818CF8' }}>🇵🇰</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#818CF8', fontWeight: '700', marginTop: '2px' }}>
                    Monsoon Flood & Drought Warning
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#A6B4C8', marginTop: '4px', lineHeight: 1.4 }}>
                    Rapid swings between severe arid moisture deficits and extreme monsoon flood surges.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: DECISION SUPPORT / PREPAREDNESS ACTIONS (3 Role Columns) */}
          <div style={styles.sectionCard}>
            <div style={{ marginBottom: '14px' }}>
              <h2 style={styles.sectionMainTitle}>
                DECISION SUPPORT / PREPAREDNESS ACTIONS
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#7E8EA6', margin: '2px 0 0 0' }}>
                Actionable, clear guidance — translated from NASA satellite evidence into human-friendly language.
              </p>
            </div>

            <div style={styles.prepColumnsGrid}>
              {/* For Farmers (Green) */}
              <div style={styles.roleCard}>
                <div style={{ ...styles.roleHeader, background: '#1B5E20', color: '#FFFFFF' }}>
                  <span>🌱 For Farmers</span>
                </div>
                <div style={styles.roleBody}>
                  <ul style={styles.roleList}>
                    <li>
                      <strong>Crop Planting Calendar:</strong> Adjust sowing dates to avoid early flash flood inundation in delta haor zones.
                    </li>
                    <li>
                      <strong>Drought-Resilient Varieties:</strong> Pre-position drought-tolerant seeds in arid rain-fed agricultural corridors.
                    </li>
                    <li>
                      <strong>Soil Moisture Monitoring:</strong> Inspect field drainage sluice gates before multi-day rainfall surge windows.
                    </li>
                  </ul>
                </div>
              </div>

              {/* For Health Workers (Teal/Cyan) */}
              <div style={styles.roleCard}>
                <div style={{ ...styles.roleHeader, background: '#006064', color: '#FFFFFF' }}>
                  <span>🏥 For Health Workers</span>
                </div>
                <div style={styles.roleBody}>
                  <ul style={styles.roleList}>
                    <li>
                      <strong>Heat Stroke Alerts:</strong> Issue high-temperature advisories for outdoor agricultural workers during pre-monsoon heat.
                    </li>
                    <li>
                      <strong>Water Purification Stock:</strong> Pre-position chlorine tablets and clean water packets in flood-vulnerable chars.
                    </li>
                    <li>
                      <strong>Vector-Borne Surveillance:</strong> Increase mosquito control around standing water pools following monsoon surges.
                    </li>
                  </ul>
                </div>
              </div>

              {/* For First Responders (Red) */}
              <div style={styles.roleCard}>
                <div style={{ ...styles.roleHeader, background: '#B71C1C', color: '#FFFFFF' }}>
                  <span>🚨 For First Responders</span>
                </div>
                <div style={styles.roleBody}>
                  <ul style={styles.roleList}>
                    <li>
                      <strong>Flood Relief Protocols:</strong> Pre-deploy rescue boats, life jackets, and emergency shelters in low-lying river basins.
                    </li>
                    <li>
                      <strong>Mountain Road Clearance:</strong> Position heavy earth-moving equipment near high-risk Himalayan landslide corridors.
                    </li>
                    <li>
                      <strong>Wildfire Firebreaks:</strong> Establish controlled firebreaks and monitor satellite FIRMS thermal hotspot alerts 24/7.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: POWERED BY NASA SATELLITE DATA BOTTOM BANNER */}
          <div style={styles.bottomNasaBanner}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', flex: 1 }}>
              <div style={{ flex: 1 }}>
                <h3 style={styles.bannerHeadline}>Powered by NASA Satellite Data</h3>
                <p style={styles.bannerDesc}>
                  Powered by multi-decadal satellite observations (GISTEMP, GPCP/IMERG, SMAP L4, MODIS). <strong>Statistical significance</strong> verified with non-parametric Mann–Kendall & Sen’s Slope calculations for all active trends.
                </p>
              </div>

              {/* Satellite + Server Illustration Badges */}
              <div style={styles.bannerIllustrations}>
                <div style={styles.satelliteIlluBox}>
                  <Satellite size={32} color="#55D6FF" />
                  <span style={{ fontSize: '0.62rem', color: '#55D6FF', fontWeight: '700' }}>NASA SAT</span>
                </div>
                <div style={{ color: '#55D6FF', fontSize: '1.2rem', fontWeight: '800' }}>→</div>
                <div style={styles.serverIlluBox}>
                  <Database size={32} color="#37D6A3" />
                  <span style={{ fontSize: '0.62rem', color: '#37D6A3', fontWeight: '700' }}>GEO DB</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const styles = {
  dashboardWrapper: {
    background: '#050816',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Inter', sans-serif",
    color: '#FFFFFF',
  },
  topAppHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    background: '#0A192F',
    borderBottom: '1px solid rgba(85, 214, 255, 0.2)',
    zIndex: 100,
  },
  appLogoBox: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'rgba(85, 214, 255, 0.12)',
    border: '1px solid rgba(85, 214, 255, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appTitle: {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.02em',
  },
  topHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  headerActionBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#A6B4C8',
    width: '34px',
    height: '34px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  notifBadge: {
    position: 'absolute',
    top: '-6px',
    right: '-6px',
    background: '#EF4444',
    color: '#FFF',
    fontSize: '0.6rem',
    fontWeight: '800',
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userProfileChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '20px',
    padding: '4px 12px 4px 4px',
  },
  userAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#0B3D91',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainLayout: {
    display: 'flex',
    flex: 1,
  },
  leftSidebarRail: {
    width: '56px',
    background: '#081224',
    borderRight: '1px solid rgba(85, 214, 255, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px 0',
    gap: '14px',
    flexShrink: 0,
  },
  railBtn: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    background: 'transparent',
    border: 'none',
    color: '#7E8EA6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  railBtnActive: {
    background: 'rgba(85, 214, 255, 0.15)',
    color: '#55D6FF',
    border: '1px solid rgba(85, 214, 255, 0.4)',
    boxShadow: '0 0 10px rgba(85, 214, 255, 0.2)',
  },
  contentContainer: {
    flex: 1,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  },
  sectionCard: {
    background: 'rgba(13, 21, 39, 0.85)',
    border: '1px solid rgba(85, 214, 255, 0.2)',
    borderRadius: '12px',
    padding: '18px 20px',
  },
  sectionHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '16px',
  },
  sectionMainTitle: {
    fontSize: '1.05rem',
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '-0.02em',
    margin: 0,
  },
  commDropdown: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  headerSelect: {
    background: 'rgba(5, 8, 22, 0.8)',
    border: '1px solid rgba(85, 214, 255, 0.3)',
    borderRadius: '6px',
    color: '#FFF',
    padding: '4px 10px',
    fontSize: '0.78rem',
    fontWeight: '600',
    outline: 'none',
    cursor: 'pointer',
  },
  fourGaugesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '14px',
  },
  gaugeCard: {
    background: 'rgba(5, 8, 22, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '14px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  gaugeCardActive: {
    borderColor: '#55D6FF',
    background: 'rgba(85, 214, 255, 0.06)',
    boxShadow: '0 0 14px rgba(85, 214, 255, 0.18)',
  },
  sigPillRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '6px',
    marginTop: '4px',
  },
  mapSectionCard: {
    background: 'rgba(13, 21, 39, 0.85)',
    border: '1px solid rgba(85, 214, 255, 0.2)',
    borderRadius: '12px',
    padding: '16px',
    overflow: 'hidden',
  },
  mapCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  mapExpandBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#A6B4C8',
    fontSize: '0.72rem',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  mapFrameWrapper: {
    borderRadius: '8px',
    overflow: 'hidden',
    minHeight: '440px',
  },
  disasterBreakdownGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '14px',
    marginTop: '12px',
  },
  breakdownCard: {
    background: 'rgba(5, 8, 22, 0.65)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '14px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  breakdownCardActive: {
    borderColor: '#55D6FF',
    background: 'rgba(85, 214, 255, 0.08)',
    boxShadow: '0 0 12px rgba(85, 214, 255, 0.2)',
  },
  breakdownIconWrapper: {
    width: '46px',
    height: '46px',
    borderRadius: '8px',
    background: 'rgba(85, 214, 255, 0.12)',
    border: '1px solid rgba(85, 214, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  prepColumnsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
  },
  roleCard: {
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(5, 8, 22, 0.7)',
  },
  roleHeader: {
    padding: '10px 16px',
    fontSize: '0.9rem',
    fontWeight: '800',
    letterSpacing: '0.02em',
  },
  roleBody: {
    padding: '14px 16px',
  },
  roleList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '0.78rem',
    color: '#D1D5DB',
    lineHeight: 1.5,
  },
  bottomNasaBanner: {
    background: 'linear-gradient(135deg, #0A2540 0%, #001E3D 100%)',
    border: '1px solid rgba(85, 214, 255, 0.3)',
    borderRadius: '12px',
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
  },
  bannerHeadline: {
    fontSize: '1.4rem',
    fontWeight: '900',
    color: '#FFFFFF',
    margin: '0 0 6px 0',
    fontFamily: "'Outfit', sans-serif",
  },
  bannerDesc: {
    fontSize: '0.82rem',
    color: '#A6B4C8',
    lineHeight: 1.55,
    margin: 0,
    maxWidth: '750px',
  },
  bannerIllustrations: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  satelliteIlluBox: {
    background: 'rgba(85, 214, 255, 0.1)',
    border: '1px solid rgba(85, 214, 255, 0.3)',
    borderRadius: '10px',
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  serverIlluBox: {
    background: 'rgba(55, 214, 163, 0.1)',
    border: '1px solid rgba(55, 214, 163, 0.3)',
    borderRadius: '10px',
    padding: '8px 12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
};
