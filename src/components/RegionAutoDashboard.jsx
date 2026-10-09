import React, { useState } from 'react';
import { REGIONS, GET_DETECTIVE_ANALYSIS } from '../data/earthSignalsData';
import SouthAsiaOverviewMap from './SouthAsiaOverviewMap';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Eye, 
  ShieldCheck, 
  ShieldAlert, 
  Activity,
  ChevronDown,
  ChevronUp,
  Sprout,
  Stethoscope,
  Ambulance,
  Home as HomeIcon,
  Layers,
  Search
} from 'lucide-react';

export default function RegionAutoDashboard({ initialRegionId = 'bangladesh' }) {
  const [selectedRegionId, setSelectedRegionId] = useState(initialRegionId);
  const [activeRoleTab, setActiveRoleTab] = useState('farmers');
  const [expandedVarId, setExpandedVarId] = useState(null);

  const detectiveData = GET_DETECTIVE_ANALYSIS(selectedRegionId);
  const currentRegion = detectiveData.region;
  const disaster = detectiveData.disasterDetails;
  const decision = detectiveData.decisionSupport;

  const toggleScientificMetrics = (id) => {
    setExpandedVarId(expandedVarId === id ? null : id);
  };

  return (
    <div style={styles.containerWrapper}>
      {/* 1. FLOWCHART HEADER */}
      <div style={styles.flowHeader}>
        <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
          <Sparkles size={12} />
          NASA EARTH SYSTEM TREND DETECTIVE
        </div>
        <h2 style={styles.mainTitle}>🔍 Earth System Trend Detective Flow</h2>
        <p style={styles.mainSubtitle}>
          Verifying 20+ years of NASA Earth observation data with statistical tests (Mann-Kendall & Sen's Slope) to deliver human-friendly preparedness advisories — <strong>without speculative prediction</strong>.
        </p>
      </div>

      {/* 2. REGION SELECTOR (WHERE IS IT CHANGING?) */}
      <div style={styles.stepSection}>
        <div style={styles.stepTitleRow}>
          <div style={styles.stepBadge}>STEP 1</div>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Select Region (Where is it changing?)</h3>
        </div>

        <div style={styles.regionGrid}>
          {REGIONS.map((r) => {
            const isSelected = r.id === selectedRegionId;
            return (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedRegionId(r.id);
                  setExpandedVarId(null);
                }}
                style={{
                  ...styles.regionCardBtn,
                  ...(isSelected ? styles.regionCardBtnActive : {})
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '1.8rem' }}>{r.flag}</span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>{r.disasterIcon} {r.disasterType}</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFF' }}>{r.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {r.disasterTitle}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Overview */}
      <div style={{ marginBottom: '30px' }}>
        <SouthAsiaOverviewMap
          selectedRegionId={selectedRegionId}
          onSelectRegion={(id) => {
            setSelectedRegionId(id);
            setExpandedVarId(null);
          }}
          variableId="rainfall"
        />
      </div>

      {/* 3. STEP 2 & 3: WHAT & HOW FAST IS CHANGING? (20+ YEARS TREND & STATISTICAL TEST) */}
      <div style={styles.stepSection}>
        <div style={styles.stepTitleRow}>
          <div style={styles.stepBadge}>STEP 2</div>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>
            20+ Years Trend & Statistical Test (What is changing? How fast?)
          </h3>
        </div>

        <div style={styles.variablesGrid}>
          {detectiveData.variablesAnalysis.map((v) => {
            const isExpanded = expandedVarId === v.id;
            return (
              <div key={v.id} style={styles.varCard} className="glass-panel">
                <div style={styles.varHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{v.symbol}</span>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFF' }}>{v.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.dataset.split('/')[0]}</div>
                    </div>
                  </div>

                  {/* Significance Badge (Explicitly flags No Significant Change) */}
                  <span className={`badge ${v.significanceBadge.class}`} style={{ fontSize: '0.75rem' }}>
                    <span>{v.significanceBadge.icon}</span>
                    <span>{v.significanceBadge.label}</span>
                  </span>
                </div>

                {/* What is changing text */}
                <div style={styles.changeBox}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                    WHAT IS CHANGING?
                  </div>
                  <div style={{ fontSize: '0.98rem', fontWeight: '700', color: v.isSignificant ? 'var(--color-cyan)' : 'var(--text-muted)', marginTop: '2px' }}>
                    {v.whatIsChanging}
                  </div>
                </div>

                {/* How fast rate */}
                <div style={styles.rateRow}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>How fast is it changing?</span>
                  <span className="mono" style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFF' }}>
                    {v.howFastRate}
                  </span>
                </div>

                {/* Human friendly summary */}
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '8px 0', lineHeight: 1.4 }}>
                  “{v.simpleMeaning}”
                </p>

                {/* Toggle Scientific Test Button */}
                <button
                  onClick={() => toggleScientificMetrics(v.id)}
                  style={styles.sciToggleBtn}
                >
                  <span>{isExpanded ? 'Hide Statistical Test Results' : 'Show Statistical Test (Mann-Kendall & Sen’s Slope)'}</span>
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>

                {/* Test Results Drawer */}
                {isExpanded && (
                  <div style={styles.sciDrawer}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-amber)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Mann-Kendall & Sen's Slope Results
                    </div>
                    <div style={styles.sciGrid}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Mann-Kendall Test:</span>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFF' }} className="mono">{v.mannKendallZ}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sen's Slope:</span>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFF' }} className="mono">{v.sensSlope}</div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>p-Value:</span>
                        <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFF' }} className="mono">{v.pValue}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. STEP 3: SAME VARIABLE SHIFTS → REGIONAL DISASTER STRESS */}
      <div style={styles.stepSection}>
        <div style={styles.stepTitleRow}>
          <div style={styles.stepBadge}>STEP 3</div>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Regional Disaster Stress Connection</h3>
        </div>

        <div style={styles.disasterCard} className="glass-panel glass-panel-glow">
          <div style={styles.disasterHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2.2rem' }}>{disaster.icon}</span>
              <div>
                <span className="badge badge-amber">{currentRegion.flag} {currentRegion.name} Specific Stress</span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFF', marginTop: '4px' }}>
                  {disaster.regionalHeadline}
                </h3>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '16px' }}>
            {disaster.explanation}
          </p>

          <div style={styles.sameVarBanner}>
            💡 <strong>Core Detective Finding:</strong> Same global warming variable shifts across the planet, but because of topography and hydrology, <strong>{currentRegion.name}</strong> experiences <strong>{disaster.disasterName}</strong> stress.
          </div>
        </div>
      </div>

      {/* 5. STEP 4: PRESENT DATA VS HISTORICAL HIGH-RISK PATTERN COMPARISON */}
      <div style={styles.stepSection}>
        <div style={styles.stepTitleRow}>
          <div style={styles.stepBadge}>STEP 4</div>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Historical Pattern Comparison</h3>
        </div>

        <div style={styles.historicalCard} className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-cyan)', textTransform: 'uppercase' }}>
                HISTORICAL EVIDENCE ENGINE
              </span>
              <h4 style={{ fontSize: '1.15rem', color: '#FFF', marginTop: '2px' }}>
                Comparing Updated NASA Satellite Data with {disaster.historicalMatch}
              </h4>
            </div>
            <span className="badge badge-green">Pattern Matching</span>
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
            Current multi-decadal rainfall, surface temperature, and soil moisture trajectories match background environmental patterns observed prior to historic stress periods in {currentRegion.name}.
          </p>

          <div style={styles.disclaimerNote}>
            <ShieldAlert size={18} color="var(--color-amber)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Non-Speculative Disclaimer:</strong> We do not make speculative disaster predictions. Historical pattern comparison is used strictly to identify environmental conditions that deserve closer attention and early preparedness.
            </span>
          </div>
        </div>
      </div>

      {/* 6. STEP 5: THE 3 CORE ANSWERS & DECISION SUPPORT */}
      <div style={styles.stepSection}>
        <div style={styles.stepTitleRow}>
          <div style={styles.stepBadge}>STEP 5</div>
          <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>Decision Support & Actionable Preparedness</h3>
        </div>

        {/* Role Selector Tabs (Farmers, Health Workers, Responders, Citizens) */}
        <div style={styles.roleTabsRow}>
          {[
            { id: 'farmers', label: 'Farmers & Agriculture', icon: '🌾' },
            { id: 'healthWorkers', label: 'Health Workers', icon: '🏥' },
            { id: 'responders', label: 'Emergency Responders', icon: '🚑' },
            { id: 'citizens', label: 'Citizens & Families', icon: '🏠' }
          ].map((r) => {
            const isActive = activeRoleTab === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setActiveRoleTab(r.id)}
                style={{
                  ...styles.roleTabBtn,
                  ...(isActive ? styles.roleTabBtnActive : {})
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{r.icon}</span>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Role Decision Support Box */}
        {(() => {
          const roleData = decision[activeRoleTab] || decision.farmers;
          return (
            <div style={styles.decisionCard} className="glass-panel glass-panel-glow">
              <div style={styles.decisionHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{roleData.icon}</span>
                  <div>
                    <span className="badge badge-green">ACTIONABLE ADVISORY FOR {currentRegion.name.toUpperCase()}</span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#FFF', marginTop: '2px' }}>
                      {roleData.role}
                    </h3>
                  </div>
                </div>
              </div>

              <div style={styles.threeAnswersGrid}>
                {/* 1. What could this mean? */}
                <div style={styles.answerBox}>
                  <div style={styles.ansTag}>1. WHAT COULD THIS MEAN?</div>
                  <p style={styles.ansText}>{roleData.whatThisMeans}</p>
                </div>

                {/* 2. What should be monitored / prepared for? */}
                <div style={styles.answerBox}>
                  <div style={styles.ansTag}>2. WHAT SHOULD BE MONITORED / PREPARED FOR?</div>
                  <p style={styles.ansText}>{roleData.whatToMonitor}</p>
                </div>

                {/* 3. Decision Support / Preparedness Actions */}
                <div style={{ ...styles.answerBox, borderLeftColor: 'var(--color-green)' }}>
                  <div style={{ ...styles.ansTag, color: 'var(--color-green)' }}>3. ACTIONABLE PREPAREDNESS ADVISORIES</div>
                  <ul style={styles.actionList}>
                    {roleData.actions.map((act, idx) => (
                      <li key={idx} style={styles.actionItem}>
                        <span style={{ color: 'var(--color-green)', fontWeight: '700' }}>✓</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

const styles = {
  containerWrapper: {
    padding: '20px 0'
  },
  flowHeader: {
    textAlign: 'center',
    maxWidth: '740px',
    margin: '0 auto 30px auto'
  },
  mainTitle: {
    fontSize: '2.3rem',
    fontWeight: '800',
    marginBottom: '8px'
  },
  mainSubtitle: {
    fontSize: '1.05rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6
  },
  stepSection: {
    marginBottom: '36px'
  },
  stepTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  stepBadge: {
    background: 'var(--color-cyan-glow)',
    border: '1px solid var(--color-cyan)',
    color: 'var(--color-cyan)',
    fontSize: '0.75rem',
    fontWeight: '800',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontFamily: 'var(--font-mono)'
  },
  regionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
  },
  regionCardBtn: {
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '16px',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  regionCardBtnActive: {
    background: 'var(--color-cyan-glow)',
    borderColor: 'var(--color-cyan)',
    boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)'
  },
  variablesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px'
  },
  varCard: {
    padding: '20px',
    borderRadius: 'var(--radius-md)'
  },
  varHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    flexWrap: 'wrap',
    gap: '8px'
  },
  changeBox: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-subtle)',
    borderRadius: '6px',
    padding: '10px 12px',
    marginBottom: '10px'
  },
  rateRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '6px',
    borderTop: '1px solid var(--border-subtle)',
    marginBottom: '6px'
  },
  sciToggleBtn: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'transparent',
    border: 'none',
    color: 'var(--color-cyan)',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '6px 0',
    marginTop: '4px'
  },
  sciDrawer: {
    marginTop: '8px',
    background: '#070A12',
    border: '1px solid var(--border-subtle)',
    borderRadius: '6px',
    padding: '10px'
  },
  sciGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px'
  },
  disasterCard: {
    padding: '28px',
    borderRadius: 'var(--radius-lg)'
  },
  disasterHeader: {
    marginBottom: '16px'
  },
  sameVarBanner: {
    background: 'rgba(6, 182, 212, 0.1)',
    borderLeft: '4px solid var(--color-cyan)',
    padding: '12px 18px',
    borderRadius: '0 8px 8px 0',
    fontSize: '0.95rem',
    color: '#FFFFFF'
  },
  historicalCard: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)'
  },
  disclaimerNote: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    background: 'rgba(245, 158, 11, 0.06)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '0.85rem',
    color: 'var(--text-muted)'
  },
  roleTabsRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  roleTabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-muted)',
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  roleTabBtnActive: {
    background: 'var(--color-green-glow)',
    color: '#FFF',
    borderColor: 'var(--color-green)',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.25)'
  },
  decisionCard: {
    padding: '30px',
    borderRadius: 'var(--radius-lg)'
  },
  decisionHeader: {
    marginBottom: '24px',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: '16px'
  },
  threeAnswersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },
  answerBox: {
    background: 'rgba(0,0,0,0.3)',
    borderLeft: '3px solid var(--color-cyan)',
    borderRadius: '0 8px 8px 0',
    padding: '18px'
  },
  ansTag: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--color-cyan)',
    letterSpacing: '0.04em',
    marginBottom: '8px'
  },
  ansText: {
    fontSize: '0.92rem',
    color: 'var(--text-main)',
    lineHeight: 1.6
  },
  actionList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  actionItem: {
    display: 'flex',
    gap: '10px',
    fontSize: '0.88rem',
    color: 'var(--text-main)',
    lineHeight: 1.5
  }
};
