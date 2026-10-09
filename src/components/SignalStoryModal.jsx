import React, { useState } from 'react';
import { SIGNAL_STORY_STEPS } from '../data/earthSignalsData';
import { Play, Pause, ChevronRight, ChevronLeft, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';

export default function SignalStoryModal({ onClose }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = SIGNAL_STORY_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < SIGNAL_STORY_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCurrentStepIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent} className="glass-panel glass-panel-glow">
        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={20} color="var(--color-cyan)" />
            <h2 style={{ fontSize: '1.25rem', color: '#FFF' }}>Signal Story: Decadal Environmental Shift</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        {/* Timeline Navigation Dots */}
        <div style={styles.timelineBar}>
          {SIGNAL_STORY_STEPS.map((s, idx) => {
            const isActive = idx === currentStepIndex;
            const isPast = idx < currentStepIndex;
            return (
              <div
                key={s.year}
                onClick={() => setCurrentStepIndex(idx)}
                style={{
                  ...styles.timelineDotItem,
                  cursor: 'pointer'
                }}
              >
                <div
                  style={{
                    ...styles.timelineDot,
                    background: isActive ? 'var(--color-cyan)' : isPast ? 'var(--color-green)' : 'rgba(255,255,255,0.2)',
                    borderColor: isActive ? '#FFFFFF' : 'transparent',
                    boxShadow: isActive ? '0 0 12px var(--color-cyan)' : 'none'
                  }}
                />
                <div style={{ fontSize: '0.78rem', color: isActive ? '#FFF' : 'var(--text-muted)', fontWeight: isActive ? '700' : '400', marginTop: '4px' }}>
                  {s.year}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Card Visual */}
        <div style={styles.storyCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="badge badge-cyan">{step.badge}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Step {currentStepIndex + 1} of {SIGNAL_STORY_STEPS.length}
            </span>
          </div>

          <h3 style={styles.storyTitle}>{step.year}: {step.title}</h3>
          <div style={styles.storySubtitle}>{step.subtitle}</div>
          <p style={styles.storyDesc}>{step.description}</p>

          <div style={styles.metricHighlightBox}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{step.metricLabel}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-cyan)' }} className="mono">
              {step.metricValue}
            </div>
          </div>
        </div>

        {/* Core Questions Matrix Footer */}
        <div style={styles.questionsGrid}>
          <div style={styles.qBox}>
            <div style={styles.qTitle}>WHAT CHANGED?</div>
            <div style={styles.qText}>Long-term precipitation & thermal baseline trajectory across South Asia.</div>
          </div>
          <div style={styles.qBox}>
            <div style={styles.qTitle}>IS IT SIGNIFICANT?</div>
            <div style={styles.qText}>Mann-Kendall Z-score confirms monotonic shift (p &lt; 0.05).</div>
          </div>
          <div style={styles.qBox}>
            <div style={styles.qTitle}>WHAT TO MONITOR?</div>
            <div style={styles.qText}>Soil moisture saturation, river crest levels, and canopy dry spells.</div>
          </div>
        </div>

        {/* Footer Navigation Controls */}
        <div style={styles.controlsRow}>
          <button onClick={handlePrev} disabled={currentStepIndex === 0} className="btn-secondary" style={{ opacity: currentStepIndex === 0 ? 0.5 : 1 }}>
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Timeline: <strong>1981 to 2025 Observation Window</strong>
          </div>

          <button onClick={handleNext} className="btn-primary">
            <span>{currentStepIndex === SIGNAL_STORY_STEPS.length - 1 ? 'Replay Story' : 'Next Era'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.85)',
    backdropFilter: 'blur(8px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  modalContent: {
    maxWidth: '720px',
    width: '100%',
    padding: '30px',
    borderRadius: 'var(--radius-lg)',
    borderColor: 'var(--border-glow)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.2rem',
    cursor: 'pointer'
  },
  timelineBar: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    marginBottom: '24px',
    padding: '0 20px'
  },
  timelineDotItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 1
  },
  timelineDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    transition: 'all 0.3s'
  },
  storyCard: {
    background: '#070A12',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '24px',
    marginBottom: '20px'
  },
  storyTitle: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: '4px'
  },
  storySubtitle: {
    fontSize: '0.85rem',
    color: 'var(--color-cyan)',
    fontWeight: '600',
    marginBottom: '12px'
  },
  storyDesc: {
    fontSize: '0.92rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6,
    marginBottom: '16px'
  },
  metricHighlightBox: {
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  questionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px'
  },
  qBox: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '8px',
    padding: '10px 12px'
  },
  qTitle: {
    fontSize: '0.7rem',
    fontWeight: '700',
    color: 'var(--color-amber)',
    letterSpacing: '0.04em'
  },
  qText: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    marginTop: '4px',
    lineHeight: 1.3
  },
  controlsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
};
