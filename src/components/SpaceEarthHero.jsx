import React, { useState } from 'react';
import { ArrowRight, ChevronDown, Satellite, ShieldCheck, MapPin } from 'lucide-react';
import earthGlobeImg from '../assets/earth_globe.jpg';

export default function SpaceEarthHero({ onExploreClick, onHowItWorksClick }) {
  const [activePin, setActivePin] = useState(null);

  const telemetryPins = [
    { id: 'bangladesh', name: 'Bangladesh Delta', tag: 'Monsoon Surges & Saturation', top: '48%', left: '56%' },
    { id: 'nepal', name: 'Nepal Himalaya', tag: 'High-Altitude Slope Stress', top: '38%', left: '52%' },
    { id: 'india', name: 'India Subcontinent', tag: 'Thermal & Vegetation Trends', top: '50%', left: '42%' },
    { id: 'pakistan', name: 'Pakistan Indus Basin', tag: 'Hydroclimatic Extremes', top: '42%', left: '33%' },
  ];

  return (
    <section style={styles.heroSection} aria-label="Earth's Hidden Signals Introduction">
      {/* Subtle Starfield & Ambient Orbital Atmosphere */}
      <div style={styles.spaceAtmosphere} aria-hidden="true" />
      <div style={styles.subtleStars} aria-hidden="true" />

      <div className="container" style={styles.heroContainer}>
        {/* Left Column: Clear Scientific Hierarchy */}
        <div style={styles.leftCol}>
          {/* Eyebrow Badge */}
          <div style={styles.eyebrowContainer}>
            <span style={styles.eyebrow}>
              EARTH’S HIDDEN SIGNALS · NASA SPACE APPS 2026
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={styles.mainHeading}>
            One Warming Planet.
            <br />
            <span style={styles.gradientHeading}>Different Regional Responses.</span>
          </h1>

          {/* Supporting Message */}
          <p style={styles.description}>
            “Explore how temperature, rainfall, and other environmental signals are changing across South Asia. Understand historical evidence, discover regional differences, and find practical ways to prepare.”
          </p>

          {/* Call-to-Action Buttons */}
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
              aria-label="Learn How the System Works"
            >
              <span>How It Works</span>
            </button>
          </div>

          {/* Trust Statement */}
          <div style={styles.trustStatement}>
            <span style={styles.trustDot} />
            <span style={styles.trustText}>
              PREPAREDNESS, NOT PREDICTION · NASA EARTH OBSERVATION MISSIONS
            </span>
          </div>
        </div>

        {/* Right Column: Earth Orbital Globe Viewport */}
        <div style={styles.rightCol} aria-label="Earth Observation Globe Visual">
          <div style={styles.globeContainer}>
            {/* Ambient Cyan Aura */}
            <div style={styles.atmoGlow} />

            {/* NASA Earth Visual */}
            <img
              src={earthGlobeImg}
              alt="Planet Earth view focusing on South Asia from NASA Earth Observation"
              style={styles.globeImage}
            />

            {/* Atmosphere Rim Highlight */}
            <div style={styles.rimOverlay} />

            {/* Interactive Telemetry Hotspot Pins */}
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
                      <div style={{ fontSize: '0.76rem', fontWeight: '800', color: '#FFFFFF' }}>
                        {pin.name}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: '#55D6FF', fontFamily: "'JetBrains Mono', monospace" }}>
                        {pin.tag}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Telemetry Sensor Tag */}
            <div style={styles.telemetryCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Satellite size={13} color="#37D6A3" />
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: '#F4F7FB', letterSpacing: '0.04em' }}>
                  SOUTH ASIA REGIONAL TELEMETRY
                </span>
              </div>
              <span style={{ fontSize: '0.64rem', color: '#A6B4C8', fontFamily: "'JetBrains Mono', monospace" }}>
                GISTEMP v4 · GPCP/IMERG · SMAP L4 · MODIS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Bottom Transition */}
      <div style={styles.bottomTransition} aria-hidden="true">
        <div style={styles.transitionGradient} />
        <button
          onClick={onHowItWorksClick}
          style={styles.scrollCue}
          aria-label="Scroll down to explore signals"
        >
          <span style={{ fontSize: '0.68rem', color: '#7E8EA6', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '600' }}>
            Scroll to Explore Evidence
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
    minHeight: '84vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at 75% 45%, #0B1A35 0%, #080D1B 45%, #050816 100%)',
    overflow: 'hidden',
  },
  spaceAtmosphere: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 80% 35%, rgba(85, 214, 255, 0.08) 0%, transparent 65%)',
    pointerEvents: 'none',
  },
  subtleStars: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      radial-gradient(1px 1px at 15% 25%, rgba(255,255,255,0.7) 100%, transparent),
      radial-gradient(1.5px 1.5px at 35% 65%, rgba(255,255,255,0.5) 100%, transparent),
      radial-gradient(1px 1px at 50% 15%, rgba(255,255,255,0.4) 100%, transparent),
      radial-gradient(1.5px 1.5px at 75% 85%, rgba(255,255,255,0.7) 100%, transparent),
      radial-gradient(1px 1px at 85% 12%, rgba(255,255,255,0.5) 100%, transparent)
    `,
    backgroundSize: '400px 400px',
    opacity: 0.75,
    pointerEvents: 'none',
  },
  heroContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 0.9fr',
    alignItems: 'center',
    gap: '36px',
    paddingTop: '36px',
    paddingBottom: '48px',
    position: 'relative',
    zIndex: 2,
    minWidth: 0,
  },
  leftCol: {
    maxWidth: '560px',
    minWidth: 0,
  },
  eyebrowContainer: {
    marginBottom: '14px',
  },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#55D6FF',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    background: 'rgba(85, 214, 255, 0.08)',
    border: '1px solid rgba(85, 214, 255, 0.25)',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  mainHeading: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 'clamp(2.2rem, 4.2vw, 3.8rem)',
    fontWeight: '800',
    lineHeight: 1.1,
    letterSpacing: '-0.03em',
    color: '#FFFFFF',
    marginBottom: '16px',
    wordBreak: 'break-word',
  },
  gradientHeading: {
    background: 'linear-gradient(135deg, #55D6FF 0%, #37D6A3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  description: {
    fontSize: 'clamp(0.92rem, 1.2vw, 1.05rem)',
    color: '#A6B4C8',
    lineHeight: 1.65,
    marginBottom: '26px',
    maxWidth: '520px',
  },
  btnGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '22px',
  },
  primaryBtn: {
    padding: '12px 24px',
    fontSize: '0.92rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
  secondaryBtn: {
    padding: '12px 20px',
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
    flexShrink: 0,
  },
  trustText: {
    fontSize: '0.72rem',
    fontWeight: '700',
    color: '#7E8EA6',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.06em',
  },
  rightCol: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    minWidth: 0,
  },
  globeContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '460px',
    aspectRatio: '1 / 1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  atmoGlow: {
    position: 'absolute',
    width: '92%',
    height: '92%',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(85, 214, 255, 0.22) 0%, rgba(55, 214, 163, 0.1) 45%, transparent 70%)',
    filter: 'blur(24px)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  globeImage: {
    width: '88%',
    height: '88%',
    objectFit: 'cover',
    borderRadius: '50%',
    boxShadow: '0 0 44px rgba(85, 214, 255, 0.3), inset 0 0 24px rgba(5, 8, 22, 0.8)',
    position: 'relative',
    zIndex: 2,
    border: '1px solid rgba(85, 214, 255, 0.25)',
  },
  rimOverlay: {
    position: 'absolute',
    width: '88%',
    height: '88%',
    borderRadius: '50%',
    boxShadow: 'inset 2px 2px 18px rgba(85, 214, 255, 0.4), inset -12px -12px 36px rgba(5, 8, 22, 0.95)',
    pointerEvents: 'none',
    zIndex: 3,
  },
  pinDotWrapper: {
    position: 'relative',
    width: '16px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinPulse: {
    position: 'absolute',
    inset: 0,
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
    bottom: '22px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(8, 13, 27, 0.96)',
    border: '1px solid rgba(85, 214, 255, 0.35)',
    borderRadius: '6px',
    padding: '6px 10px',
    whiteSpace: 'nowrap',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    pointerEvents: 'none',
    zIndex: 20,
  },
  telemetryCard: {
    position: 'absolute',
    bottom: '6px',
    right: '6px',
    background: 'rgba(8, 13, 27, 0.9)',
    border: '1px solid rgba(85, 214, 255, 0.25)',
    backdropFilter: 'blur(12px)',
    padding: '8px 12px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    zIndex: 4,
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
  },
  bottomTransition: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: '12px',
    zIndex: 3,
  },
  transitionGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50px',
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
