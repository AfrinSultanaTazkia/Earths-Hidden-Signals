import React, { useState } from 'react';
import { PREPAREDNESS_ROLES, GET_PREPAREDNESS_GUIDE, REGIONS, VARIABLES } from '../data/earthSignalsData';
import { ShieldCheck, Eye, CheckCircle2, User, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export default function PreparednessCenter({ selectedRegionId, setSelectedRegionId }) {
  const [activeMode, setActiveMode] = useState('sectors'); // 'sectors' | 'roles'
  const [selectedSector, setSelectedSector] = useState('agriculture');
  const [selectedRoleId, setSelectedRoleId] = useState('community');
  const [selectedLocation, setSelectedLocation] = useState(selectedRegionId || 'bangladesh');
  const [selectedSignalVar, setSelectedSignalVar] = useState('rainfall');

  const guide = GET_PREPAREDNESS_GUIDE(selectedRoleId, selectedSignalVar);
  const selectedRoleObj = PREPAREDNESS_ROLES.find(r => r.id === selectedRoleId) || PREPAREDNESS_ROLES[0];
  const selectedRegionObj = REGIONS.find(r => r.id === selectedLocation) || REGIONS[0];
  const selectedVarObj = VARIABLES.find(v => v.id === selectedSignalVar) || VARIABLES[0];

  const sectorData = {
    agriculture: {
      id: 'agriculture',
      title: 'Agriculture & Water',
      icon: '🌾',
      color: '#37D6A3',
      monitoring: [
        'Multi-week root-zone soil saturation (SMAP L4) before sowing windows',
        'Seasonal precipitation anomalies (GPM IMERG) vs. historical crop baselines',
        'Surface irrigation reservoir storage levels during pre-monsoon heat spells'
      ],
      actions: [
        'Shift crop planting calendars according to verified moisture departure vectors',
        'Introduce flood-tolerant paddy varieties (e.g. Sub1) in high-risk deltaic tracts',
        'Enhance on-farm rainwater harvesting and micro-drip irrigation in arid river corridors',
        'Pre-clean agricultural drainage channels ahead of peak monsoon months'
      ]
    },
    community: {
      id: 'community',
      title: 'Community Preparedness',
      icon: '🏘️',
      color: '#55D6FF',
      monitoring: [
        'Local municipal warning systems and official government meteorological advisories',
        'Antecedent rainfall accumulation thresholds (>100 mm in 48 hours)',
        'Local water level gauges along key river embankments and culverts'
      ],
      actions: [
        'Store dry food reserves, essential medications, and clean potable water tablets',
        'Map safe high-ground evacuation shelters with community volunteers and families',
        'Protect personal identity documents and valuables in waterproof containers',
        'Maintain emergency solar lanterns and battery-powered communication radios'
      ]
    },
    logistics: {
      id: 'logistics',
      title: 'Logistics & Relief',
      icon: '🚚',
      color: '#FFBF69',
      monitoring: [
        'Highway and railway corridor slope stability indices along mountain transit corridors',
        'Deltaic river ferry crossing safety thresholds during heightened river surges',
        'Regional warehouse supply levels for water purification kits and mobile pumps'
      ],
      actions: [
        'Pre-position emergency inflatable rescue boats and fuel in strategic haor/delta hubs',
        'Establish backup supply chains bypassing flood-vulnerable trunk highways',
        'Coordinate inter-agency relief transport routes before monsoon peaks',
        'Conduct joint simulation drills with local emergency dispatch services'
      ]
    },
    health: {
      id: 'health',
      title: 'Health & Exposure',
      icon: '🏥',
      color: '#FF647C',
      monitoring: [
        'Consecutive days with wet-bulb heat index departures above regional 95th percentiles',
        'Post-monsoon stagnant surface water pooling for vector-borne disease surveillance',
        'Drinking water source contamination indicators in low-lying groundwater wells'
      ],
      actions: [
        'Stock oral rehydration solutions (ORS), cholera treatment kits, and antivenom serums',
        'Establish cool-zone hydration stations in urban agricultural markets during heatwaves',
        'Chlorinate and test tubewells following high-tide or river surge inundation',
        'Mobilize community healthcare volunteers for door-to-door early fever tracking'
      ]
    },
    infrastructure: {
      id: 'infrastructure',
      title: 'Infrastructure & Ecosystems',
      icon: '🏗️',
      color: '#818CF8',
      monitoring: [
        'Culvert, embankment, and drainage sluice siltation levels prior to wet season',
        'Mountain slope toe erosion along high-traffic hill roads and hydro installations',
        'Forest canopy greenness index (NDVI) deficits during dry pre-monsoon heat'
      ],
      actions: [
        'Reinforce vulnerable earthen embankment revetments with geotextile and vetiver grass',
        'Perform scheduled desilting of municipal stormwater outfalls and culvert drains',
        'Create firebreak buffer strips in dry deciduous forest tracts during thermal peaks',
        'Install slope runoff diversion trenches above residential mountain settlements'
      ]
    }
  };

  return (
    <div style={{ paddingTop: '30px', paddingBottom: '70px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div className="badge badge-green" style={{ marginBottom: '8px' }}>
            <ShieldCheck size={12} />
            ACTIONABLE PREPAREDNESS INTELLIGENCE
          </div>
          <h1 style={styles.pageTitle}>Evidence-Based Preparedness Guidance</h1>
          <p style={styles.pageSub}>
            Translating NASA Earth observation signals and historical trends into sector-specific and role-tailored preparedness recommendations across South Asia.
          </p>
        </div>

        {/* Mode Selector Tabs (5 Public Value Sectors vs Role Matrix) */}
        <div style={styles.modeTabsRow}>
          <button
            onClick={() => setActiveMode('sectors')}
            style={{
              ...styles.modeTabBtn,
              ...(activeMode === 'sectors' ? styles.modeTabBtnActive : {})
            }}
          >
            🏢 5 Core Public Value Sectors
          </button>
          <button
            onClick={() => setActiveMode('roles')}
            style={{
              ...styles.modeTabBtn,
              ...(activeMode === 'roles' ? styles.modeTabBtnActive : {})
            }}
          >
            👤 Individual & Community Role Matrix
          </button>
        </div>

        {/* SECTORS VIEW */}
        {activeMode === 'sectors' && (
          <div>
            {/* Sector Picker Buttons */}
            <div style={styles.sectorPickerRow}>
              {Object.values(sectorData).map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  style={{
                    ...styles.sectorBtn,
                    ...(selectedSector === sec.id ? { ...styles.sectorBtnActive, borderColor: sec.color, color: '#FFF' } : {})
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{sec.icon}</span>
                  <span style={{ fontWeight: '700' }}>{sec.title}</span>
                </button>
              ))}
            </div>

            {/* Selected Sector Panel */}
            {(() => {
              const currentSec = sectorData[selectedSector];
              return (
                <div style={styles.outputCard} className="glass-panel glass-panel-glow">
                  <div style={styles.outputHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ ...styles.roleIconBox, background: `${currentSec.color}18`, borderColor: currentSec.color }}>
                        <span style={{ fontSize: '1.8rem' }}>{currentSec.icon}</span>
                      </div>
                      <div>
                        <span className="badge" style={{ background: `${currentSec.color}15`, color: currentSec.color, border: `1px solid ${currentSec.color}40` }}>
                          PUBLIC VALUE SECTOR GUIDELINE
                        </span>
                        <h2 style={styles.roleTitle}>{currentSec.title}</h2>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className="badge badge-cyan">Regional Application: South Asia</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Focus: <strong>{selectedRegionObj.name}</strong> ({selectedVarObj.name})
                      </div>
                    </div>
                  </div>

                  {/* Two Action Columns: MONITOR vs PREPARE */}
                  <div style={styles.twoColGrid}>
                    {/* What to Monitor Column */}
                    <div style={styles.colBox}>
                      <div style={styles.colTitleRow}>
                        <Eye size={20} color="var(--color-cyan)" />
                        <h3 style={{ fontSize: '1.1rem', color: '#FFF' }}>1. What Should Be Monitored?</h3>
                      </div>
                      <p style={styles.colSubtext}>
                        Key environmental indicators, satellite metrics, and localized thresholds:
                      </p>
                      <ul style={styles.actionList}>
                        {currentSec.monitoring.map((item, idx) => (
                          <li key={idx} style={styles.actionItem}>
                            <span className="badge badge-cyan" style={{ height: '22px' }}>MONITOR</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* What to Prepare Column */}
                    <div style={styles.colBox}>
                      <div style={styles.colTitleRow}>
                        <ShieldCheck size={20} color={currentSec.color} />
                        <h3 style={{ fontSize: '1.1rem', color: '#FFF' }}>2. How to Prepare?</h3>
                      </div>
                      <p style={styles.colSubtext}>
                        Evidence-based actions to protect livelihoods, health, and infrastructure:
                      </p>
                      <ul style={styles.actionList}>
                        {currentSec.actions.map((item, idx) => (
                          <li key={idx} style={styles.actionItem}>
                            <span className="badge" style={{ height: '22px', background: `${currentSec.color}20`, color: currentSec.color, border: `1px solid ${currentSec.color}40` }}>
                              PREPARE
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Scientific Guidance Note */}
                  <div style={styles.predictionDisclaimer}>
                    <AlertCircle size={16} color="var(--color-amber)" style={{ flexShrink: 0 }} />
                    <span>
                      <strong>Important Guidance:</strong> These preparedness suggestions complement—and do not replace—official emergency warnings, evacuation orders, or meteorological guidance issued by national and local authorities.
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ROLE-BASED VIEW */}
        {activeMode === 'roles' && (
          <div>
            {/* Interactive Selector Toolbar */}
            <div style={styles.selectorCard} className="glass-panel">
              <div style={styles.selectorGrid}>
                {/* 1. Location Selector */}
                <div style={styles.selGroup}>
                  <label style={styles.selLabel}>1. Select Location</label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => {
                      setSelectedLocation(e.target.value);
                      if (setSelectedRegionId) setSelectedRegionId(e.target.value);
                    }}
                    style={styles.selectBox}
                    aria-label="Select Target Location"
                  >
                    {REGIONS.map(r => (
                      <option key={r.id} value={r.id}>{r.flag} {r.name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Environmental Signal Variable */}
                <div style={styles.selGroup}>
                  <label style={styles.selLabel}>2. Select Observed Environmental Signal</label>
                  <select
                    value={selectedSignalVar}
                    onChange={(e) => setSelectedSignalVar(e.target.value)}
                    style={styles.selectBox}
                    aria-label="Select Environmental Signal"
                  >
                    {VARIABLES.map(v => (
                      <option key={v.id} value={v.id}>{v.symbol} {v.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3. User Role Selector */}
                <div style={styles.selGroup}>
                  <label style={styles.selLabel}>3. Select Your Role</label>
                  <select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    style={styles.selectBox}
                    aria-label="Select Target Role"
                  >
                    {PREPAREDNESS_ROLES.map(role => (
                      <option key={role.id} value={role.id}>{role.icon} {role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Role Quick Selector Cards */}
            <div style={styles.rolesRow}>
              {PREPAREDNESS_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  style={{
                    ...styles.roleBtn,
                    ...(selectedRoleId === role.id ? styles.roleBtnActive : {})
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{role.icon}</span>
                  <span style={{ fontSize: '0.82rem' }}>{role.name.split('/')[0]}</span>
                </button>
              ))}
            </div>

            {/* Preparedness Output Panel */}
            <div style={styles.outputCard} className="glass-panel glass-panel-glow">
              {/* Header Banner */}
              <div style={styles.outputHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={styles.roleIconBox}>
                    <span style={{ fontSize: '1.8rem' }}>{selectedRoleObj.icon}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-green)', fontWeight: '700', textTransform: 'uppercase' }}>
                      PREPAREDNESS MATRIX FOR {selectedRegionObj.name.toUpperCase()}
                    </div>
                    <h2 style={styles.roleTitle}>If You Are a {selectedRoleObj.name}</h2>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="badge badge-cyan">{selectedVarObj.symbol} {selectedVarObj.name} Signal</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Location: <strong>{selectedRegionObj.name}</strong>
                  </div>
                </div>
              </div>

              {/* Two Action Columns: MONITOR vs PREPARE */}
              <div style={styles.twoColGrid}>
                {/* What to Monitor Column */}
                <div style={styles.colBox}>
                  <div style={styles.colTitleRow}>
                    <Eye size={20} color="var(--color-cyan)" />
                    <h3 style={{ fontSize: '1.1rem', color: '#FFF' }}>1. What to Monitor</h3>
                  </div>
                  <p style={styles.colSubtext}>
                    Key environmental indicators, early warnings, and localized measurements to observe:
                  </p>
                  <ul style={styles.actionList}>
                    {guide.monitor.map((item, idx) => (
                      <li key={idx} style={styles.actionItem}>
                        <span className="badge badge-cyan" style={{ height: '22px' }}>MONITOR</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* What to Prepare Column */}
                <div style={styles.colBox}>
                  <div style={styles.colTitleRow}>
                    <ShieldCheck size={20} color="var(--color-green)" />
                    <h3 style={{ fontSize: '1.1rem', color: '#FFF' }}>2. How to Prepare</h3>
                  </div>
                  <p style={styles.colSubtext}>
                    Practical, actionable steps to enhance individual, agricultural, and community resilience:
                  </p>
                  <ul style={styles.actionList}>
                    {guide.prepare.map((item, idx) => (
                      <li key={idx} style={styles.actionItem}>
                        <span className="badge badge-green" style={{ height: '22px' }}>PREPARE</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Re-enforce Prediction Disclaimer */}
              <div style={styles.predictionDisclaimer}>
                <AlertCircle size={16} color="var(--color-amber)" style={{ flexShrink: 0 }} />
                <span>
                  <strong>Preparedness, Not Prediction:</strong> This page provides preparedness guidance based on multi-decadal environmental trends. It is designed to complement official weather warnings and local civil defense instructions.
                </span>
              </div>
            </div>
          </div>
        )}
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
  modeTabsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  modeTabBtn: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    fontWeight: '700',
    padding: '10px 18px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  modeTabBtnActive: {
    background: 'rgba(55, 214, 163, 0.15)',
    color: '#37D6A3',
    borderColor: '#37D6A3',
    boxShadow: '0 0 12px rgba(55, 214, 163, 0.2)',
  },
  sectorPickerRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginBottom: '28px',
  },
  sectorBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(13, 21, 39, 0.6)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-muted)',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  sectorBtnActive: {
    background: 'rgba(17, 29, 50, 0.95)',
    boxShadow: '0 0 16px rgba(85, 214, 255, 0.12)',
  },
  selectorCard: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)',
    marginBottom: '20px'
  },
  selectorGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px'
  },
  selGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  selLabel: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  selectBox: {
    background: '#070A12',
    border: '1px solid var(--border-subtle)',
    color: '#FFF',
    fontSize: '0.9rem',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    fontFamily: 'var(--font-sans)'
  },
  rolesRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '30px',
    overflowX: 'auto',
    paddingBottom: '8px'
  },
  roleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-muted)',
    padding: '8px 14px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s'
  },
  roleBtnActive: {
    background: 'var(--color-green-glow)',
    color: '#FFF',
    borderColor: 'var(--color-green)'
  },
  outputCard: {
    padding: '30px',
    borderRadius: 'var(--radius-lg)'
  },
  outputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid var(--border-subtle)',
    paddingBottom: '20px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  roleIconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'var(--color-green-glow)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  roleTitle: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#FFF'
  },
  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px'
  },
  colBox: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '20px'
  },
  colTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px'
  },
  colSubtext: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    marginBottom: '16px'
  },
  actionList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  actionItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    fontSize: '0.9rem',
    color: 'var(--text-main)',
    lineHeight: 1.5
  },
  predictionDisclaimer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    background: 'rgba(245, 158, 11, 0.05)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: '8px',
    padding: '10px 14px'
  }
};
