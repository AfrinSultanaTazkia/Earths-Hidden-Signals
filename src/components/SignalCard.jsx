import React, { useState } from 'react';
import { GET_TREND_SUMMARY, VARIABLES } from '../data/earthSignalsData';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, MinusCircle, ShieldCheck } from 'lucide-react';

export default function SignalCard({ regionId, variableId }) {
  const [showTechnical, setShowTechnical] = useState(false);
  const summary = GET_TREND_SUMMARY(regionId, variableId);
  const variableObj = VARIABLES.find(v => v.id === variableId) || VARIABLES[0];

  // Visual icon for status
  let StatusIcon = CheckCircle;
  let statusBadgeClass = 'badge-cyan';
  if (summary.statusType === 'increasing') {
    StatusIcon = AlertTriangle;
    statusBadgeClass = 'badge-amber';
  } else if (summary.statusType === 'decreasing') {
    StatusIcon = AlertTriangle;
    statusBadgeClass = 'badge-red';
  } else if (summary.statusType === 'neutral') {
    StatusIcon = MinusCircle;
    statusBadgeClass = 'badge-neutral';
  }

  return (
    <div style={styles.card} className="glass-panel glass-panel-glow">
      {/* 1. SIMPLE SUMMARY HEADER: "What did we find?" */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.variableSymbol}>{variableObj.symbol}</span>
          <div>
            <div style={styles.sectionLabel}>WHAT DID WE FIND?</div>
            <h3 style={styles.title}>{variableObj.name} Signal Detected</h3>
          </div>
        </div>
        <div className={`badge ${statusBadgeClass}`}>
          <StatusIcon size={14} />
          <span>{summary.directionLabel}</span>
        </div>
      </div>

      {/* Metric Quick Grid */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Direction</div>
          <div style={{ ...styles.metricVal, color: summary.statusType === 'increasing' ? 'var(--color-amber)' : summary.statusType === 'decreasing' ? 'var(--color-red)' : 'var(--color-cyan)' }}>
            {summary.directionLabel}
          </div>
        </div>

        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Rate of Change</div>
          <div style={styles.metricVal} className="mono">
            {summary.rate}
          </div>
        </div>

        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Statistical Confidence</div>
          <div style={{ ...styles.metricVal, fontSize: '0.85rem' }}>
            {summary.confidence}
          </div>
        </div>

        <div style={styles.metricBox}>
          <div style={styles.metricLabel}>Observation Span</div>
          <div style={{ ...styles.metricVal, fontSize: '0.85rem' }}>
            {summary.samplePeriod}
          </div>
        </div>
      </div>

      {/* 2. SIMPLE EXPLANATION: "What does this mean?" */}
      <div style={styles.meaningBox}>
        <div style={styles.meaningTitle}>
          <span>💡 What does this mean?</span>
        </div>
        <p style={styles.meaningText}>{summary.simpleMeaning}</p>
      </div>

      {/* 3. TECHNICAL EVIDENCE EXPANDABLE SECTION */}
      <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <button
          onClick={() => setShowTechnical(!showTechnical)}
          style={styles.technicalToggleBtn}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '700', color: '#FFFFFF' }}>Statistical Evidence & Test Metrics</span>
            <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>Mann-Kendall / Sen's Slope</span>
          </div>
          {showTechnical ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showTechnical && (
          <div style={styles.technicalPanel}>
            <div style={styles.techGrid}>
              <div style={styles.techItem}>
                <div style={styles.techHeader}>
                  <span>Sen’s Slope Estimator</span>
                  <div className="info-tooltip">
                    <HelpCircle size={14} />
                    <span className="tooltip-text">
                      <strong>Sen’s Slope:</strong> A non-parametric calculation that measures the true annual rate of change without being skewed by extreme weather outliers.
                    </span>
                  </div>
                </div>
                <div style={styles.techValue} className="mono">{summary.sensSlope} {variableObj.unit} / yr</div>
              </div>

              <div style={styles.techItem}>
                <div style={styles.techHeader}>
                  <span>Mann-Kendall Test Z-Score</span>
                  <div className="info-tooltip">
                    <HelpCircle size={14} />
                    <span className="tooltip-text">
                      <strong>Mann-Kendall Test:</strong> A statistical test used to check if a long-term temporal trend is statistically real or just random noise.
                    </span>
                  </div>
                </div>
                <div style={styles.techValue} className="mono">Z = {summary.mannKendallZ}</div>
              </div>

              <div style={styles.techItem}>
                <div style={styles.techHeader}>
                  <span>p-Value Significance</span>
                  <div className="info-tooltip">
                    <HelpCircle size={14} />
                    <span className="tooltip-text">
                      <strong>p-value:</strong> Probability that the trend happened by chance. Values below 0.05 confirm a statistically significant trend.
                    </span>
                  </div>
                </div>
                <div style={styles.techValue} className="mono">p {summary.pValue}</div>
              </div>

              <div style={styles.techItem}>
                <div style={styles.techHeader}>
                  <span>Spatial Grid Resolution</span>
                  <div className="info-tooltip">
                    <HelpCircle size={14} />
                    <span className="tooltip-text">
                      <strong>Spatial Resolution:</strong> The geographic cell dimensions of the satellite sensor pixel grid.
                    </span>
                  </div>
                </div>
                <div style={styles.techValue} className="mono">{summary.spatialRes}</div>
              </div>
            </div>

            {/* Note on Statistical Interpretation */}
            <div style={styles.statNote}>
              {summary.status === 'No Detectable Trend' ? (
                <span>
                  ℹ️ <strong>Note on Statistical UX:</strong> "No Detectable Trend" means no statistically significant trend was found in this specific dataset over this time window. It does not prove that no environmental change occurred.
                </span>
              ) : (
                <span>
                  ℹ️ <strong>Statistical Significance:</strong> Evidence indicates a persistent, monotonic long-term trend exceeding 95% confidence bounds (p &lt; 0.05).
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  variableSymbol: {
    fontSize: '2rem',
    background: 'rgba(255,255,255,0.05)',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-subtle)'
  },
  sectionLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    color: 'var(--color-cyan)',
    letterSpacing: '0.05em'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#FFFFFF'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '12px',
    marginBottom: '20px'
  },
  metricBox: {
    background: 'rgba(0,0,0,0.25)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px'
  },
  metricLabel: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em'
  },
  metricVal: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: '4px'
  },
  meaningBox: {
    background: 'rgba(6, 182, 212, 0.06)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderRadius: 'var(--radius-md)',
    padding: '16px 18px'
  },
  meaningTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--color-cyan)',
    marginBottom: '6px'
  },
  meaningText: {
    fontSize: '0.88rem',
    color: 'var(--text-main)',
    lineHeight: 1.55
  },
  technicalToggleBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    cursor: 'pointer',
    padding: '8px 0'
  },
  technicalPanel: {
    marginTop: '12px',
    background: '#070A12',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '16px'
  },
  techGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    marginBottom: '12px'
  },
  techItem: {
    background: 'rgba(255,255,255,0.02)',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  techHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.72rem',
    color: 'var(--text-muted)'
  },
  techValue: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: '4px'
  },
  statNote: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: '10px',
    marginTop: '6px',
    lineHeight: 1.4
  }
};
