import React, { useState } from 'react';
import { PREPAREDNESS_ROLES, GET_PREPAREDNESS_GUIDE, REGIONS, VARIABLES } from '../data/earthSignalsData';
import { ShieldCheck, Eye, CheckCircle2, User, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export default function PreparednessCenter({ selectedRegionId }) {
  const [selectedRoleId, setSelectedRoleId] = useState('community');
  const [selectedLocation, setSelectedLocation] = useState(selectedRegionId || 'bangladesh');
  const [selectedSignalVar, setSelectedSignalVar] = useState('rainfall');

  const guide = GET_PREPAREDNESS_GUIDE(selectedRoleId, selectedSignalVar);
  const selectedRoleObj = PREPAREDNESS_ROLES.find(r => r.id === selectedRoleId) || PREPAREDNESS_ROLES[0];
  const selectedRegionObj = REGIONS.find(r => r.id === selectedLocation) || REGIONS[0];
  const selectedVarObj = VARIABLES.find(v => v.id === selectedSignalVar) || VARIABLES[0];

  return (
    <div style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div className="badge badge-green" style={{ marginBottom: '8px' }}>
            <ShieldCheck size={12} />
            ACTIONABLE PREPAREDNESS TOOL
          </div>
          <h1 style={styles.pageTitle}>From Signals to Preparedness</h1>
          <p style={styles.pageSub}>
            Generate tailored preparedness guidelines based on long-term environmental signal observations, location, and your specific role in the community.
          </p>
        </div>

        {/* Interactive Selector Toolbar */}
        <div style={styles.selectorCard} className="glass-panel">
          <div style={styles.selectorGrid}>
            {/* 1. Location Selector */}
            <div style={styles.selGroup}>
              <label style={styles.selLabel}>1. Select Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={styles.selectBox}
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
              <strong>Core Identity Reminder:</strong> This page provides preparedness information based on long-term environmental trends. <strong>It does not predict specific disasters.</strong>
            </span>
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
