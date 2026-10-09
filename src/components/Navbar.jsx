import React, { useState, useEffect } from 'react';
import { Globe, ArrowRight, Menu, X, Satellite, Activity, ShieldCheck, BookOpen, Layers, BarChart2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Signals Dashboard' },
    { id: 'explorelive', label: 'Live Telemetry', badge: 'LIVE' },
    { id: 'historical', label: 'Historical Evidence' },
    { id: 'casestudies', label: 'Case Studies' },
    { id: 'preparedness', label: 'Preparedness' },
    { id: 'methodology', label: 'Methodology' },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isHome = activeTab === 'home';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: scrolled || !isHome
          ? 'rgba(5, 8, 22, 0.92)'
          : 'rgba(5, 8, 22, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(85, 214, 255, 0.16)'
          : '1px solid rgba(255, 255, 255, 0.06)',
        transition: 'all 0.3s ease',
      }}
      role="banner"
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        {/* Brand */}
        <button
          style={styles.brand}
          onClick={() => handleNavClick('home')}
          aria-label="Earth's Hidden Signals - Go to Home"
        >
          <div style={styles.logoIcon}>
            <Globe size={18} color="#55D6FF" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={styles.brandTitle}>Earth's Hidden Signals</span>
              <span style={styles.brandBadge}>NASA APPS</span>
            </div>
            <span style={styles.brandSubtitle}>South Asia Environmental Intelligence</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav style={styles.desktopNav} aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                }}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span style={styles.liveNavBadge}>
                    <span style={styles.livePulseDot} />
                    {item.badge}
                  </span>
                )}
                {isActive && <div style={styles.navActiveBar} />}
              </button>
            );
          })}
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn-primary"
            onClick={() => handleNavClick('explore')}
            style={{ padding: '9px 18px', fontSize: '0.84rem' }}
            aria-label="Explore Environmental Intelligence Dashboard"
          >
            <span>Explore Signals</span>
            <ArrowRight size={14} />
          </button>

          {/* Mobile toggle */}
          <button
            style={styles.mobileMenuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} role="dialog" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  ...styles.mobileNavLink,
                  ...(isActive ? styles.mobileNavLinkActive : {}),
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={styles.liveNavBadge}>
                      {item.badge}
                    </span>
                  )}
                </div>
                {isActive && <span style={{ color: '#55D6FF', fontSize: '0.8rem' }}>●</span>}
              </button>
            );
          })}
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid rgba(38,54,75,0.6)' }}>
            <button
              className="btn-primary"
              onClick={() => handleNavClick('explore')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Explore Environmental Signals</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

const styles = {
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    background: 'transparent',
    border: 'none',
    padding: 0,
    textDecoration: 'none',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(85, 214, 255, 0.15) 0%, rgba(55, 214, 163, 0.1) 100%)',
    border: '1px solid rgba(85, 214, 255, 0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    boxShadow: '0 0 16px rgba(85, 214, 255, 0.2)',
  },
  brandTitle: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: '0.98rem',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  brandSubtitle: {
    fontSize: '0.66rem',
    color: '#7E8EA6',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '500',
    letterSpacing: '0.02em',
  },
  brandBadge: {
    fontSize: '0.62rem',
    fontWeight: '700',
    color: '#55D6FF',
    fontFamily: "'JetBrains Mono', monospace",
    background: 'rgba(85, 214, 255, 0.1)',
    padding: '1px 5px',
    borderRadius: '4px',
    border: '1px solid rgba(85, 214, 255, 0.25)',
    letterSpacing: '0.04em',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  navLink: {
    background: 'transparent',
    border: 'none',
    color: '#A6B4C8',
    fontSize: '0.84rem',
    fontWeight: '500',
    padding: '8px 2px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  navLinkActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  navActiveBar: {
    position: 'absolute',
    bottom: '-4px',
    left: '0',
    right: '0',
    height: '2px',
    background: 'linear-gradient(90deg, #55D6FF, #37D6A3)',
    borderRadius: '2px',
    boxShadow: '0 0 8px rgba(85, 214, 255, 0.6)',
  },
  liveNavBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(55, 214, 163, 0.15)',
    color: '#37D6A3',
    border: '1px solid rgba(55, 214, 163, 0.35)',
    borderRadius: '4px',
    fontSize: '0.6rem',
    fontWeight: '800',
    padding: '1px 5px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  livePulseDot: {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#37D6A3',
    boxShadow: '0 0 4px #37D6A3',
  },
  mobileMenuToggle: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: '#F4F7FB',
    cursor: 'pointer',
    padding: '6px',
  },
  mobileDrawer: {
    background: '#080D1B',
    borderBottom: '1px solid rgba(85, 214, 255, 0.15)',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  mobileNavLink: {
    background: 'transparent',
    border: 'none',
    color: '#A6B4C8',
    fontSize: '0.92rem',
    fontWeight: '500',
    padding: '10px 8px',
    cursor: 'pointer',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '6px',
    transition: 'background 0.2s ease',
  },
  mobileNavLinkActive: {
    color: '#55D6FF',
    fontWeight: '700',
    background: 'rgba(85, 214, 255, 0.08)',
  },
};
