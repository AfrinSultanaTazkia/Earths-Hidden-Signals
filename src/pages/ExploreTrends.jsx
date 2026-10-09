import React, { useState } from 'react';
import { REGIONS, VARIABLES, GENERATE_HISTORICAL_DATA, GET_TREND_SUMMARY } from '../data/earthSignalsData';
import SouthAsiaOverviewMap from '../components/SouthAsiaOverviewMap';
import SignalCard from '../components/SignalCard';
import TrendChart from '../components/TrendChart';
import { Activity, ShieldCheck, Filter, AlertCircle, Sparkles, Sliders } from 'lucide-react';

export default function ExploreTrends({ selectedRegionId, setSelectedRegionId }) {
  const [selectedVariableId, setSelectedVariableId] = useState('rainfall');
  const [selectedSubRegionId, setSelectedSubRegionId] = useState('all');
  const [selectedSeason, setSelectedSeason] = useState('annual');
  const [selectedPeriod, setSelectedPeriod] = useState('1981-2025');

  const region = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];
  const variable = VARIABLES.find(v => v.id === selectedVariableId) || VARIABLES[0];

  // Generate historical data
  const historicalData = GENERATE_HISTORICAL_DATA(region.id, variable.id);
  const trendSummary = GET_TREND_SUMMARY(region.id, variable.id);

  return (
    <div style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              <Activity size={12} />
              INTERACTIVE SIGNAL DASHBOARD
            </div>
            <h1 style={styles.pageTitle}>Explore Environmental Signals</h1>
            <p style={styles.pageSub}>
              Select a region and satellite variable to observe long-term trends, statistical confidence, and monitoring guidance across South Asia.
            </p>
          </div>
        </div>

        {/* Top Controls & Filter Bar */}
        <div style={styles.filterBar} className="glass-panel">
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Select Country</label>
            <div style={styles.buttonToggleRow}>
              {REGIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setSelectedRegionId(r.id);
                    setSelectedSubRegionId('all');
                  }}
                  style={{
                    ...styles.filterBtn,
                    ...(selectedRegionId === r.id ? styles.filterBtnActive : {})
                  }}
                >
                  <span>{r.flag}</span>
                  <span>{r.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Select Satellite Variable</label>
            <div style={styles.buttonToggleRow}>
              {VARIABLES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariableId(v.id)}
                  style={{
                    ...styles.filterBtn,
                    ...(selectedVariableId === v.id ? styles.filterBtnActive : {})
                  }}
                >
                  <span>{v.symbol}</span>
                  <span>{v.name.split(' ')[0]}</span>
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
              onChange={(e) => setSelectedSubRegionId(e.target.value)}
              style={styles.selectInput}
            >
              <option value="all">All Study Sub-Regions in {region.name}</option>
              {region.subRegions.map((sr) => (
                <option key={sr.id} value={sr.id}>{sr.name}</option>
              ))}
            </select>

            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              style={styles.selectInput}
            >
              <option value="annual">Full Annual Trend (12 Months)</option>
              <option value="monsoon">Monsoon Peak (June–September)</option>
              <option value="dry">Dry Season (October–April)</option>
            </select>
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div style={styles.dashboardGrid}>
          {/* Left Column: Interactive Map & Simple Explanation First */}
          <div style={styles.leftCol}>
            {/* Interactive Leaflet Map */}
            <SouthAsiaOverviewMap
              selectedRegionId={selectedRegionId}
              onSelectRegion={setSelectedRegionId}
              variableId={selectedVariableId}
            />

            {/* Signal Summary Card (Simple explanation first -> Technical evidence second) */}
            <div style={{ marginTop: '24px' }}>
              <SignalCard
                regionId={region.id}
                variableId={variable.id}
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

            {/* "WHAT SHOULD BE MONITORED?" SECTION */}
            <div style={styles.monitoringCard} className="glass-panel">
              <div style={styles.monHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} color="var(--color-green)" />
                  <h3 style={{ fontSize: '1.1rem', color: '#FFF' }}>What Should Be Monitored & Prepared For?</h3>
                </div>
                <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Preparedness, Not Prediction</span>
              </div>

              <p style={styles.monSub}>
                Based on the observed <strong>{variable.name} ({trendSummary.directionLabel})</strong> signal in <strong>{region.name}</strong>, local authorities and communities should prioritize monitoring:
              </p>

              <div style={styles.monGrid}>
                {trendSummary.monitoringCategories.map((cat, i) => (
                  <div key={i} style={styles.monBox}>
                    <div style={styles.monCatTitle}>{cat.category}</div>
                    <div style={styles.monCatText}>{cat.item}</div>
                  </div>
                ))}
              </div>

              {/* Disclaimer Notice */}
              <div style={styles.disclaimerFootnote}>
                <AlertCircle size={14} color="var(--color-amber)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Important Notice:</strong> These are risk-relevant monitoring suggestions derived from long-term signal trends. They do not constitute a disaster prediction.
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
  }
};
