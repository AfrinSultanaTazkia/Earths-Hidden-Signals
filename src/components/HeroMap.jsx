import React, { useState } from 'react';
import { REGIONS, VARIABLES } from '../data/earthSignalsData';
import { Activity, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroMap({ onSelectRegion }) {
  const [activeRegionId, setActiveRegionId] = useState('bangladesh');
  const [activeVariable, setActiveVariable] = useState('rainfall');

  const selectedRegion = REGIONS.find(r => r.id === activeRegionId) || REGIONS[0];

  // Coordinates mapping for stylized South Asia SVG map
  const mapNodes = [
    { id: 'bangladesh', name: 'Bangladesh', cx: 330, cy: 190, r: 18, color: '#06B6D4', pulse: '#22D3EE', signal: 'High Rainfall & Surface Runoff' },
    { id: 'india', name: 'India', cx: 210, cy: 220, r: 24, color: '#F59E0B', pulse: '#FBBF24', signal: 'Thermal Anomaly & Soil Deficit' },
    { id: 'nepal', name: 'Nepal', cx: 280, cy: 145, r: 16, color: '#10B981', pulse: '#34D399', signal: 'Localized Rainfall Saturation' },
    { id: 'pakistan', name: 'Pakistan', cx: 130, cy: 155, r: 20, color: '#6366F1', pulse: '#818CF8', signal: 'Monsoon Surge & Arid Shift' }
  ];

  return (
    <div style={styles.heroMapContainer} className="glass-panel">
      {/* Top Map Header Controls */}
      <div style={styles.mapHeader}>
        <div style={styles.mapTitleGroup}>
          <Sparkles size={16} color="var(--color-cyan)" />
          <span style={styles.mapTitle}>South Asia Environmental Signal Monitor</span>
        </div>
        <div style={styles.variablePills}>
          {VARIABLES.slice(0, 4).map((v) => (
            <button
              key={v.id}
              onClick={() => setActiveVariable(v.id)}
              style={{
                ...styles.varPill,
                ...(activeVariable === v.id ? styles.varPillActive : {})
              }}
            >
              <span>{v.symbol}</span>
              <span>{v.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SVG Stylized Map Display */}
      <div style={styles.svgWrapper}>
        <svg viewBox="0 0 440 320" style={styles.svg}>
          <defs>
            {/* Gradients */}
            <linearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.15)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.05)" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid Lines */}
          <g stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1">
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 40} x2="440" y2={i * 40} />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="320" />
            ))}
          </g>

          {/* South Asia Stylized Contour Outlines */}
          {/* Pakistan */}
          <path
            d="M 80,100 Q 140,90 170,140 Q 140,210 110,210 Q 70,170 80,100 Z"
            fill={activeRegionId === 'pakistan' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.02)'}
            stroke={activeRegionId === 'pakistan' ? '#6366F1' : 'rgba(255, 255, 255, 0.15)'}
            strokeWidth={activeRegionId === 'pakistan' ? 2 : 1}
            onClick={() => setActiveRegionId('pakistan')}
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
          />

          {/* India */}
          <path
            d="M 170,140 Q 230,120 270,160 Q 290,200 240,290 Q 180,270 140,210 Z"
            fill={activeRegionId === 'india' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.02)'}
            stroke={activeRegionId === 'india' ? '#F59E0B' : 'rgba(255, 255, 255, 0.15)'}
            strokeWidth={activeRegionId === 'india' ? 2 : 1}
            onClick={() => setActiveRegionId('india')}
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
          />

          {/* Nepal */}
          <path
            d="M 240,135 Q 290,130 310,150 Q 270,160 240,135 Z"
            fill={activeRegionId === 'nepal' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.02)'}
            stroke={activeRegionId === 'nepal' ? '#10B981' : 'rgba(255, 255, 255, 0.15)'}
            strokeWidth={activeRegionId === 'nepal' ? 2 : 1}
            onClick={() => setActiveRegionId('nepal')}
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
          />

          {/* Bangladesh */}
          <path
            d="M 315,170 Q 345,165 355,195 Q 330,225 315,200 Z"
            fill={activeRegionId === 'bangladesh' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.02)'}
            stroke={activeRegionId === 'bangladesh' ? '#06B6D4' : 'rgba(255, 255, 255, 0.15)'}
            strokeWidth={activeRegionId === 'bangladesh' ? 2 : 1}
            onClick={() => setActiveRegionId('bangladesh')}
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
          />

          {/* Animated Flow Curves representing Regional Signal Connections */}
          <path
            d="M 130,155 Q 210,130 280,145 Q 300,165 330,190"
            fill="none"
            stroke="url(#gridGrad)"
            strokeWidth="2"
            strokeDasharray="6 4"
            style={{ animation: 'dash 20s linear infinite' }}
          />

          {/* Signal Hotspot Nodes */}
          {mapNodes.map((node) => {
            const isSelected = activeRegionId === node.id;
            return (
              <g 
                key={node.id} 
                transform={`translate(${node.cx}, ${node.cy})`}
                onClick={() => setActiveRegionId(node.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Outer Pulsing Ring */}
                <circle
                  r={isSelected ? node.r + 10 : node.r + 4}
                  fill="none"
                  stroke={node.pulse}
                  strokeWidth="1.5"
                  opacity={isSelected ? 0.8 : 0.3}
                  className={isSelected ? 'pulse-glow' : ''}
                />

                {/* Node Center */}
                <circle
                  r={node.r}
                  fill={isSelected ? node.color : 'rgba(17, 24, 39, 0.9)'}
                  stroke={node.color}
                  strokeWidth="2"
                  filter="url(#glow)"
                />

                {/* Text Label */}
                <text
                  y={4}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="700"
                  fontFamily="var(--font-heading)"
                >
                  {node.name.substring(0, 3).toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Live Signal Overlay Card */}
        <div style={styles.liveOverlay} className="glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="badge badge-cyan">{selectedRegion.flag} {selectedRegion.name}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>LIVE SIGNAL</span>
          </div>
          <div style={styles.overlayTitle}>{selectedRegion.primarySignal}</div>
          <p style={styles.overlayDesc}>{selectedRegion.description}</p>
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Risk-Relevant Context: <strong>{selectedRegion.disasterContext}</strong>
            </span>
            <button
              onClick={() => onSelectRegion(selectedRegion.id)}
              style={styles.exploreBtn}
            >
              <span>Explore Data</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  heroMapContainer: {
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    borderColor: 'var(--border-glow)'
  },
  mapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  mapTitleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  mapTitle: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  variablePills: {
    display: 'flex',
    gap: '6px'
  },
  varPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  varPillActive: {
    background: 'var(--color-cyan-glow)',
    color: 'var(--color-cyan)',
    borderColor: 'var(--color-cyan)'
  },
  svgWrapper: {
    position: 'relative',
    width: '100%',
    borderRadius: 'var(--radius-md)',
    background: '#070A12',
    border: '1px solid var(--border-subtle)',
    overflow: 'hidden'
  },
  svg: {
    width: '100%',
    height: 'auto',
    display: 'block'
  },
  liveOverlay: {
    position: 'absolute',
    bottom: '16px',
    left: '16px',
    right: '16px',
    padding: '14px 18px',
    background: 'rgba(11, 15, 25, 0.92)',
    backdropFilter: 'blur(16px)',
    border: '1px solid var(--border-glow)'
  },
  overlayTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '4px'
  },
  overlayDesc: {
    fontSize: '0.82rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4
  },
  exploreBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--color-cyan-glow)',
    border: '1px solid var(--color-cyan)',
    color: 'var(--color-cyan)',
    fontSize: '0.78rem',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer'
  }
};
