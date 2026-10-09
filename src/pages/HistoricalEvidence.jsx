import React, { useState } from 'react';
import { HISTORICAL_EVIDENCE_LIST } from '../data/earthSignalsData';
import { History, ShieldAlert, ArrowRight, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export default function HistoricalEvidence({ setActiveTab, setSelectedRegionId }) {
  const [selectedEvidenceId, setSelectedEvidenceId] = useState('bd-flood');

  const selectedItem = HISTORICAL_EVIDENCE_LIST.find(item => item.id === selectedEvidenceId) || HISTORICAL_EVIDENCE_LIST[0];

  return (
    <div style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            <History size={12} />
            COMPARATIVE HISTORICAL ENGINE
          </div>
          <h1 style={styles.pageTitle}>From Environmental Signals to Historical Evidence</h1>
          <p style={styles.pageSub}>
            Comparing current multi-decadal satellite signal trajectories with environmental conditions documented around historical events across South Asia.
          </p>
        </div>

        {/* Prominent Disclaimer Banner */}
        <div style={styles.disclaimerBanner} className="glass-panel">
          <ShieldAlert size={22} color="var(--color-amber)" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: 'var(--color-amber)', fontSize: '0.95rem' }}>Core Scientific Rule:</strong>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              <strong>Historical similarity does not mean the same event will happen again.</strong> This engine highlights background environmental conditions observed during past stress periods to build informed situational awareness — not to predict disasters.
            </p>
          </div>
        </div>

        {/* Visual Pipeline Flow */}
        <div style={styles.pipelineCard} className="glass-panel">
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-cyan)', textTransform: 'uppercase', marginBottom: '16px' }}>
            EVIDENCE TRANSLATION CHAIN
          </div>
          <div style={styles.chainRow}>
            <div style={styles.chainNode}>
              <div style={styles.chainBadge}>1</div>
              <div style={styles.chainTitle}>Environmental Signal</div>
              <div style={styles.chainSub}>NASA satellite trend vector</div>
            </div>
            <div style={styles.chainArrow}>→</div>

            <div style={styles.chainNode}>
              <div style={styles.chainBadge}>2</div>
              <div style={styles.chainTitle}>Historical Pattern</div>
              <div style={styles.chainSub}>Pre-event baseline moisture & temp</div>
            </div>
            <div style={styles.chainArrow}>→</div>

            <div style={styles.chainNode}>
              <div style={styles.chainBadge}>3</div>
              <div style={styles.chainTitle}>Observed Event</div>
              <div style={styles.chainSub}>Documented historical occurrence</div>
            </div>
            <div style={styles.chainArrow}>→</div>

            <div style={styles.chainNode}>
              <div style={{ ...styles.chainBadge, background: 'var(--color-green-glow)', color: 'var(--color-green)' }}>4</div>
              <div style={{ ...styles.chainTitle, color: 'var(--color-green)' }}>What We Can Learn</div>
              <div style={styles.chainSub}>Actionable preparedness focus</div>
            </div>
          </div>
        </div>

        {/* Regional Selection Tabs */}
        <div style={styles.tabRow}>
          {HISTORICAL_EVIDENCE_LIST.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedEvidenceId(item.id)}
              style={{
                ...styles.tabBtn,
                ...(selectedEvidenceId === item.id ? styles.tabBtnActive : {})
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span>{item.country} ({item.eventTitle.split(' ')[0]})</span>
            </button>
          ))}
        </div>

        {/* Selected Evidence Detail Box */}
        <div style={styles.detailCard} className="glass-panel glass-panel-glow">
          <div style={styles.detailHeader}>
            <div>
              <span className="badge badge-cyan">{selectedItem.flag} {selectedItem.country}</span>
              <h2 style={styles.detailTitle}>{selectedItem.eventTitle}</h2>
            </div>
            <button
              className="btn-outline"
              onClick={() => {
                setSelectedRegionId(selectedItem.country.toLowerCase());
                setActiveTab('casestudies');
              }}
            >
              <span>View Full Case Study</span>
              <BookOpen size={16} />
            </button>
          </div>

          <div style={styles.detailGrid}>
            <div style={styles.detailBox}>
              <div style={styles.boxTag}>ENVIRONMENTAL SIGNAL</div>
              <p style={styles.boxText}>{selectedItem.environmentalSignal}</p>
            </div>

            <div style={styles.detailBox}>
              <div style={styles.boxTag}>HISTORICAL PATTERN</div>
              <p style={styles.boxText}>{selectedItem.historicalPattern}</p>
            </div>

            <div style={styles.detailBox}>
              <div style={{ ...styles.boxTag, color: 'var(--color-amber)' }}>OBSERVED HISTORICAL EVENTS</div>
              <p style={{ ...styles.boxText, fontWeight: '600', color: '#FFF' }}>{selectedItem.observedEvent}</p>
            </div>
          </div>

          {/* What We Can Learn Section */}
          <div style={styles.learnCard}>
            <div style={styles.learnHeader}>
              <CheckCircle2 size={20} color="var(--color-green)" />
              <h3 style={{ fontSize: '1.1rem', color: '#FFF' }}>What We Can Learn</h3>
            </div>
            <p style={styles.learnText}>{selectedItem.whatWeCanLearn}</p>

            <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Associated Satellite Variables:</span>
              {selectedItem.associatedVariables.map((v, i) => (
                <span key={i} className="badge badge-neutral">{v}</span>
              ))}
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
    color: 'var(--text-muted)',
    maxWidth: '780px'
  },
  disclaimerBanner: {
    padding: '20px 24px',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '30px',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  pipelineCard: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '30px'
  },
  chainRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px'
  },
  chainNode: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 18px',
    flex: 1,
    minWidth: '180px'
  },
  chainBadge: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: 'var(--color-cyan-glow)',
    color: 'var(--color-cyan)',
    fontSize: '0.75rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px'
  },
  chainTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#FFF'
  },
  chainSub: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  chainArrow: {
    fontSize: '1.2rem',
    color: 'var(--color-cyan)',
    fontWeight: '700'
  },
  tabRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '600',
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  tabBtnActive: {
    background: 'var(--color-cyan-glow)',
    color: '#FFF',
    borderColor: 'var(--color-cyan)'
  },
  detailCard: {
    padding: '30px',
    borderRadius: 'var(--radius-lg)'
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  detailTitle: {
    fontSize: '1.6rem',
    fontWeight: '800',
    marginTop: '6px'
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  detailBox: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '18px'
  },
  boxTag: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: 'var(--color-cyan)',
    letterSpacing: '0.04em',
    marginBottom: '8px'
  },
  boxText: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    lineHeight: 1.5
  },
  learnCard: {
    background: 'rgba(16, 185, 129, 0.06)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: 'var(--radius-md)',
    padding: '24px'
  },
  learnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px'
  },
  learnText: {
    fontSize: '0.95rem',
    color: '#F3F4F6',
    lineHeight: 1.6
  }
};
