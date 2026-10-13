import React, { useState } from 'react';
import {
  Satellite, BarChart3, CheckCircle2, ShieldAlert,
  ArrowRight, Activity, Info, FileText, Check, HelpCircle
} from 'lucide-react';
import { VARIABLES, REGIONS } from '../data/earthSignalsData';

export default function ScientificProcessVisualization({ onSelectRegion }) {
  const [activeStep, setActiveStep] = useState(null);

  const steps = [
    {
      num: 1,
      badge: 'INPUT',
      title: 'NASA Earth Observations',
      icon: Satellite,
      color: '#0899C4',
      bg: '#E8F4FA',
      border: '#93C5FD',
      summary: 'Continuous satellite & reanalysis observations across South Asia (2001–2025).',
      details: [
        { name: 'Temperature', src: 'NASA GISTEMP v4 / MODIS LST', note: '25-yr continuous' },
        { name: 'Precipitation', src: 'NASA GPCP v3.2 / GPM IMERG', note: '25-yr continuous' },
        { name: 'Soil Moisture', src: 'NASA SMAP L4', note: '2015–2025 (11-yr)' },
        { name: 'Vegetation NDVI', src: 'MODIS MOD13A2 / Landsat', note: '25-yr continuous' },
      ],
    },
    {
      num: 2,
      badge: 'RIGOR',
      title: 'Statistical Testing',
      icon: BarChart3,
      color: '#0D5C47',
      bg: '#E8F8F2',
      border: '#A7DFC9',
      summary: 'Non-parametric hypothesis testing without assuming normal distribution.',
      details: [
        { name: 'Mann–Kendall Test', src: 'Rank Correlation (S & Z)', note: 'Detects monotonic shift' },
        { name: "Sen's Slope", src: 'Median pairwise slope', note: 'Outlier-robust rate' },
        { name: 'Significance α', src: 'Two-tailed threshold', note: 'p < 0.05 required' },
        { name: 'Auto-Correlation', src: 'Pre-whitening checks', note: 'Reduces false positives' },
      ],
    },
    {
      num: 3,
      badge: 'OUTCOME',
      title: 'Verified Trend Results',
      icon: CheckCircle2,
      color: '#1B8A62',
      bg: '#EAF6F0',
      border: '#86EFAC',
      summary: 'Four objective statistical classifications — no positive bias or hidden null results.',
      details: [
        { name: 'Sig. Increasing 📈', src: 'p < 0.05, Slope > 0', note: 'Statistically verified' },
        { name: 'Sig. Decreasing 📉', src: 'p < 0.05, Slope < 0', note: 'Statistically verified' },
        { name: 'No Sig. Trend ⚪', src: 'p ≥ 0.05', note: 'Null hypothesis retained' },
        { name: 'Inconclusive ❓', src: 'Insufficient N / gaps', note: 'SMAP shorter baseline' },
      ],
    },
    {
      num: 4,
      badge: 'CONTEXT',
      title: 'Regional Interpretation',
      icon: Activity,
      color: '#D97706',
      bg: '#FFFBEB',
      border: '#FCD34D',
      summary: 'Translating mathematical trends into geographical and terrain vulnerability context.',
      details: [
        { name: 'Bangladesh 🇧🇩', src: 'Delta Floodplain', note: 'Runoff & saturation impedance' },
        { name: 'India 🇮🇳', src: 'Peninsular & Forest', note: 'Heat & dry biomass stress' },
        { name: 'Nepal 🇳🇵', src: 'Himalayan Slopes', note: 'Slope pore-pressure & shear' },
        { name: 'Pakistan 🇵🇰', src: 'Indus River Basin', note: 'Arid-to-monsoon oscillation' },
      ],
    },
    {
      num: 5,
      badge: 'ACTION',
      title: 'Preparedness Advisories',
      icon: ShieldAlert,
      color: '#0C2340',
      bg: '#EEF2F7',
      border: '#CBD5E8',
      summary: 'Practical sector-specific risk reduction — evidence-based planning, never sensational predictions.',
      details: [
        { name: 'Farmers 🌾', src: 'Water budgeting', note: 'Crop timing & moisture strategy' },
        { name: 'Health 🏥', src: 'Heat & vector alerts', note: 'Pre-monsoon clinic staffing' },
        { name: 'Responders 🚑', src: 'Pre-positioning', note: 'Catchment river gauge watch' },
        { name: 'Communities 🏠', src: 'Drainage & safety', note: 'Local early warning awareness' },
      ],
    },
  ];

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #D8E2EF',
      borderRadius: '12px',
      padding: '24px 20px',
      marginBottom: '20px',
      boxShadow: '0 2px 12px rgba(12, 35, 64, 0.08)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '14px',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.7rem',
            fontWeight: '700',
            color: '#0D5C47',
            background: '#E8F8F2',
            padding: '2px 8px',
            borderRadius: '4px',
            marginBottom: '6px'
          }}>
            <Activity size={12} /> SCIENTIFIC METHODOLOGY PIPELINE
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: '1.25rem',
            fontWeight: '800',
            color: '#0C2340',
            margin: 0
          }}>
            From NASA Earth Observations to Actionable Preparedness
          </h2>
          <p style={{
            fontSize: '0.8rem',
            color: '#718096',
            margin: '4px 0 0 0'
          }}>
            Our rigorous 5-stage analytical process: Raw satellite observations are mathematically verified before informing human advisories.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '0.74rem',
          color: '#4A5568'
        }}>
          <Info size={14} color="#0899C4" />
          <span>Non-significant trends are reported transparently</span>
        </div>
      </div>

      {/* 5-Step Process Flow Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        position: 'relative'
      }} className="process-flow-grid">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isSelected = activeStep === s.num;
          return (
            <div
              key={s.num}
              onClick={() => setActiveStep(isSelected ? null : s.num)}
              style={{
                background: isSelected ? s.bg : '#F8FAFC',
                border: `1px solid ${isSelected ? s.color : '#E2E8F0'}`,
                borderTop: `4px solid ${s.color}`,
                borderRadius: '8px',
                padding: '14px 12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '260px'
              }}
            >
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px'
                }}>
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: s.color,
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '0.74rem',
                    fontWeight: '800'
                  }}>
                    {s.num}
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: '700',
                    color: s.color,
                    background: s.bg,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: `1px solid ${s.border}`
                  }}>
                    {s.badge}
                  </span>
                </div>

                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '0.92rem',
                  fontWeight: '700',
                  color: '#0C2340',
                  marginBottom: '6px'
                }}>
                  {s.title}
                </div>

                <p style={{
                  fontSize: '0.72rem',
                  color: '#4A5568',
                  lineHeight: 1.45,
                  marginBottom: '10px'
                }}>
                  {s.summary}
                </p>
              </div>

              {/* Detail Items */}
              <div style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                {s.details.map((item, dIdx) => (
                  <div
                    key={dIdx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      fontSize: '0.68rem',
                      lineHeight: 1.3
                    }}
                  >
                    <span style={{ fontWeight: '700', color: '#0C2340' }}>{item.name}</span>
                    <span style={{ color: '#718096', fontSize: '0.63rem' }}>{item.note}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Process Connectors Bottom Banner */}
      <div style={{
        marginTop: '16px',
        padding: '12px 16px',
        background: '#F0F4FA',
        border: '1px solid #D8E2EF',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '0.76rem',
        color: '#2D3748'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <strong style={{ color: '#0C2340' }}>Scientific Integrity Rule:</strong>
          <span>No single environmental trend proves a disaster cause. Trends establish historical likelihood and inform preparedness.</span>
        </div>
        <div style={{
          display: 'flex',
          gap: '12px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.7rem',
          color: '#0D5C47'
        }}>
          <span>Mann-Kendall (p &lt; 0.05)</span>
          <span>•</span>
          <span>Sen’s Median Slope</span>
          <span>•</span>
          <span>NASA Level-3/4 Products</span>
        </div>
      </div>
    </div>
  );
}
