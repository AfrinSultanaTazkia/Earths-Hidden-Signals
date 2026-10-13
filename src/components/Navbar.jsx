import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, Satellite, Activity, Wifi, AlertCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { id: 'home',         label: 'Home' },
    { id: 'explore',      label: 'Signals Dashboard' },
    { id: 'explorelive',  label: 'Live Telemetry', badge: 'LIVE' },
    { id: 'historical',   label: 'Historical Evidence' },
    { id: 'casestudies',  label: 'Case Studies' },
    { id: 'preparedness', label: 'Preparedness' },
    { id: 'methodology',  label: 'Methodology' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fmtTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', timeZone: 'UTC', hour12: false
  });

  return (
    <header role="banner" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* ── TOP HEADER BAR — dark navy/teal gradient ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0C2340 0%, #0D3D50 60%, #0A3D4A 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.28)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '58px',
          padding: '0 20px',
          maxWidth: '1320px',
          margin: '0 auto',
          gap: '16px',
        }}>
          {/* Brand */}
          <button
            onClick={() => handleNavClick('home')}
            aria-label="Earth's Hidden Signals — Go to Home"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              background: 'transparent', border: 'none', cursor: 'pointer',
              textAlign: 'left', padding: 0, flexShrink: 0,
            }}
          >
            <div style={{
              width: '40px', height: '40px', borderRadius: '9px',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Globe size={20} color="#4ADE80" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.0rem', fontWeight: '800',
                  color: '#FFFFFF', letterSpacing: '-0.01em', lineHeight: 1.2,
                }}>Earth's Hidden Signals</span>
                <span style={{
                  fontSize: '0.6rem', fontWeight: '700',
                  color: '#4ADE80',
                  fontFamily: "'JetBrains Mono', monospace",
                  background: 'rgba(74, 222, 128, 0.15)',
                  padding: '1px 6px', borderRadius: '3px',
                  border: '1px solid rgba(74, 222, 128, 0.3)',
                  letterSpacing: '0.04em',
                }}>NASA APPS</span>
              </div>
              <span style={{
                fontSize: '0.63rem', color: 'rgba(255,255,255,0.6)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: '400', letterSpacing: '0.01em',
              }}>South Asia Environmental Intelligence</span>
            </div>
          </button>

          {/* Status indicators */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            marginLeft: 'auto', flexShrink: 0,
          }}>
            {/* Data feed status */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px', padding: '4px 10px',
              fontSize: '0.67rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(255,255,255,0.75)',
            }}>
              <span style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: '#4ADE80', boxShadow: '0 0 5px #4ADE80',
                animation: 'pulse-dot 2s ease-in-out infinite',
                flexShrink: 0,
              }} />
              <span>DATA ACTIVE</span>
            </div>

            {/* UTC Clock */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px', padding: '4px 10px',
              fontSize: '0.67rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(255,255,255,0.75)',
            }}>
              <Activity size={10} color="rgba(255,255,255,0.5)" />
              <span>UTC {fmtTime}</span>
            </div>

            {/* Satellite indicator */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px', padding: '4px 10px',
              fontSize: '0.67rem',
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(255,255,255,0.75)',
            }}>
              <Satellite size={10} color="rgba(255,255,255,0.5)" />
              <span>4 REGIONS</span>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              style={{
                display: 'none',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '6px',
                color: '#FFFFFF', cursor: 'pointer',
                padding: '6px 8px',
              }}
              className="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── NAVIGATION BAR — green/teal ── */}
      <div style={{
        background: '#1A5C4A',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '0 20px',
          height: '40px',
          gap: '2px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id ||
              (item.id === 'explore' && activeTab === 'trends') ||
              (item.id === 'historical' && activeTab === 'evidence') ||
              (item.id === 'methodology' && activeTab === 'science');
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '7px 13px', height: '100%',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.78rem', fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#FFFFFF' : '#C8F0E4',
                  background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.12s ease',
                  borderRadius: '4px',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '3px',
                    background: '#4ADE80', color: '#0C2340',
                    borderRadius: '3px', fontSize: '0.56rem', fontWeight: '800',
                    padding: '1px 5px', fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    <span style={{
                      width: '4px', height: '4px', borderRadius: '50%',
                      background: '#0C2340', animation: 'pulse-dot 1.5s infinite',
                    }} />
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <div style={{
                    position: 'absolute', bottom: '0', left: '0', right: '0',
                    height: '2px', background: '#4ADE80',
                    borderRadius: '2px 2px 0 0',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE DRAWER ── */}
      {mobileMenuOpen && (
        <div style={{
          background: '#0C2340',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          padding: '12px 16px',
          display: 'flex', flexDirection: 'column', gap: '4px',
        }} role="dialog" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  background: isActive ? 'rgba(74, 222, 128, 0.12)' : 'transparent',
                  border: 'none',
                  color: isActive ? '#4ADE80' : 'rgba(255,255,255,0.8)',
                  fontSize: '0.88rem', fontWeight: isActive ? '700' : '500',
                  padding: '10px 12px', cursor: 'pointer',
                  textAlign: 'left', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: "'Inter', sans-serif",
                  borderRadius: '6px', transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      background: '#4ADE80', color: '#0C2340',
                      borderRadius: '3px', fontSize: '0.58rem', fontWeight: '800',
                      padding: '1px 5px',
                    }}>{item.badge}</span>
                  )}
                </div>
                {isActive && <span style={{ color: '#4ADE80', fontSize: '0.8rem' }}>●</span>}
              </button>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .mobile-menu-toggle { display: none !important; }
        @media (max-width: 768px) {
          .mobile-menu-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
