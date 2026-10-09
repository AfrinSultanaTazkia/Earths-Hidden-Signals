import React, { useState } from 'react';
import { REGIONS, VARIABLES, GENERATE_HISTORICAL_DATA, GET_TREND_SUMMARY } from '../data/earthSignalsData';
import SouthAsiaOverviewMap from '../components/SouthAsiaOverviewMap';
import SignalCard from '../components/SignalCard';
import TrendChart from '../components/TrendChart';
import { Activity, ShieldCheck, Filter, AlertCircle, Sparkles, Sliders, Download, Info, BarChart2, Globe, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export default function ExploreTrends({ selectedRegionId, setSelectedRegionId, setActiveTab }) {
  // Read initial query parameters
  const getInitialFilters = () => {
    const params = new URLSearchParams(window.location.search);
    const varParam = params.get('var') || params.get('variable') || 'rainfall';
    const seasonParam = params.get('season') || 'annual';
    const subParam = params.get('zone') || params.get('subregion') || 'all';
    return { varParam, seasonParam, subParam };
  };

  const init = getInitialFilters();
  const [selectedVariableId, setSelectedVariableId] = useState(init.varParam);
  const [selectedSubRegionId, setSelectedSubRegionId] = useState(init.subParam);
  const [selectedSeason, setSelectedSeason] = useState(init.seasonParam);
  const [showTechnical, setShowTechnical] = useState(false);

  const region = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];
  const variable = VARIABLES.find(v => v.id === selectedVariableId) || VARIABLES[0];

  // Synchronize filter changes with URL
  const handleVariableChange = (vId) => {
    setSelectedVariableId(vId);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'explore');
    params.set('region', selectedRegionId);
    params.set('var', vId);
    params.set('season', selectedSeason);
    if (selectedSubRegionId !== 'all') params.set('zone', selectedSubRegionId);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleRegionChange = (rId) => {
    setSelectedRegionId(rId);
    setSelectedSubRegionId('all');
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'explore');
    params.set('region', rId);
    params.set('var', selectedVariableId);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleSeasonChange = (s) => {
    setSelectedSeason(s);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'explore');
    params.set('region', selectedRegionId);
    params.set('var', selectedVariableId);
    params.set('season', s);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const handleSubRegionChange = (sr) => {
    setSelectedSubRegionId(sr);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', 'explore');
    params.set('region', selectedRegionId);
    params.set('var', selectedVariableId);
    params.set('season', selectedSeason);
    if (sr !== 'all') params.set('zone', sr);
    else params.delete('zone');
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  // Generate historical data & trends
  const historicalData = GENERATE_HISTORICAL_DATA(region.id, variable.id);
  const trendSummary = GET_TREND_SUMMARY(region.id, variable.id);

  // Sen's Slope Indicator Trend Chart Data for Image 2 Bottom Left
  const indicatorTrendData = VARIABLES.map(v => {
    const sum = GET_TREND_SUMMARY(region.id, v.id);
    const slopeNum = parseFloat(sum.sensSlope) || 0;
    return {
      name: v.name,
      slope: slopeNum,
      unit: v.unit.split('/')[0],
      isSignificant: sum.isSignificant,
      color: v.color || '#55D6FF'
    };
  });

  // Export Data to CSV (From Image 3 Mongabay style)
  const handleExportCSV = () => {
    const csvRows = [
      ['Year', `${region.name} ${variable.name} (${variable.unit})`, 'Sens Slope Trend', 'Historical Note'],
      ...historicalData.map(d => [d.year, d.value, d.sensSlopeTrend, d.eventNote ? `"${d.eventNote}"` : ''])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NASA_Earth_Signals_${region.id}_${variable.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container">
        {/* TOP CLIMATE INDICATOR BAR (Image 2 & 3 Hybrid Style) */}
        <div style={styles.topDashboardBar} className="glass-panel">
          <div style={styles.barHeaderRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={styles.logoBadge}>
                <Globe size={18} color="#55D6FF" />
              </div>
              <div>
                <h1 style={styles.dashboardTitle}>Global Climate Indicators - South Asia Dashboard</h1>
                <div style={{ fontSize: '0.72rem', color: '#7E8EA6', fontFamily: "'JetBrains Mono', monospace" }}>
                  NASA Space Apps Challenge 2026 · Earth's Hidden Signals Intelligence
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* View Mode Toggle */}
              <div style={styles.toggleGroup}>
                <button
                  onClick={() => setShowTechnical(false)}
                  style={{ ...styles.toggleBtn, ...(!showTechnical ? styles.toggleBtnActive : {}) }}
                >
                  Beginner View
                </button>
                <button
                  onClick={() => setShowTechnical(true)}
                  style={{ ...styles.toggleBtn, ...(showTechnical ? styles.toggleBtnActive : {}) }}
                >
                  Judges / Technical
                </button>
              </div>

              {/* Export Data Button (From Image 3) */}
              <button
                onClick={handleExportCSV}
                style={styles.exportBtn}
                title="Export NASA Time Series Observation Data as CSV"
              >
                <Download size={13} />
                <span>Export Data</span>
              </button>
            </div>
          </div>

          {/* FILTER CONTROLS ROW (Image 2 & 3 Dropdown Architecture) */}
          <div style={styles.filterControlsRow}>
            <div style={styles.filterField}>
              <label style={styles.fieldLabel}>Indicator / Variable</label>
              <select
                value={selectedVariableId}
                onChange={(e) => handleVariableChange(e.target.value)}
                style={styles.selectControl}
              >
                {VARIABLES.map(v => (
                  <option key={v.id} value={v.id}>{v.symbol} {v.name} ({v.unit})</option>
                ))}
              </select>
            </div>

            <div style={styles.filterField}>
              <label style={styles.fieldLabel}>Country / Region</label>
              <select
                value={selectedRegionId}
                onChange={(e) => handleRegionChange(e.target.value)}
                style={styles.selectControl}
              >
                {REGIONS.map(r => (
                  <option key={r.id} value={r.id}>{r.flag} {r.name} ({r.disasterType})</option>
                ))}
              </select>
            </div>

            <div style={styles.filterField}>
              <label style={styles.fieldLabel}>Study Sub-Region</label>
              <select
                value={selectedSubRegionId}
                onChange={(e) => handleSubRegionChange(e.target.value)}
                style={styles.selectControl}
              >
                <option value="all">All Study Zones in {region.name}</option>
                {region.subRegions.map(sr => (
                  <option key={sr.id} value={sr.id}>{sr.name}</option>
                ))}
              </select>
            </div>

            <div style={styles.filterField}>
              <label style={styles.fieldLabel}>Aggregation Method / Season</label>
              <select
                value={selectedSeason}
                onChange={(e) => handleSeasonChange(e.target.value)}
                style={styles.selectControl}
              >
                <option value="annual">Full 44-Year Annual Baseline (1981–2025)</option>
                <option value="monsoon">Monsoon Peak Surge (June–Sept)</option>
                <option value="dry">Dry Pre-Monsoon Deficit (Oct–May)</option>
              </select>
            </div>
          </div>
        </div>

        {/* MAIN SPLIT SCREEN LAYOUT (Image 2 Architecture) */}
        <div style={styles.splitDashboardGrid}>
          {/* LEFT 50%: INTERACTIVE GEOSPATIAL MAP (Image 2 Left Half) */}
          <div style={styles.mapColumn}>
            <SouthAsiaOverviewMap
              selectedRegionId={selectedRegionId}
              onSelectRegion={handleRegionChange}
              variableId={selectedVariableId}
            />

            {/* Signal Card / Technical Drawer */}
            <div style={{ marginTop: '16px' }}>
              <SignalCard
                regionId={region.id}
                variableId={variable.id}
                showTechnicalExpanded={showTechnical}
              />
            </div>
          </div>

          {/* RIGHT 50%: MULTI-PANEL SCIENTIFIC VISUALIZATION (Image 2 Right Half) */}
          <div style={styles.analyticsColumn}>
            {/* TOP RIGHT: HISTORICAL TIME-SERIES CHART (Image 2 Top-Right) */}
            <TrendChart
              data={historicalData}
              regionId={region.id}
              variableId={variable.id}
              variableName={variable.name}
              unit={variable.unit}
            />

            {/* BOTTOM RIGHT GRID: 2 SUB-PANELS (Image 2 Bottom-Right) */}
            <div style={styles.bottomAnalyticsGrid}>
              {/* SUB-PANEL 1: INDICATOR TREND BAR CHART (Image 2 Bottom-Left) */}
              <div style={styles.indicatorTrendCard} className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={styles.subCardTitle}>INDICATOR TREND (SEN'S SLOPE)</span>
                  <span style={{ fontSize: '0.65rem', color: '#55D6FF', fontFamily: "'JetBrains Mono', monospace" }}>{region.name}</span>
                </div>
                <div style={{ width: '100%', height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={indicatorTrendData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis type="number" stroke="#7E8EA6" fontSize={10} />
                      <YAxis type="category" dataKey="name" stroke="#A6B4C8" fontSize={10} width={90} />
                      <Tooltip
                        contentStyle={{ background: '#0D1527', border: '1px solid #55D6FF', borderRadius: '6px', fontSize: '11px' }}
                      />
                      <Bar dataKey="slope" fill="#55D6FF" radius={[0, 4, 4, 0]}>
                        {indicatorTrendData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.slope >= 0 ? '#55D6FF' : '#FF647C'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ fontSize: '0.65rem', color: '#7E8EA6', marginTop: '6px', textAlign: 'center' }}>
                  Rate of change / year estimated by Sen's Slope median estimator
                </div>
              </div>

              {/* SUB-PANEL 2: 5-STEP AUTOMATIC REGIONAL SYNTHESIS & DECISION SUPPORT */}
              <div style={styles.indicatorTrendCard} className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={styles.subCardTitle}>5-STEP EVIDENCE SYNTHESIS</span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.6rem' }}>AUTO-SYNTHESIS</span>
                </div>

                <div style={styles.synthesisScroll}>
                  <div style={styles.synthItem}>
                    <strong style={{ color: '#55D6FF' }}>1. What did we find?</strong>
                    <p style={styles.synthText}>{trendSummary.whatIsChanging || `${variable.name} is ${trendSummary.directionLabel}`} at {trendSummary.howFastRate || trendSummary.rate}.</p>
                  </div>

                  <div style={styles.synthItem}>
                    <strong style={{ color: '#37D6A3' }}>2. Historical Comparison:</strong>
                    <p style={styles.synthText}>
                      Baseline: {(historicalData.slice(0, 10).reduce((a, c) => a + c.value, 0) / 10).toFixed(1)} vs Recent: {(historicalData.slice(-5).reduce((a, c) => a + c.value, 0) / 5).toFixed(1)} {variable.unit.split('/')[0]}
                    </p>
                  </div>

                  <div style={styles.synthItem}>
                    <strong style={{ color: '#FFBF69' }}>3. What could this mean?</strong>
                    <p style={styles.synthText}>{trendSummary.simpleMeaning}</p>
                  </div>

                  <div style={styles.synthItem}>
                    <strong style={{ color: '#818CF8' }}>4. Decision Support:</strong>
                    <p style={styles.synthText}>
                      {region.id === 'bangladesh' ? 'Monitor upstream discharge and soil saturation ahead of monsoon peaks.' : region.id === 'nepal' ? 'Track 24-hr rainfall spikes on steep slopes to anticipate shear stress.' : region.id === 'india' ? 'Monitor MODIS thermal hotspots during pre-monsoon heat spells.' : 'Track canal gates and rapid monsoon moisture swings.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    paddingTop: '24px',
    paddingBottom: '60px',
    background: '#050816',
    minHeight: '90vh',
  },
  topDashboardBar: {
    padding: '16px 20px',
    borderRadius: '16px',
    marginBottom: '20px',
    background: 'rgba(13, 21, 39, 0.9)',
    border: '1px solid rgba(85, 214, 255, 0.25)',
  },
  barHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '14px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  logoBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(85, 214, 255, 0.12)',
    border: '1px solid rgba(85, 214, 255, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardTitle: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#FFF',
    margin: 0,
    fontFamily: "'Outfit', sans-serif",
  },
  toggleGroup: {
    display: 'flex',
    background: 'rgba(5, 8, 22, 0.8)',
    padding: '3px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: '#7E8EA6',
    fontSize: '0.74rem',
    fontWeight: '700',
    padding: '5px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  toggleBtnActive: {
    background: 'rgba(85, 214, 255, 0.2)',
    color: '#55D6FF',
  },
  exportBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'linear-gradient(135deg, #A82020 0%, #7A1212 100%)',
    border: '1px solid #FF647C',
    color: '#FFF',
    fontSize: '0.76rem',
    fontWeight: '700',
    padding: '6px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  filterControlsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
  },
  filterField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  fieldLabel: {
    fontSize: '0.68rem',
    fontWeight: '700',
    color: '#7E8EA6',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  selectControl: {
    background: 'rgba(5, 8, 22, 0.85)',
    border: '1px solid rgba(85, 214, 255, 0.25)',
    borderRadius: '8px',
    color: '#FFF',
    padding: '8px 12px',
    fontSize: '0.82rem',
    fontWeight: '600',
    outline: 'none',
    cursor: 'pointer',
  },
  splitDashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    alignItems: 'start',
  },
  mapColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  analyticsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  bottomAnalyticsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  indicatorTrendCard: {
    padding: '14px',
    borderRadius: '12px',
    background: 'rgba(13, 21, 39, 0.8)',
    border: '1px solid rgba(85, 214, 255, 0.2)',
  },
  subCardTitle: {
    fontSize: '0.68rem',
    fontWeight: '800',
    color: '#55D6FF',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.06em',
  },
  synthesisScroll: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '160px',
    overflowY: 'auto',
  },
  synthItem: {
    fontSize: '0.74rem',
    lineHeight: 1.4,
  },
  synthText: {
    color: '#A6B4C8',
    margin: '2px 0 0 0',
  },
};
