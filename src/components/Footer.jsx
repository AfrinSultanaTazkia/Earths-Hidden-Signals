import React from 'react';
import { Globe, ShieldAlert, ExternalLink, Activity } from 'lucide-react';
import { NASA_DATA_SOURCES } from '../data/earthSignalsData';

export default function Footer({ setActiveTab }) {
  return (
    <footer style={styles.footer}>
      <div className="container">
        {/* Main Footer Row */}
        <div style={styles.grid}>
          {/* Brand & Mission */}
          <div style={styles.colMain}>
            <div style={styles.brand}>
              <div style={styles.logoIcon}>
                <Globe size={20} color="var(--color-cyan)" />
              </div>
              <span style={styles.brandTitle}>Earth's Hidden Signals</span>
            </div>
            <p style={styles.missionText}>
              One warming planet. Different environmental responses. Decoding 44 years of NASA Earth observation satellite records to transform signal detection into practical community preparedness across South Asia.
            </p>
            <div className="badge badge-cyan" style={{ marginTop: '12px' }}>
              <Activity size={12} />
              NASA Space Apps 2026 Presentation Model
            </div>
          </div>

          {/* Quick Navigation */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Platform Sections</h4>
            <ul style={styles.linkList}>
              <li><button style={styles.linkBtn} onClick={() => setActiveTab('home')}>Home Overview</button></li>
              <li><button style={styles.linkBtn} onClick={() => setActiveTab('explore')}>Signals & Trends Dashboard</button></li>
              <li><button style={styles.linkBtn} onClick={() => setActiveTab('explorelive')}>Real-Time Telemetry Feed</button></li>
              <li><button style={styles.linkBtn} onClick={() => setActiveTab('historical')}>Historical Evidence Engine</button></li>
              <li><button style={styles.linkBtn} onClick={() => setActiveTab('casestudies')}>Detailed Case Studies</button></li>
              <li><button style={styles.linkBtn} onClick={() => setActiveTab('preparedness')}>Preparedness Center</button></li>
              <li><button style={styles.linkBtn} onClick={() => setActiveTab('methodology')}>Science & Methodology</button></li>
            </ul>
          </div>

          {/* Data Attributions */}
          <div style={styles.col}>
            <h4 style={styles.colTitle}>Primary Datasets</h4>
            <ul style={styles.linkList}>
              {NASA_DATA_SOURCES.slice(0, 4).map((source, i) => (
                <li key={i}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" style={styles.externalLink}>
                    <span>{source.name}</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preparedness Disclaimer Banner */}
        <div style={styles.disclaimerBox} className="glass-panel">
          <ShieldAlert size={20} color="var(--color-amber)" style={{ flexShrink: 0 }} />
          <div style={styles.disclaimerContent}>
            <strong style={{ color: 'var(--color-amber)' }}>Core Identity & Scientific Disclaimer:</strong>
            <p style={{ marginTop: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Earth's Hidden Signals is an environmental intelligence and preparedness awareness platform built on satellite observations. 
              <strong> This system does not predict disasters.</strong> Historical environmental similarity does not guarantee future events. The primary purpose is to highlight risk-relevant trends and foster informed preparedness.
            </p>
          </div>
        </div>

        {/* Copyright Bottom Bar */}
        <div style={styles.bottomBar}>
          <div>© 2026 Earth's Hidden Signals. Built with NASA Earth Science Data Products.</div>
          <div style={{ color: 'var(--color-cyan)', fontSize: '0.85rem' }}>
            Preparedness, Not Prediction.
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#070A12',
    borderTop: '1px solid var(--border-subtle)',
    paddingTop: '60px',
    paddingBottom: '30px',
    marginTop: '80px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '40px',
    marginBottom: '40px'
  },
  colMain: {
    maxWidth: '460px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px'
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'var(--color-cyan-glow)',
    border: '1px solid var(--border-glow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#FFFFFF'
  },
  missionText: {
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6
  },
  col: {
    display: 'flex',
    flexDirection: 'column'
  },
  colTitle: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '16px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  linkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
    transition: 'color var(--transition-fast)'
  },
  externalLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--text-muted)',
    fontSize: '0.88rem',
    textDecoration: 'none',
    transition: 'color var(--transition-fast)'
  },
  disclaimerBox: {
    padding: '16px 20px',
    display: 'flex',
    gap: '14px',
    alignItems: 'flex-start',
    marginBottom: '30px',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  disclaimerContent: {
    flex: 1
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20px',
    borderTop: '1px solid var(--border-subtle)',
    fontSize: '0.82rem',
    color: 'var(--text-dim)',
    flexWrap: 'wrap',
    gap: '12px'
  }
};
