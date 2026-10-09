import React, { useState, useEffect } from 'react';
import { Globe, ArrowRight, Menu, X } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore' },
    { id: 'historical', label: 'Evidence' },
    { id: 'casestudies', label: 'Case Studies' },
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
          ? 'rgba(5, 8, 22, 0.88)'
          : 'rgba(5, 8, 22, 0.4)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled
          ? '1px solid rgba(85, 214, 255, 0.12)'
          : '1px solid rgba(255, 255, 255, 0.05)',
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
          height: '68px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={styles.brandTitle}>Earth's Hidden Signals</span>
            <span style={styles.brandBadge}>2026</span>
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
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="btn-primary"
            onClick={() => handleNavClick('explore')}
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            aria-label="Explore Environmental Intelligence Dashboard"
          >
            <span>Explore Dashboard</span>
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
                {item.label}
              </button>
            );
          })}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(38,54,75,0.6)' }}>
            <button
              className="btn-primary"
              onClick={() => handleNavClick('explore')}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Explore Dashboard</span>
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
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(85, 214, 255, 0.08)',
    border: '1px solid rgba(85, 214, 255, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.96rem',
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: '-0.02em',
  },
  brandBadge: {
    fontSize: '0.65rem',
    fontWeight: '600',
    color: '#55D6FF',
    fontFamily: "'JetBrains Mono', monospace",
    background: 'rgba(85, 214, 255, 0.08)',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid rgba(85, 214, 255, 0.2)',
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  navLink: {
    background: 'transparent',
    border: 'none',
    color: '#A6B4C8',
    fontSize: '0.88rem',
    fontWeight: '500',
    padding: '6px 0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'Inter, sans-serif',
    position: 'relative',
  },
  navLinkActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  mobileMenuToggle: {
    display: 'none',
    background: 'transparent',
    border: 'none',
    color: '#F4F7FB',
    cursor: 'pointer',
    padding: '4px',
  },
  mobileDrawer: {
    background: '#0D1527',
    borderBottom: '1px solid rgba(38,54,75,0.8)',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  mobileNavLink: {
    background: 'transparent',
    border: 'none',
    color: '#A6B4C8',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '10px 0',
    cursor: 'pointer',
    textAlign: 'left',
    fontFamily: 'Inter, sans-serif',
  },
  mobileNavLinkActive: {
    color: '#55D6FF',
    fontWeight: '600',
  },
};
