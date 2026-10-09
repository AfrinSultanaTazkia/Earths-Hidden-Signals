import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Satellite } from 'lucide-react';
import earthGlobeImg from '../assets/earth_globe.jpg';

export default function SpaceEarthHero({ onExploreClick, onHowItWorksClick }) {
  const [activePin, setActivePin] = useState(null);

  const telemetryPins = [
    { id: 'bangladesh', name: 'Bangladesh Delta', tag: 'Precipitation & Soil Saturation', top: '48%', left: '56%' },
    { id: 'nepal', name: 'Nepal Himalaya', tag: 'Monsoon Slope Vulnerability', top: '38%', left: '52%' },
    { id: 'india', name: 'India Subcontinent', tag: 'Thermal & Vegetation Shift', top: '50%', left: '42%' },
    { id: 'pakistan', name: 'Pakistan Indus Basin', tag: 'Hydro-Climatic Extremes', top: '42%', left: '33%' },
  ];

  return (
    <section style={styles.heroSection} aria-label="Hero Section">
      {/* Background Starfield & Space Atmosphere */}
      <div style={styles.spaceAtmosphere} aria-hidden="true" />
      <div style={styles.subtleStars} aria-hidden="true" />

      <div className="container" style={styles.heroContainer}>
        {/* Left Column: Foreground Editorial Content */}
        <div style={styles.leftCol}>
          {/* Eyebrow */}
          <div style={styles.eyebrowContainer}>
            <span style={styles.eyebrow}>
              EARTH’S HIDDEN SIGNALS · NASA SPACE APPS 2026
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={styles.mainHeading}>
            One Warming Planet.
            <br />
            <span style={{ color: '#55D6FF' }}>Different Regional Responses.</span>
          </h1>

          {/* Supporting Text */}
          <p style={styles.description}>
            “Explore how temperature, rainfall, and other environmental signals are changing across South Asia. Discover historical trends, understand regional differences, and turn scientific evidence into smarter preparedness.”
          </p>

          {/* Buttons */}
          <div style={styles.btnGroup}>
            <button
              className="btn-primary"
              onClick={onExploreClick}
              style={styles.primaryBtn}
              aria-label="Explore Environmental Signals"
            >
              <span>Explore Environmental Signals</span>
              <ArrowRight size={16} />
            </button>

            <button
              className="btn-secondary"
              onClick={onHowItWorksClick}
              style={styles.secondaryBtn}
              aria-label="How It Works"
            >
              <span>How It Works</span>
            </button>
          </div>

          {/* Preparedness Statement */}
          <div style={styles.trustStatement}>
            <span style={styles.trustDot} />
            <span style={styles.trustText}>PREPAREDNESS, NOT PREDICTION · NASA EARTH OBSERVATIONS</span>
          </div>
        </div>

        {/* Right Column: Centerpiece Earth Globe */}
        <div style={styles.rightCol} aria-label="Earth Observation Globe Visual">
          <div style={styles.globeContainer}>
            {/* Ambient Cyan/Blue Atmosphere Aura */}
            <div style={styles.atmoGlow} />

            {/* High-res Realistic Earth Image */}
            <img
              src={earthGlobeImg}
              alt="Realistic view of Planet Earth focusing on South Asia from NASA Earth Observation"
              style={styles.globeImage}
            />

            {/* Atmospheric Rim Overlay */}
            <div style={styles.rimOverlay} />

            {/* Telemetry Pins Overlay for South Asia */}
            {telemetryPins.map((pin) => {
              const isHovered = activePin === pin.id;
              return (
                <div
                  key={pin.id}
                  style={{
                    position: 'absolute',
                    top: pin.top,
                    left: pin.left,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setActivePin(pin.id)}
                  onMouseLeave={() => setActivePin(null)}
                  onClick={onExploreClick}
                >
                  <div style={styles.pinDotWrapper}>
                    <div style={styles.pinPulse} />
                    <div style={styles.pinDot} />
                  </div>

                  {isHovered && (
                    <div style={styles.pinTooltip}>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#FFFFFF' }}>
                        {pin.name}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: '#55D6FF', fontFamily: "'JetBrains Mono', monospace" }}>
                        {pin.tag}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Satellite Telemetry Tag */}
            <div style={styles.telemetryCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Satellite size={12} color="#37D6A3" />
                <span style={{ fontSize: '0.68rem', fontWeight: '700', color: '#F4F7FB', letterSpacing: '0.04em' }}>
                  SOUTH ASIA REGIONAL OBSERVATION
                </span>
              </div>
              <span style={{ fontSize: '0.62rem', color: '#A6B4C8', fontFamily: "'JetBrains Mono', monospace" }}>
                MODIS · GPM IMERG · SMAP L4 · LANDSAT
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Curved Earth-Atmosphere Transition to next section */}
      <div style={styles.bottomTransition} aria-hidden="true">
        <div style={styles.transitionGradient} />
        <button
          onClick={onHowItWorksClick}
          style={styles.scrollCue}
          aria-label="Scroll to discover signals"
        >
          <span style={{ fontSize: '0.68rem', color: '#7E8EA6', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Explore Signals
          </span>
          <ChevronDown size={14} color="#55D6FF" style={{ animation: 'floatSlow 2.5s ease-in-out infinite' }} />
        </button>
      </div>
    </section>
  );
}

const styles = {
  heroSection: {
    position: 'relative',
    minHeight: '88vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 80% 45%, #0B1A35 0%, #080D1B 45%, #050816 100%)',
    overflow: 'hidden',
  },
  spaceAtmosphere: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 85% 40%, rgba(85, 214, 255, 0.08) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  subtleStars: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.7) 100%, transparent),
      radial-gradient(1.5px 1.5px at 30% 65%, rgba(255,255,255,0.6) 100%, transparent),
      radial-gradient(1px 1px at 45% 15%, rgba(255,255,255,0.5) 100%, transparent),
      radial-gradient(1.5px 1.5px at 70% 85%, rgba(255,255,255,0.8) 100%, transparent),
      radial-gradient(1px 1px at 85% 10%, rgba(255,255,255,0.6) 100%, transparent),
      radial-gradient(1px 1px at 90% 70%, rgba(255,255,255,0.5) 100%, transparent),
      radial-gradient(1.2px 1.2px at 10% 80%, rgba(255,255,255,0.5) 100%, transparent)
    `,
    backgroundSize: '450px 450px',
    opacity: 0.8,
    pointerEvents: 'none',
  },
  heroContainer: {
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
    alignItems: 'center',
    gap: '40px',
    paddingTop: '40px',
    paddingBottom: '60px',
    position: 'relative',
    zIndex: 2,
  },
  leftCol: {
    maxWidth: '540px',
  },
  eyebrowContainer: {
    marginBottom: '18px',
  },
  eyebrow: {
    display: 'inline-block',
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#55D6FF',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
  },
  mainHeading: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: 'clamp(2.8rem, 5.2vw, 4.4rem)',
    fontWeight: '800',
    lineHeight: 1.05,
    letterSpacing: '-0.035em',
    color: '#FFFFFF',
    marginBottom: '18px',
  },
  supportingHeadline: {
    fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
    fontWeight: '500',
    color: '#F4F7FB',
    marginBottom: '14px',
    letterSpacing: '-0.01em',
  },
  description: {
    fontSize: '0.96rem',
    color: '#A6B4C8',
    lineHeight: 1.65,
    marginBottom: '28px',
    maxWidth: '480px',
  },
  btnGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
    marginBottom: '26px',
  },
  primaryBtn: {
    padding: '12px 26px',
    fontSize: '0.92rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  secondaryBtn: {
    padding: '12px 22px',
    fontSize: '0.92rem',
  },
  trustStatement: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  trustDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#37D6A3',
    boxShadow: '0 0 8px #37D6A3',
  },
  trustText: {
    fontSize: '0.74rem',
    fontWeight: '700',
    color: '#7E8EA6',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.08em',
  },
  rightCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  globeContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '520px',
    aspectRatio: '1 / 1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  atmoGlow: {
    position: 'absolute',
    width: '94%',
    height: '94%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(85, 214, 255, 0.22) 0%, rgba(55, 214, 163, 0.12) 40%, transparent 70%)',
    filter: 'blur(28px)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  globeImage: {
    width: '90%',
    height: '90%',
    objectFit: 'cover',
    borderRadius: '50%',
    boxShadow: '0 0 50px rgba(85, 214, 255, 0.35), inset 0 0 30px rgba(5, 8, 22, 0.8)',
    position: 'relative',
    zIndex: 2,
    border: '1px solid rgba(85, 214, 255, 0.3)',
    transition: 'transform 0.4s ease',
  },
  rimOverlay: {
    position: 'absolute',
    width: '90%',
    height: '90%',
    borderRadius: '50%',
    boxShadow: 'inset 2px 2px 20px rgba(85, 214, 255, 0.4), inset -15px -15px 40px rgba(5, 8, 22, 0.95)',
    pointerEvents: 'none',
    zIndex: 3,
  },
  pinDotWrapper: {
    position: 'relative',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinPulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'rgba(85, 214, 255, 0.4)',
    animation: 'pulse 2s infinite ease-out',
  },
  pinDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#55D6FF',
    boxShadow: '0 0 6px #55D6FF',
  },
  pinTooltip: {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(13, 21, 39, 0.95)',
    border: '1px solid rgba(85, 214, 255, 0.3)',
    borderRadius: '6px',
    padding: '6px 10px',
    whiteSpace: 'nowrap',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
    pointerEvents: 'none',
    zIndex: 20,
  },
  telemetryCard: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
    background: 'rgba(13, 21, 39, 0.85)',
    border: '1px solid rgba(85, 214, 255, 0.2)',
    backdropFilter: 'blur(12px)',
    padding: '8px 14px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    zIndex: 4,
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  },
  bottomTransition: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: '16px',
    zIndex: 3,
  },
  transitionGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: 'linear-gradient(to bottom, transparent, #080D1B)',
    pointerEvents: 'none',
  },
  scrollCue: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    zIndex: 4,
    padding: '4px',
  },
};
