import React from 'react';
import { Globe, ShieldAlert, ExternalLink, Activity, Database, MapPin } from 'lucide-react';
import { NASA_DATA_SOURCES } from '../data/earthSignalsData';

export default function Footer({ setActiveTab, setSelectedRegionId }) {
  const navLinks = [
    { id: 'home',         label: 'Home Overview' },
    { id: 'explore',      label: 'Signals Dashboard' },
    { id: 'explorelive',  label: 'Live Telemetry' },
    { id: 'historical',   label: 'Historical Evidence' },
    { id: 'casestudies',  label: 'Case Studies' },
    { id: 'preparedness', label: 'Preparedness Center' },
    { id: 'methodology',  label: 'Science & Methodology' },
  ];

  const dataSources = NASA_DATA_SOURCES.slice(0, 5);

  return (
    <footer style={{
      background: '#0C2340',
      color: 'rgba(255,255,255,0.75)',
      marginTop: '48px',
      borderTop: '3px solid #1A5C4A',
    }}>
      {/* Main footer grid */}
      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '40px 24px 28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1.4fr',
          gap: '40px',
          marginBottom: '32px',
        }}>
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: 'rgba(74, 222, 128, 0.15)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Globe size={18} color="#4ADE80" />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1rem', fontWeight: '800', color: '#FFFFFF',
                }}>Earth's Hidden Signals</div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.45)', marginTop: '1px' }}>
                  NASA Space Apps 2026
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, marginBottom: '14px' }}>
              One warming planet. Different regional signals. Decoding NASA Earth observation
              satellite records to transform signal detection into practical community
              preparedness across South Asia.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: 'rgba(74, 222, 128, 0.12)', color: '#4ADE80',
                border: '1px solid rgba(74, 222, 128, 0.25)',
                borderRadius: '12px', padding: '3px 10px',
                fontSize: '0.66rem', fontWeight: '700',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                <Activity size={10} />
                NASA DATA INTEGRATION
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                background: 'rgba(8, 153, 196, 0.12)', color: '#38BDF8',
                border: '1px solid rgba(8, 153, 196, 0.25)',
                borderRadius: '12px', padding: '3px 10px',
                fontSize: '0.66rem', fontWeight: '700',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                <MapPin size={10} />
                SOUTH ASIA FOCUS
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{
              fontSize: '0.78rem', fontWeight: '700', color: '#FFFFFF',
              marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em',
              fontFamily: "'Outfit', sans-serif",
              borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px',
            }}>Platform Sections</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {navLinks.map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => setActiveTab(link.id)}
                    style={{
                      background: 'none', border: 'none',
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: '0.82rem', cursor: 'pointer',
                      textAlign: 'left', padding: 0,
                      transition: 'color 0.15s ease',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4ADE80'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Data sources */}
          <div>
            <h4 style={{
              fontSize: '0.78rem', fontWeight: '700', color: '#FFFFFF',
              marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em',
              fontFamily: "'Outfit', sans-serif",
              borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px',
            }}>Primary Datasets</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dataSources.map((source, i) => (
                <li key={i}>
                  <a
                    href={source.url} target="_blank" rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: '6px',
                      color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem',
                      textDecoration: 'none', transition: 'color 0.15s ease',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#4ADE80'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    <Database size={12} style={{ flexShrink: 0, marginTop: '2px', color: 'rgba(255,255,255,0.3)' }} />
                    <span>{source.name}</span>
                    <ExternalLink size={10} style={{ flexShrink: 0, marginTop: '3px', color: 'rgba(255,255,255,0.2)' }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scientific disclaimer */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderLeft: '3px solid #D97706',
          borderRadius: '8px', padding: '14px 18px',
          display: 'flex', gap: '12px', alignItems: 'flex-start',
          marginBottom: '24px',
        }}>
          <ShieldAlert size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '1px' }} />
          <div>
            <strong style={{ color: '#FBBF24', fontSize: '0.8rem' }}>Scientific Disclaimer & Platform Purpose</strong>
            <p style={{ marginTop: '4px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              Earth's Hidden Signals is an environmental intelligence and preparedness awareness platform built on
              NASA satellite observations and published peer-reviewed literature.{' '}
              <strong style={{ color: 'rgba(255,255,255,0.75)' }}>This system does not predict disasters.</strong>{' '}
              Historical environmental similarity does not guarantee future events. Statistical significance
              indicates a detectable monotonic trend — it does not imply causation or guarantee future outcomes.
              All trend data and p-values are documented estimates based on published regional studies.
              Always consult official national meteorological and emergency management authorities for operational decisions.
            </p>
          </div>
        </div>

        {/* Methodology row */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px', padding: '12px 18px',
          display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center',
          marginBottom: '24px',
        }}>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statistical Methods:</span>
          {['Mann–Kendall Trend Test', "Sen's Slope Estimator", 'Significance threshold p < 0.05', 'Study period 2001–2025'].map(m => (
            <span key={m} style={{
              fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)',
              background: 'rgba(255,255,255,0.06)', borderRadius: '4px',
              padding: '2px 8px', border: '1px solid rgba(255,255,255,0.1)',
            }}>{m}</span>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: '0.76rem', color: 'rgba(255,255,255,0.35)', flexWrap: 'wrap', gap: '10px',
        }}>
          <div>© 2026 Earth's Hidden Signals. Built with NASA Earth Science Data Products.</div>
          <div style={{ color: '#4ADE80', fontWeight: '600' }}>
            From NASA Earth Observations to Verified Trends &amp; Smarter Preparedness.
          </div>
        </div>
      </div>
    </footer>
  );
}
