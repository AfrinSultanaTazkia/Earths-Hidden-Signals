import React from 'react';
import { METHODOLOGY_STEPS, NASA_DATA_SOURCES } from '../data/earthSignalsData';
import { Cpu, CheckCircle2, Database, ShieldAlert, Sparkles, ExternalLink, HelpCircle, ArrowRight } from 'lucide-react';

export default function Methodology() {
  return (
    <div style={{ paddingTop: '40px', paddingBottom: '80px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            <Cpu size={12} />
            NASA SPACE APPS 2026 — SCIENCE & METHODOLOGY
          </div>
          <h1 style={styles.pageTitle}>🔬 How Earth’s Hidden Signals Works</h1>
          <p style={styles.pageSub}>
            A rigorous 8-step analytical pipeline designed for NASA judges and technical researchers, processing 44 years of satellite observations into validated environmental evidence.
          </p>
        </div>

        {/* 8-Step Pipeline Overview Card */}
        <div style={styles.pipelineCard} className="glass-panel glass-panel-glow">
          <div style={styles.pipelineHeader}>
            <Sparkles size={16} color="var(--color-cyan)" />
            <span>END-TO-END ANALYTICAL WORKFLOW</span>
          </div>

          <div style={styles.flowRow}>
            {METHODOLOGY_STEPS.map((s, idx) => (
              <React.Fragment key={s.step}>
                <div style={styles.flowStepNode}>
                  <div style={styles.flowStepNum}>{s.step}</div>
                  <div style={{ fontSize: '1.4rem', margin: '4px 0' }}>{s.icon}</div>
                  <div style={styles.flowStepTitle}>{s.title.split('.')[1]}</div>
                </div>
                {idx < METHODOLOGY_STEPS.length - 1 && (
                  <span style={{ color: 'var(--color-cyan)', fontSize: '1.2rem', fontWeight: '800' }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Core Scientific Concepts for Judges */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={styles.subHeading}>Core Statistical & Mathematical Foundations</h2>
          
          <div style={styles.conceptGrid}>
            <div style={styles.conceptCard} className="glass-panel">
              <div style={styles.conceptCardHeader}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-cyan)' }}>1. Mann–Kendall Trend Test</h3>
                <span className="badge badge-cyan">Non-Parametric</span>
              </div>
              <p style={styles.conceptText}>
                The Mann-Kendall test evaluates whether a environmental variable exhibits a monotonic upward or downward trend over time without assuming normal distribution. It generates normalized Z-scores and two-tailed p-values (p &lt; 0.05) to confirm statistical significance over random noise.
              </p>
              <div style={styles.formulaBox} className="mono">
                S = ∑_{'{k=1}'}^{'{n-1}'} ∑_{'{j=k+1}'}^{'{n}'} sgn(x_j - x_k)
              </div>
            </div>

            <div style={styles.conceptCard} className="glass-panel">
              <div style={styles.conceptCardHeader}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-amber)' }}>2. Sen’s Slope Estimator</h3>
                <span className="badge badge-amber">Robust Magnitude Rate</span>
              </div>
              <p style={styles.conceptText}>
                Sen’s slope calculates the median slope among all pairs of sample points over the 1981–2025 observational window. Unlike standard linear regression, Sen's slope is robust against extreme weather outliers and missing satellite scenes.
              </p>
              <div style={styles.formulaBox} className="mono">
                Q_i = \frac{'{x_j - x_k}'}{'{j - k}'}, \quad \text{'{Sen Slope}'} = \text{'{Median}'}(Q_i)
              </div>
            </div>

            <div style={styles.conceptCard} className="glass-panel">
              <div style={styles.conceptCardHeader}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-green)' }}>3. Autocorrelation & Pre-Whitening</h3>
                <span className="badge badge-green">Serial Correction</span>
              </div>
              <p style={styles.conceptText}>
                High-frequency monthly climate data can exhibit lag-1 autocorrelation. We apply Modified Mann-Kendall pre-whitening transformations to eliminate artificial statistical significance induced by natural climate oscillations.
              </p>
              <div style={styles.formulaBox} className="mono">
                x'_t = x_t - \rho_1 x_t-1
              </div>
            </div>
          </div>
        </div>

        {/* Detailed 8-Step Breakdown */}
        <div style={{ marginBottom: '50px' }}>
          <h2 style={styles.subHeading}>Detailed 8-Step Processing Methodology</h2>

          <div style={styles.stepsList}>
            {METHODOLOGY_STEPS.map((s) => (
              <div key={s.step} style={styles.stepRowCard} className="glass-panel">
                <div style={styles.stepIconCol}>
                  <div style={styles.stepNumberBadge}>{s.step}</div>
                  <div style={{ fontSize: '1.6rem', marginTop: '6px' }}>{s.icon}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>{s.title}</h3>
                    <span className="badge badge-neutral">{s.shortDesc}</span>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.6 }}>
                    {s.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official NASA Datasets Section */}
        <div>
          <h2 style={styles.subHeading}>Verified NASA Earth Science Mission Datasets</h2>

          <div style={styles.dataGrid}>
            {NASA_DATA_SOURCES.map((source, idx) => (
              <div key={idx} style={styles.dataCard} className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem', color: '#FFF' }}>{source.name}</h4>
                  <Database size={16} color="var(--color-cyan)" />
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', marginBottom: '8px' }}>{source.fullName}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '12px' }}>
                  {source.description}
                </p>
                <div style={styles.dataMetaRow}>
                  <span>Grid: {source.resolution}</span>
                  <span>Span: {source.timeSpan}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    marginBottom: '28px'
  },
  pageTitle: {
    fontSize: '2.4rem',
    marginBottom: '6px'
  },
  pageSub: {
    fontSize: '1.05rem',
    color: 'var(--text-muted)',
    maxWidth: '820px'
  },
  pipelineCard: {
    padding: '28px',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '40px'
  },
  pipelineHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--color-cyan)',
    letterSpacing: '0.05em',
    marginBottom: '20px'
  },
  flowRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '8px'
  },
  flowStepNode: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
    textAlign: 'center',
    flex: 1,
    minWidth: '110px'
  },
  flowStepNum: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'var(--color-cyan-glow)',
    color: 'var(--color-cyan)',
    fontSize: '0.75rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    fontFamily: 'var(--font-mono)'
  },
  flowStepTitle: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: '#FFF'
  },
  subHeading: {
    fontSize: '1.6rem',
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: '20px'
  },
  conceptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px'
  },
  conceptCard: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)'
  },
  conceptCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  conceptText: {
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
    marginBottom: '16px'
  },
  formulaBox: {
    background: '#070A12',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '0.82rem',
    color: 'var(--color-cyan)',
    textAlign: 'center'
  },
  stepsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  stepRowCard: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start'
  },
  stepIconCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '40px'
  },
  stepNumberBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--color-cyan-glow)',
    border: '1px solid var(--color-cyan)',
    color: 'var(--color-cyan)',
    fontSize: '0.9rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)'
  },
  dataGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px'
  },
  dataCard: {
    padding: '20px',
    borderRadius: 'var(--radius-md)'
  },
  dataMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: '10px',
    fontFamily: 'var(--font-mono)'
  }
};
