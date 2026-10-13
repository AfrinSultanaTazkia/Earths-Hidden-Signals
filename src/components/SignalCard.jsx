import React, { useState } from 'react';
import { GET_TREND_SUMMARY, VARIABLES } from '../data/earthSignalsData';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, MinusCircle, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

export default function SignalCard({ regionId, variableId, showTechnicalExpanded = false }) {
  const [internalTechnical, setInternalTechnical] = useState(false);
  const showTechnical = showTechnicalExpanded || internalTechnical;
  const summary = GET_TREND_SUMMARY(regionId, variableId);
  const variableObj = VARIABLES.find(v => v.id === variableId) || VARIABLES[0];

  // ─── Significance visual mapping ──────────────────────────────────────
  let StatusIcon = Minus;
  let statusBadgeClass = 'badge-neutral';
  let statusColor = 'var(--text-muted)';
  let trendArrow = null;
  let statusDescription = '';

  if (summary.statusType === 'inconclusive') {
    StatusIcon = Info;
    statusBadgeClass = 'badge-neutral';
    statusColor = '#7C6FA6'; // Insufficient data purple
    statusDescription = 'Insufficient data for a reliable trend assessment.';
  } else if (!summary.isSignificant) {
    StatusIcon = Minus;
    statusBadgeClass = 'badge-neutral';
    statusColor = '#718096'; // Neutral grey for non-significant
    statusDescription = 'No statistically significant monotonic trend detected (p ≥ 0.05).';
  } else if (summary.statusType === 'increasing') {
    StatusIcon = TrendingUp;
    statusBadgeClass = 'badge-amber';
    statusColor = '#16866B'; // Significant positive
    trendArrow = '↑';
    statusDescription = 'Statistically significant increasing trend detected (p < 0.05).';
  } else if (summary.statusType === 'decreasing') {
    StatusIcon = TrendingDown;
    statusBadgeClass = 'badge-red';
    statusColor = '#D97732'; // Significant negative
    trendArrow = '↓';
    statusDescription = 'Statistically significant decreasing trend detected (p < 0.05).';
  }

  return (
    <div style={styles.card} className="glass-panel glass-panel-glow">

      {/* ── HEADER: Variable name + significance badge ──────────────── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.variableSymbol}>{variableObj.symbol}</span>
          <div>
            <div style={styles.sectionLabel}>TREND ANALYSIS RESULT</div>
            <h3 style={styles.title}>{variableObj.fullName}</h3>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {variableObj.dataset} · {summary.samplePeriod}
            </div>
          </div>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 12px', borderRadius: '999px', fontSize: '0.72rem',
          fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em',
          background: !summary.isSignificant ? 'rgba(113,128,150,0.15)' : summary.statusType === 'increasing' ? 'rgba(22,134,107,0.15)' : 'rgba(217,119,50,0.15)',
          color: statusColor,
          border: `1px solid ${statusColor}40`
        }}>
          <StatusIcon size={14} />
          <span>{summary.directionLabel}</span>
        </div>
      </div>

      {/* ── METRIC QUICK GRID ────────────────────────────────────────── */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Significance Status</div>
          <div style={{ ...styles.metricVal, fontSize: '0.84rem', color: statusColor }}>
            {summary.isSignificant ? `✓ Significant (p < 0.05)` : (summary.statusType === 'inconclusive' ? '? Inconclusive' : '✗ Not Significant')}
          </div>
        </div>

        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Sen's Slope (Rate)</div>
          <div style={{ ...styles.metricVal, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
            {summary.sensSlope || '—'}
          </div>
        </div>

        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>p-Value</div>
          <div style={{ ...styles.metricVal, fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: summary.isSignificant ? '#16866B' : '#718096' }}>
            {summary.pValue && summary.pValue !== '—' ? `p = ${summary.pValue}` : '—'}
          </div>
        </div>

        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Analysis Period</div>
          <div style={{ ...styles.metricVal, fontSize: '0.84rem' }}>
            {summary.samplePeriod || '—'}
          </div>
        </div>
      </div>

      {/* ── SIGNIFICANCE CONTEXT NOTE ────────────────────────────────── */}
      <div style={{
        ...styles.meaningBox,
        background: !summary.isSignificant ? 'rgba(113,128,150,0.08)' : summary.statusType === 'increasing' ? 'rgba(22,134,107,0.08)' : 'rgba(217,119,50,0.08)',
        borderColor: !summary.isSignificant ? 'rgba(113,128,150,0.25)' : summary.statusType === 'increasing' ? 'rgba(22,134,107,0.25)' : 'rgba(217,119,50,0.25)'
      }}>
        <div style={{ ...styles.meaningTitle, color: statusColor }}>
          💡 What does this mean?
        </div>
        <p style={styles.meaningText}>{summary.simpleMeaning}</p>

        {/* Non-significant explanation — equally prominent */}
        {!summary.isSignificant && (
          <div style={styles.nonSigNote}>
            <Info size={14} style={{ flexShrink: 0, color: '#718096' }} />
            <span>
              <strong style={{ color: '#718096' }}>Non-significant result: </strong>
              {summary.significanceNote}
            </span>
          </div>
        )}
      </div>

      {/* ── TECHNICAL EVIDENCE EXPANDABLE ───────────────────────────── */}
      <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '14px' }}>
        <button
          onClick={() => setInternalTechnical(!internalTechnical)}
          style={styles.technicalToggleBtn}
          aria-expanded={showTechnical}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '700', color: '#FFFFFF', fontSize: '0.88rem' }}>
              Statistical Test Details
            </span>
            <span style={{
              background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)', borderRadius: '4px',
              fontSize: '0.66rem', fontWeight: '700', padding: '2px 7px',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.04em'
            }}>
              Mann-Kendall / Sen's Slope
            </span>
          </div>
          {internalTechnical ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showTechnical && (
          <div style={styles.technicalPanel}>
            <div style={styles.techGrid}>

              {/* Sen's Slope */}
              <div style={styles.techItem}>
                <div style={styles.techHeader}>
                  <span>Sen's Slope Estimator</span>
                  <div className="info-tooltip">
                    <HelpCircle size={14} />
                    <span className="tooltip-text">
                      <strong>Sen's Slope:</strong> The median of all pairwise annual slopes in the time series. A robust, non-parametric estimate of the annual rate of change — not skewed by extreme years.
                    </span>
                  </div>
                </div>
                <div style={{ ...styles.techValue, fontFamily: 'var(--font-mono)' }}>
                  {summary.sensSlope || '—'}
                </div>
                <div style={styles.techNote}>Median pairwise slope</div>
              </div>

              {/* Mann-Kendall Z */}
              <div style={styles.techItem}>
                <div style={styles.techHeader}>
                  <span>Mann-Kendall Z-Score</span>
                  <div className="info-tooltip">
                    <HelpCircle size={14} />
                    <span className="tooltip-text">
                      <strong>Mann-Kendall Z:</strong> The standardized test statistic. Positive Z = increasing trend direction; negative Z = decreasing. Significance is judged by the p-value, not the Z magnitude alone.
                    </span>
                  </div>
                </div>
                <div style={{ ...styles.techValue, fontFamily: 'var(--font-mono)' }}>
                  {/* Fixed: no double-prefix. mkZ is now a clean number string */}
                  Z = {summary.mkZ || '—'}
                </div>
                <div style={styles.techNote}>Normalized test statistic</div>
              </div>

              {/* p-value */}
              <div style={styles.techItem}>
                <div style={styles.techHeader}>
                  <span>Two-Tailed p-Value</span>
                  <div className="info-tooltip">
                    <HelpCircle size={14} />
                    <span className="tooltip-text">
                      <strong>p-value:</strong> Probability of observing this trend by chance under the null hypothesis of no trend. p &lt; 0.05 is the significance threshold used here.
                    </span>
                  </div>
                </div>
                <div style={{ ...styles.techValue, fontFamily: 'var(--font-mono)', color: summary.isSignificant ? '#16866B' : '#718096' }}>
                  {summary.pValueLabel || '—'}
                </div>
                <div style={styles.techNote}>Threshold: p &lt; 0.05</div>
              </div>

              {/* Spatial resolution */}
              <div style={styles.techItem}>
                <div style={styles.techHeader}>
                  <span>Spatial Resolution</span>
                  <div className="info-tooltip">
                    <HelpCircle size={14} />
                    <span className="tooltip-text">
                      <strong>Spatial resolution:</strong> The geographic size of each satellite sensor pixel cell. Country-wide analyses average across many cells — this is not a point measurement.
                    </span>
                  </div>
                </div>
                <div style={{ ...styles.techValue, fontFamily: 'var(--font-mono)' }}>
                  {summary.spatialRes || '—'}
                </div>
                <div style={styles.techNote}>Dataset grid cell size</div>
              </div>
            </div>

            {/* Data provenance note — always visible in technical view */}
            <div style={styles.provenanceNote}>
              <Info size={13} style={{ flexShrink: 0, color: 'var(--color-cyan)', marginTop: '1px' }} />
              <span>
                <strong style={{ color: 'var(--color-cyan)' }}>Data Note: </strong>
                {summary.dataNote}
              </span>
            </div>

            {/* Significance interpretation note */}
            <div style={{ ...styles.provenanceNote, marginTop: '6px', borderColor: summary.isSignificant ? 'rgba(22,134,107,0.25)' : 'rgba(113,128,150,0.25)' }}>
              <Info size={13} style={{ flexShrink: 0, color: summary.isSignificant ? '#16866B' : '#718096', marginTop: '1px' }} />
              <span style={{ color: 'var(--text-muted)' }}>
                <strong style={{ color: summary.isSignificant ? '#16866B' : '#718096' }}>Interpretation: </strong>
                {summary.significanceNote}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── WHAT TO WATCH ────────────────────────────────────────────── */}
      {summary.monitoringCategories && summary.monitoringCategories.length > 0 && (
        <div style={styles.monitorSection}>
          <div style={styles.monitorTitle}>What to Monitor</div>
          <div style={styles.monitorGrid}>
            {summary.monitoringCategories.map((cat, i) => (
              <div key={i} style={styles.monitorBox}>
                <div style={styles.monitorCat}>{cat.category}</div>
                <div style={styles.monitorText}>{cat.item}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { padding: '24px', borderRadius: 'var(--radius-lg)' },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '20px', flexWrap: 'wrap', gap: '12px'
  },
  headerLeft: { display: 'flex', alignItems: 'flex-start', gap: '14px' },
  variableSymbol: {
    fontSize: '1.8rem', background: 'rgba(255,255,255,0.05)',
    width: '48px', height: '48px', minWidth: '48px', borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid var(--border-subtle)'
  },
  sectionLabel: { fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-cyan)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' },
  title: { fontSize: '1.05rem', fontWeight: '800', color: '#FFFFFF', lineHeight: 1.25 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '16px' },
  metricBox: { background: 'rgba(0,0,0,0.25)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '10px 12px' },
  metricLabel: { fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' },
  metricVal: { fontSize: '0.95rem', fontWeight: '700', color: '#FFFFFF' },
  meaningBox: { background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 'var(--radius-md)', padding: '14px 16px' },
  meaningTitle: { fontSize: '0.88rem', fontWeight: '700', color: 'var(--color-cyan)', marginBottom: '6px' },
  meaningText: { fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.6 },
  nonSigNote: {
    display: 'flex', gap: '8px', alignItems: 'flex-start',
    marginTop: '10px', paddingTop: '10px',
    borderTop: '1px solid rgba(113,128,150,0.2)',
    fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5
  },
  technicalToggleBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    background: 'transparent', border: 'none', color: 'var(--text-muted)',
    fontSize: '0.88rem', cursor: 'pointer', padding: '6px 0'
  },
  technicalPanel: { marginTop: '12px', background: '#070A12', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px' },
  techGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px', marginBottom: '12px' },
  techItem: { background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' },
  techHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '6px' },
  techValue: { fontSize: '0.88rem', fontWeight: '700', color: '#FFFFFF' },
  techNote: { fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '3px' },
  provenanceNote: {
    display: 'flex', gap: '8px', alignItems: 'flex-start',
    fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45,
    background: 'rgba(85,214,255,0.04)', border: '1px solid rgba(85,214,255,0.15)',
    borderRadius: '6px', padding: '8px 10px'
  },
  monitorSection: { marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' },
  monitorTitle: { fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-green)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' },
  monitorGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '8px' },
  monitorBox: { background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '10px 12px' },
  monitorCat: { fontSize: '0.76rem', fontWeight: '700', color: 'var(--color-green)', marginBottom: '3px' },
  monitorText: { fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.45 }
};
