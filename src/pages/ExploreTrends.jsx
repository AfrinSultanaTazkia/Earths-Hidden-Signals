import React, { useState } from 'react';
import { REGIONS, VARIABLES, GENERATE_HISTORICAL_DATA, GET_TREND_SUMMARY } from '../data/earthSignalsData';
import SouthAsiaOverviewMap from '../components/SouthAsiaOverviewMap';
import SignalCard from '../components/SignalCard';
import TrendChart from '../components/TrendChart';
import { Activity, ShieldCheck, Filter, AlertCircle, Sparkles, Sliders } from 'lucide-react';

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

  // Generate historical data
  const historicalData = GENERATE_HISTORICAL_DATA(region.id, variable.id);
  const trendSummary = GET_TREND_SUMMARY(region.id, variable.id);

  // Four Indicator Summary Cards for Selected Region
  const indicatorCards = VARIABLES.map(v => {
    const summary = GET_TREND_SUMMARY(region.id, v.id);
    const hist = GENERATE_HISTORICAL_DATA(region.id, v.id);
    const latest = hist[hist.length - 1]?.value ?? '—';
    const baseline = hist.slice(0, 10).reduce((a, c) => a + c.value, 0) / 10;
    const diff = typeof latest === 'number' ? (latest - baseline).toFixed(1) : 0;
    const diffStr = diff > 0 ? `+${diff}` : `${diff}`;

    return {
      variable: v,
      summary,
      latest,
      diffStr,
      baseline: baseline.toFixed(1),
    };
  });

  return (
    <div style={{ paddingTop: '30px', paddingBottom: '70px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
                <Activity size={12} />
                NASA EARTH OBSERVATION INTELLIGENCE
              </div>
              <h1 style={styles.pageTitle}>Environmental Signals & Trend Analysis</h1>
              <p style={styles.pageSub}>
                Investigating 44-year satellite observations across South Asia with non-parametric statistical tests (Mann-Kendall & Sen’s Slope) for science-backed preparedness.
              </p>
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(13,21,39,0.8)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setShowTechnical(false)}
                style={{
                  ...styles.toggleTabBtn,
                  ...(!showTechnical ? styles.toggleTabBtnActive : {})
                }}
              >
                Beginner View
              </button>
              <button
                onClick={() => setShowTechnical(true)}
                style={{
                  ...styles.toggleTabBtn,
                  ...(showTechnical ? styles.toggleTabBtnActive : {})
                }}
              >
                Judges / Technical
              </button>
            </div>
          </div>
        </div>

        {/* Top Controls & Filter Bar */}
        <div style={styles.filterBar} className="glass-panel">
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>1. Select Country</label>
            <div style={styles.buttonToggleRow}>
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRegionId(r.id);
                    setSelectedSubRegionId('all');
                    const params = new URLSearchParams(window.location.search);
                    params.set('tab', 'explore');
                    params.set('region', r.id);
                    params.set('var', selectedVariableId);
                    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
                  }}
                  style={{
                    ...styles.filterBtn,
                    ...(selectedRegionId === r.id ? styles.filterBtnActive : {})
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{r.flag}</span>
                  <span>{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>2. Select Environmental Indicator</label>
            <div style={styles.buttonToggleRow}>
              {VARIABLES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVariableChange(v.id)}
                  style={{
                    ...styles.filterBtn,
                    ...(selectedVariableId === v.id ? styles.filterBtnActive : {})
                  }}
                >
                  <span>{v.symbol}</span>
                  <span>{v.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Selectors (Sub-region & Season) */}
          <div style={styles.subFilterRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={14} color="var(--color-cyan)" />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filter Scope:</span>
            </div>
            
            <select
              value={selectedSubRegionId}
              onChange={(e) => handleSubRegionChange(e.target.value)}
              style={styles.selectInput}
              aria-label="Select Sub-Region"
            >
              <option value="all">All Study Sub-Regions in {region.name}</option>
              {region.subRegions.map((sr) => (
                <option key={sr.id} value={sr.id}>{sr.name}</option>
              ))}
            </select>

            <select
              value={selectedSeason}
              onChange={(e) => handleSeasonChange(e.target.value)}
              style={styles.selectInput}
              aria-label="Select Temporal Season"
            >
              <option value="annual">Full Annual Baseline (12-Month)</option>
              <option value="monsoon">Monsoon Peak (June–September)</option>
              <option value="dry">Dry Pre-Monsoon (October–May)</option>
            </select>
          </div>
        </div>

        {/* 4 Environmental Indicator Overview Cards */}
        <div style={styles.indicatorOverviewGrid}>
          {indicatorCards.map(({ variable: v, summary, latest, diffStr, baseline }) => {
            const isSelected = v.id === selectedVariableId;
            return (
              <div
                key={v.id}
                onClick={() => handleVariableChange(v.id)}
                style={{
                  ...styles.indicatorCard,
                  ...(isSelected ? styles.indicatorCardActive : {})
                }}
                className="glass-panel"
                role="button"
                tabIndex={0}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{v.symbol}</span>
                    <span style={{ fontSize: '0.86rem', fontWeight: '700', color: '#FFF' }}>{v.name}</span>
                  </div>
                  <span className={`badge ${summary.significanceBadge?.class || 'badge-cyan'}`} style={{ fontSize: '0.62rem' }}>
                    {summary.directionLabel}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFF' }}>
                    {latest} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#7E8EA6' }}>{v.unit.split('/')[0]}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: '700', color: diffStr.startsWith('+') ? '#55D6FF' : '#FFBF69' }}>
                    {diffStr} vs base
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#A6B4C8', lineHeight: 1.4, marginBottom: '8px' }}>
                  Rate: <strong>{summary.howFastRate || summary.rate || '—'}</strong>
                </div>

                <div style={{ fontSize: '0.66rem', color: '#7E8EA6', fontFamily: "'JetBrains Mono', monospace", borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '6px' }}>
                  Source: {v.dataset.split('/')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dashboard Content Grid */}
        <div style={styles.dashboardGrid}>
          {/* Left Column: Interactive Map & Signal Explanation */}
          <div style={styles.leftCol}>
            {/* Interactive Leaflet Map */}
            <SouthAsiaOverviewMap
              selectedRegionId={selectedRegionId}
              onSelectRegion={(rId) => {
                setSelectedRegionId(rId);
                const params = new URLSearchParams(window.location.search);
                params.set('tab', 'explore');
                params.set('region', rId);
                params.set('var', selectedVariableId);
                window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
              }}
              variableId={selectedVariableId}
            />

            {/* Signal Summary Card with 3-Part Interpretation */}
            <div style={{ marginTop: '24px' }}>
              <SignalCard
                regionId={region.id}
                variableId={variable.id}
                showTechnicalExpanded={showTechnical}
              />
            </div>
          </div>

          {/* Right Column: Chart & Monitoring Recommendations */}
          <div style={styles.rightCol}>
            {/* Long-Term Recharts Line Chart */}
            <TrendChart
              data={historicalData}
              regionId={region.id}
              variableId={variable.id}
              variableName={variable.name}
              unit={variable.unit}
            />

            {/* AUTOMATIC REGIONAL INTERPRETATION (3 MANDATORY SECTIONS) */}
            <div style={styles.autoInterpretationCard} className="glass-panel glass-panel-glow">
              <div style={styles.autoHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.4rem' }}>{region.flag}</span>
                  <div>
                    <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>AUTOMATIC REGIONAL SYNTHESIS</span>
                    <h3 style={{ fontSize: '1.15rem', color: '#FFF', marginTop: '2px' }}>
                      {region.name} · {variable.name} Environmental Analysis
                    </h3>
                  </div>
                </div>
              </div>

              {/* 1. What did we find? */}
              <div style={styles.autoSection}>
                <div style={styles.autoSecHeader}>
                  <span style={styles.secNum}>1</span>
                  <span style={styles.secTitle}>WHAT DID WE FIND?</span>
                </div>
                <p style={styles.autoSecText}>
                  Multi-decadal NASA Earth observations confirm <strong>{trendSummary.whatIsChanging || `${variable.name} is ${trendSummary.directionLabel}`}</strong> across {region.name} at a measured rate of <strong>{trendSummary.howFastRate || trendSummary.rate}</strong>. {trendSummary.isSignificant ? `The Mann-Kendall monotonic test confirms high statistical significance (${trendSummary.pValue}) across 44 years of observational records.` : `Observation data reflects natural seasonal oscillations without a statistically monotonic upward or downward trend.`}
                </p>
              </div>

              {/* 2. What could this mean? */}
              <div style={styles.autoSection}>
                <div style={styles.autoSecHeader}>
                  <span style={{ ...styles.secNum, background: 'rgba(255,191,105,0.15)', color: '#FFBF69', borderColor: '#FFBF69' }}>2</span>
                  <span style={{ ...styles.secTitle, color: '#FFBF69' }}>WHAT COULD THIS MEAN?</span>
                </div>
                <p style={styles.autoSecText}>
                  {trendSummary.simpleMeaning} {region.id === 'bangladesh' ? 'In deltaic floodplains, prolonged soil saturation combined with rainfall surges increases surface water runoff impedance.' : region.id === 'nepal' ? 'Along steep high-altitude Himalayan mountain corridors, concentrated precipitation increases topsoil shear stress.' : region.id === 'india' ? 'Persistent surface warming paired with root-zone moisture deficits accelerates vegetative dry biomass stress.' : 'Rapid shifts between arid moisture deficits and concentrated monsoon surges strain river basin containment.'}
                </p>
                <div style={styles.distinctionNote}>
                  ℹ️ <em>Scientifically supported relationship: Environmental shifts influence background conditions, but do not prove an imminent disaster event.</em>
                </div>
              </div>

              {/* 3. What should we monitor or prepare for? */}
              <div style={styles.autoSection}>
                <div style={styles.autoSecHeader}>
                  <span style={{ ...styles.secNum, background: 'rgba(55,214,163,0.15)', color: '#37D6A3', borderColor: '#37D6A3' }}>3</span>
                  <span style={{ ...styles.secTitle, color: '#37D6A3' }}>WHAT SHOULD WE MONITOR OR PREPARE FOR?</span>
                </div>
                <div style={styles.monGrid}>
                  {trendSummary.monitoringCategories?.map((cat, i) => (
                    <div key={i} style={styles.monBox}>
                      <div style={styles.monCatTitle}>{cat.category}</div>
                      <div style={styles.monCatText}>{cat.item}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div style={styles.disclaimerFootnote}>
                <AlertCircle size={14} color="var(--color-amber)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Scientific Integrity:</strong> Earth's Hidden Signals is an evidence analysis system for preparedness awareness, not a speculative disaster prediction engine.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '2.2rem',
    marginBottom: '6px'
  },
  pageSub: {
    fontSize: '1rem',
    color: 'var(--text-muted)'
  },
  filterBar: {
    padding: '20px',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '30px'
  },
  filterGroup: {
    marginBottom: '16px'
  },
  filterLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    marginBottom: '8px'
  },
  buttonToggleRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    fontWeight: '600',
    padding: '8px 14px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  filterBtnActive: {
    background: 'var(--color-cyan-glow)',
    color: 'var(--color-cyan)',
    borderColor: 'var(--color-cyan)',
    boxShadow: '0 0 12px var(--color-cyan-glow)'
  },
  subFilterRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-subtle)',
    flexWrap: 'wrap'
  },
  selectInput: {
    background: '#070A12',
    border: '1px solid var(--border-subtle)',
    color: '#FFF',
    fontSize: '0.82rem',
    padding: '6px 12px',
    borderRadius: '6px',
    outline: 'none'
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.2fr',
    gap: '30px'
  },
  leftCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  rightCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  monitoringCard: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)'
  },
  monHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  monSub: {
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5,
    marginBottom: '16px'
  },
  monGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '16px'
  },
  monBox: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    padding: '12px 14px'
  },
  monCatTitle: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--color-green)',
    marginBottom: '4px'
  },
  monCatText: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4
  },
  disclaimerFootnote: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: '12px'
  },
  toggleTabBtn: {
    background: 'transparent',
    border: 'none',
    color: '#7E8EA6',
    fontSize: '0.78rem',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  toggleTabBtnActive: {
    background: 'rgba(85, 214, 255, 0.15)',
    color: '#55D6FF',
    boxShadow: '0 0 8px rgba(85, 214, 255, 0.2)',
  },
  indicatorOverviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  },
  indicatorCard: {
    padding: '16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  indicatorCardActive: {
    borderColor: 'rgba(85, 214, 255, 0.4)',
    background: 'rgba(17, 29, 50, 0.9)',
    boxShadow: '0 0 16px rgba(85, 214, 255, 0.15)',
  },
  autoInterpretationCard: {
    padding: '24px',
    borderRadius: '16px',
    marginTop: '20px',
  },
  autoHeader: {
    marginBottom: '18px',
    paddingBottom: '14px',
    borderBottom: '1px solid rgba(85, 214, 255, 0.15)',
  },
  autoSection: {
    marginBottom: '16px',
    padding: '14px',
    background: 'rgba(8, 13, 27, 0.4)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  autoSecHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  secNum: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'rgba(85, 214, 255, 0.15)',
    border: '1px solid #55D6FF',
    color: '#55D6FF',
    fontSize: '0.68rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace",
  },
  secTitle: {
    fontSize: '0.8rem',
    fontWeight: '800',
    color: '#55D6FF',
    letterSpacing: '0.06em',
    fontFamily: "'JetBrains Mono', monospace",
  },
  autoSecText: {
    fontSize: '0.86rem',
    color: '#F4F7FB',
    lineHeight: 1.6,
    margin: 0,
  },
  distinctionNote: {
    marginTop: '8px',
    fontSize: '0.74rem',
    color: '#A6B4C8',
    background: 'rgba(0,0,0,0.2)',
    padding: '6px 10px',
    borderRadius: '6px',
  },
};
