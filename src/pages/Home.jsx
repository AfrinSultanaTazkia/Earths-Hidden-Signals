import React, { useState } from 'react';
import SpaceEarthHero from '../components/SpaceEarthHero';
import SignalStoryModal from '../components/SignalStoryModal';
import { NASA_DATA_SOURCES, REGIONS } from '../data/earthSignalsData';
import {
  Activity, Database, ArrowRight, ShieldCheck, Sparkles,
  ExternalLink, Globe, Satellite, BarChart3,
  Flame, Waves, Mountain, CloudRain, Eye, ChevronRight,
  TrendingUp, Compass, Layers, CheckCircle2, Sliders
} from 'lucide-react';

// Regional Satellite Imagery Assets
import bangladeshImg from '../assets/region_bangladesh.jpg';
import nepalImg from '../assets/region_nepal.jpg';
import indiaImg from '../assets/region_india.jpg';
import pakistanImg from '../assets/region_pakistan.jpg';

export default function Home({ setActiveTab, setSelectedRegionId }) {
  const [storyModalOpen, setStoryModalOpen] = useState(false);
  const [previewVar, setPreviewVar] = useState('rainfall');
  const [previewRegion, setPreviewRegion] = useState('bangladesh');

  const handleExploreRegion = (regionId) => {
    setSelectedRegionId(regionId);
    setActiveTab('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const regionalStories = [
    {
      id: 'bangladesh',
      country: 'Bangladesh',
      tag: 'Deltaic Floodplain',
      focus: 'Precipitation & Saturated Soil Dynamics',
      image: bangladeshImg,
      summary: 'Heavy upstream precipitation coupled with deltaic soil saturation increases surface runoff impedance across low-lying floodplains.',
      metric: '+11.2% Monsoonal Surge',
      sensor: 'GPM IMERG · SMAP L4',
      accentColor: '#55D6FF',
    },
    {
      id: 'nepal',
      country: 'Nepal',
      tag: 'Himalayan Slopes',
      focus: 'High-Relief Monsoon Slope Vulnerability',
      image: nepalImg,
      summary: 'Intense short-duration rainfall on steep geological slopes accelerates soil shear stress and localized landslide hazards.',
      metric: '+4.8 mm/day Intensity Spikes',
      sensor: 'MODIS · GPM Rainfall',
      accentColor: '#37D6A3',
    },
    {
      id: 'india',
      country: 'India',
      tag: 'Peninsular & Forests',
      focus: 'Thermal Anomalies & Dry Biomass Stress',
      image: indiaImg,
      summary: 'Extended pre-monsoon heat and declining root-zone moisture amplify dry matter combustibility in tropical deciduous corridors.',
      metric: '+0.85°C Pre-Monsoon Anomaly',
      sensor: 'MODIS Thermal · Landsat NDVI',
      accentColor: '#FFBF69',
    },
    {
      id: 'pakistan',
      country: 'Pakistan',
      tag: 'Indus River Basin',
      focus: 'Drought-to-Deluge Hydroclimatic Swings',
      image: pakistanImg,
      summary: 'Rapid transitions between severe arid soil moisture deficits and extreme monsoonal surges challenge irrigation and flood containment.',
      metric: 'High Hydroclimatic Variance',
      sensor: 'NASA POWER · SMAP Saturation',
      accentColor: '#818CF8',
    },
  ];

  const previewData = {
    rainfall: {
      title: 'Monsoon Precipitation Intensity',
      unit: 'mm / season',
      historic: '1,420 mm',
      recent: '1,585 mm',
      change: '+11.6%',
      trend: 'Increasing (p < 0.05)',
      desc: 'Sustained upward trend in high-intensity rainfall events across the Bengal delta and lower Himalayas.',
      color: '#55D6FF',
    },
    temp: {
      title: 'Land Surface Temperature (LST)',
      unit: '°C Anomaly',
      historic: '27.4°C',
      recent: '28.3°C',
      change: '+0.9°C',
      trend: 'Statistically Significant Warming',
      desc: 'Consistent positive temperature departures observed across central agricultural plains and river basins.',
      color: '#FF647C',
    },
    soil: {
      title: 'Root-Zone Soil Saturation',
      unit: 'm³ / m³',
      historic: '0.34 m³/m³',
      recent: '0.41 m³/m³',
      change: '+20.5%',
      trend: 'Elevated Antecedent Moisture',
      desc: 'High antecedent moisture reduces water absorption capacity ahead of peak monsoonal precipitation.',
      color: '#37D6A3',
    },
  };

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* 1. HERO */}
      <SpaceEarthHero
        onExploreClick={() => setActiveTab('explore')}
        onHowItWorksClick={() => {
          const el = document.getElementById('editorial-story');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. SCIENTIFIC CREDIBILITY STRIP */}
      <div style={styles.credibilityStrip}>
        <div className="container" style={styles.stripContainer}>
          {[
            { label: 'NASA Earth Observation Missions', icon: Satellite },
            { label: 'Mann–Kendall Trend Testing', icon: BarChart3 },
            { label: '44-Year Historical Baseline (1981–2025)', icon: Activity },
            { label: 'Multi-Mission Sensor Cross-Validation', icon: Layers },
            { label: 'Actionable Preparedness Intelligence', icon: ShieldCheck },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} style={styles.stripItem}>
                <Icon size={14} color="#55D6FF" />
                <span style={styles.stripText}>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. EDITORIAL SCIENCE STORY SECTION */}
      <section id="editorial-story" style={styles.editorialSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span className="badge badge-cyan" style={{ marginBottom: '14px' }}>
              <Globe size={12} />
              Environmental Intelligence
            </span>
            <h2 style={styles.sectionTitle}>
              One Planet. Different Environmental Signals.
            </h2>
            <p style={styles.sectionSubtitle}>
              A changing climate does not express itself uniformly. The same atmospheric warming triggers deltaic waterlogging, alpine slope instability, and arid vegetation stress across diverse South Asian landscapes.
            </p>
          </div>

          {/* Editorial Grid: Asymmetric Data Previews */}
          <div style={styles.editorialGrid}>
            {/* Feature Story Card (Wide) */}
            <div style={styles.featureStoryCard} className="glass-panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={styles.featurePill}>FEATURED OBSERVATION · HYDROLOGY</span>
                <span style={{ fontSize: '0.72rem', color: '#55D6FF', fontFamily: "'JetBrains Mono', monospace" }}>
                  NASA GPM IMERG & SMAP L4
                </span>
              </div>
              <h3 style={styles.featureHeadline}>
                Compound Monsoon Surges & Antecedent Soil Saturation
              </h3>
              <p style={styles.featureText}>
                When high-volume precipitation coincides with already saturated root-zone soil, runoff velocity doubles. Comparing 10-year historical baselines reveals that recent monsoons generate 18% higher peak surface discharge even with moderate rainfall volume.
              </p>

              <div style={styles.metricsRow}>
                <div style={styles.metricBlock}>
                  <div style={styles.metricLabel}>Baseline (2014–2023)</div>
                  <div style={styles.metricValue}>1,420 mm</div>
                </div>
                <div style={styles.metricBlock}>
                  <div style={styles.metricLabel}>Recent Average (2024–2025)</div>
                  <div style={{ ...styles.metricValue, color: '#55D6FF' }}>1,585 mm (+11.6%)</div>
                </div>
                <div style={styles.metricBlock}>
                  <div style={styles.metricLabel}>Statistical Confidence</div>
                  <div style={{ ...styles.metricValue, color: '#37D6A3' }}>p &lt; 0.05 (Mann-Kendall)</div>
                </div>
              </div>
            </div>

            {/* Supporting Story Card 1 */}
            <div style={styles.supportingCard} className="glass-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={styles.iconBox}>
                  <TrendingUp size={16} color="#FF647C" />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#FF647C', letterSpacing: '0.06em' }}>
                  THERMAL SHIFTS
                </span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
                Pre-Monsoon Land Surface Warming
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#A6B4C8', lineHeight: 1.6, marginBottom: '14px' }}>
                MODIS thermal data indicates prolonged heat anomalies across semi-arid belts, accelerating evapotranspiration prior to rainy seasons.
              </p>
              <div style={{ fontSize: '0.75rem', color: '#7E8EA6', fontFamily: "'JetBrains Mono', monospace" }}>
                Signal: +0.85°C / decade monotonic rise
              </div>
            </div>

            {/* Supporting Story Card 2 */}
            <div style={styles.supportingCard} className="glass-panel">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ ...styles.iconBox, background: 'rgba(55,214,163,0.1)', borderColor: 'rgba(55,214,163,0.3)' }}>
                  <Mountain size={16} color="#37D6A3" />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#37D6A3', letterSpacing: '0.06em' }}>
                  TERRAIN VULNERABILITY
                </span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '8px' }}>
                Himalayan Slope Precipitation Spikes
              </h4>
              <p style={{ fontSize: '0.86rem', color: '#A6B4C8', lineHeight: 1.6, marginBottom: '14px' }}>
                High-altitude localized rainfall bursts reduce slope stability in fractured mountain valleys, demanding micro-catchment monitoring.
              </p>
              <div style={{ fontSize: '0.75rem', color: '#7E8EA6', fontFamily: "'JetBrains Mono', monospace" }}>
                Signal: +4.8 mm/day rainfall intensity departure
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REGIONAL CASE STUDIES SECTION */}
      <section style={styles.regionalSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span className="badge badge-cyan" style={{ marginBottom: '14px' }}>
              <Compass size={12} />
              Geographic Focus
            </span>
            <h2 style={styles.sectionTitle}>
              Environmental Change Is Not the Same Everywhere.
            </h2>
            <p style={styles.sectionSubtitle}>
              Explore how environmental signals manifest across four distinct ecological and topographical landscapes in South Asia.
            </p>
          </div>

          <div style={styles.regionalGrid}>
            {regionalStories.map((region) => (
              <div key={region.id} style={styles.regionCard} className="glass-panel">
                {/* Visual Satellite Image */}
                <div style={styles.regionImageWrapper}>
                  <img
                    src={region.image}
                    alt={`${region.country} aerial earth observation satellite perspective`}
                    style={styles.regionImage}
                  />
                  <div style={styles.regionImageGradient} />
                  <span style={{ ...styles.regionTagBadge, color: region.accentColor }}>
                    {region.tag}
                  </span>
                </div>

                {/* Content */}
                <div style={styles.regionContent}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <h3 style={styles.regionCountry}>{region.country}</h3>
                    <span style={{ fontSize: '0.72rem', color: region.accentColor, fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" }}>
                      {region.metric}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', fontWeight: '600', color: '#F4F7FB', marginBottom: '10px' }}>
                    {region.focus}
                  </div>

                  <p style={styles.regionSummary}>
                    {region.summary}
                  </p>

                  <div style={styles.regionFooter}>
                    <span style={{ fontSize: '0.68rem', color: '#7E8EA6', fontFamily: "'JetBrains Mono', monospace" }}>
                      {region.sensor}
                    </span>

                    <button
                      onClick={() => handleExploreRegion(region.id)}
                      style={{
                        ...styles.regionBtn,
                        color: region.accentColor,
                        borderColor: `${region.accentColor}40`,
                      }}
                      aria-label={`Explore environmental evidence for ${region.country}`}
                    >
                      <span>Explore Region</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LIVE DASHBOARD PRODUCT PREVIEW SECTION */}
      <section style={styles.productPreviewSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span className="badge badge-cyan" style={{ marginBottom: '14px' }}>
              <Sliders size={12} />
              Platform Demonstration
            </span>
            <h2 style={styles.sectionTitle}>
              Interactive Environmental Intelligence Dashboard
            </h2>
            <p style={styles.sectionSubtitle}>
              Automatic historical comparisons, statistical trend analysis, and human-centered signal interpretation built for decision-makers and communities.
            </p>
          </div>

          {/* Interactive Live Dashboard Preview Box */}
          <div style={styles.productPreviewCard} className="glass-panel">
            {/* Top Bar Controls Preview */}
            <div style={styles.previewTopBar}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={styles.macDotRed} />
                <span style={styles.macDotYellow} />
                <span style={styles.macDotGreen} />
                <span style={{ fontSize: '0.75rem', color: '#A6B4C8', marginLeft: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
                  South Asia Environmental Intelligence System · Trends & Diagnostics
                </span>
              </div>

              {/* Variable Toggles */}
              <div style={styles.varToggleGroup}>
                {[
                  { id: 'rainfall', label: 'Precipitation' },
                  { id: 'temp', label: 'Temperature' },
                  { id: 'soil', label: 'Soil Moisture' },
                ].map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setPreviewVar(v.id)}
                    style={{
                      ...styles.varToggleBtn,
                      ...(previewVar === v.id ? styles.varToggleBtnActive : {}),
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inner Dashboard Demonstration Body */}
            <div style={styles.previewBody}>
              {/* Left Column: Then vs Now Live Comparison Card */}
              <div style={styles.comparisonPreviewCard}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#55D6FF', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  AUTOMATIC COMPARISON: THEN VS. NOW
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '4px' }}>
                  {previewData[previewVar].title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#A6B4C8', marginBottom: '18px' }}>
                  {previewData[previewVar].desc}
                </p>

                <div style={styles.previewStatGrid}>
                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>10-Year Baseline (2014–2023)</div>
                    <div style={styles.statNum}>{previewData[previewVar].historic}</div>
                  </div>
                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>Recent Observation (2024–2025)</div>
                    <div style={{ ...styles.statNum, color: previewData[previewVar].color }}>
                      {previewData[previewVar].recent}
                    </div>
                  </div>
                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>Measured Anomaly</div>
                    <div style={{ ...styles.statNum, color: '#37D6A3' }}>
                      {previewData[previewVar].change}
                    </div>
                  </div>
                  <div style={styles.statBox}>
                    <div style={styles.statLabel}>Trend Classification</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#F4F7FB' }}>
                      {previewData[previewVar].trend}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: 4-Pillar Interpretation Preview */}
              <div style={styles.interpretationPreviewCard}>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: '#37D6A3', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  DIAGNOSTIC ENGINE: WHAT DO THESE SIGNALS MEAN?
                </div>

                <div style={styles.pillarItem}>
                  <div style={styles.pillarHeader}>
                    <CheckCircle2 size={13} color="#55D6FF" />
                    <span>WHAT IS CHANGING?</span>
                  </div>
                  <p style={styles.pillarText}>
                    Empirical data indicates persistent positive departures in {previewData[previewVar].title.toLowerCase()} across target basins.
                  </p>
                </div>

                <div style={styles.pillarItem}>
                  <div style={styles.pillarHeader}>
                    <CheckCircle2 size={13} color="#FFBF69" />
                    <span>WHY MIGHT IT MATTER?</span>
                  </div>
                  <p style={styles.pillarText}>
                    Altered moisture regimes impact crop sowing calendars, infrastructure drainage capacity, and seasonal flood containment.
                  </p>
                </div>

                <div style={styles.pillarItem}>
                  <div style={styles.pillarHeader}>
                    <CheckCircle2 size={13} color="#37D6A3" />
                    <span>WHAT SHOULD WE MONITOR?</span>
                  </div>
                  <p style={styles.pillarText}>
                    Track multi-day antecedent soil saturation paired with high-frequency GPM IMERG rainfall accumulation rates.
                  </p>
                </div>

                <div style={styles.pillarItem}>
                  <div style={styles.pillarHeader}>
                    <CheckCircle2 size={13} color="#55D6FF" />
                    <span>HOW CAN WE PREPARE?</span>
                  </div>
                  <p style={styles.pillarText}>
                    Pre-position community flood barriers, inspect canal drainage sluices, and align agricultural guidance with seasonal trends.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div style={styles.previewBottomBar}>
              <span style={{ fontSize: '0.85rem', color: '#A6B4C8' }}>
                Full interactive South Asia map, historical charts, and dataset inspector are available in the dashboard.
              </span>
              <button
                className="btn-primary"
                onClick={() => setActiveTab('explore')}
                style={{ padding: '10px 24px', fontSize: '0.88rem' }}
                aria-label="Launch Full Environmental Trends Dashboard"
              >
                <span>Explore Environmental Trends</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW THE SYSTEM WORKS (4-STAGE PIPELINE) */}
      <section style={styles.howItWorksSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span className="badge badge-cyan" style={{ marginBottom: '14px' }}>
              <Activity size={12} />
              Scientific Pipeline
            </span>
            <h2 style={styles.sectionTitle}>
              How Earth’s Hidden Signals Works
            </h2>
            <p style={styles.sectionSubtitle}>
              A transparent 4-stage framework converting multi-mission satellite telemetry into accessible, understandable, evidence-based preparedness intelligence.
            </p>
          </div>

          <div style={styles.processGridFour}>
            {[
              {
                step: '01',
                tag: 'DATA',
                title: 'NASA / Scientific Data',
                desc: 'Ingesting multi-decadal satellite observations from NASA GISTEMP, GPCP/IMERG, SMAP L4, and MODIS NDVI spanning 44 continuous years (1981–2025).',
                color: '#55D6FF',
              },
              {
                step: '02',
                tag: 'TRENDS',
                title: 'Trend Analysis',
                desc: 'Applying non-parametric Mann–Kendall monotonic tests and Sen’s slope rate estimators to identify genuine long-term trajectories versus short-term weather noise.',
                color: '#37D6A3',
              },
              {
                step: '03',
                tag: 'REGIONS',
                title: 'Regional Interpretation',
                desc: 'Connecting measured atmospheric and hydrological trends to specific regional topographies, river basins, slope geologies, and ecosystems across South Asia.',
                color: '#FFBF69',
              },
              {
                step: '04',
                tag: 'ACTION',
                title: 'Evidence-Based Preparedness',
                desc: 'Translating verified environmental findings into actionable monitoring priorities for communities, agriculture, health workers, and emergency responders.',
                color: '#818CF8',
              },
            ].map((stage, i) => (
              <div
                key={i}
                style={{ ...styles.processCard, borderTopColor: stage.color }}
                className="glass-panel"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div
                    style={{
                      ...styles.stepNumber,
                      color: stage.color,
                      borderColor: stage.color,
                      background: `${stage.color}15`,
                    }}
                  >
                    {stage.step}
                  </div>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      color: stage.color,
                      letterSpacing: '0.1em',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {stage.tag}
                  </span>
                </div>
                <h3 style={styles.stageTitle}>{stage.title}</h3>
                <p style={styles.stageDesc}>{stage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PREPAREDNESS PREVIEW */}
      <section style={styles.preparednessSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span className="badge badge-cyan" style={{ marginBottom: '14px' }}>
              <ShieldCheck size={12} />
              Actionable Guidance
            </span>
            <h2 style={styles.sectionTitle}>
              Knowledge Is the First Step Toward Preparedness
            </h2>
            <p style={styles.sectionSubtitle}>
              Empowering communities, agricultural planners, and disaster responders with verified environmental context.
            </p>
          </div>

          <div style={styles.prepGrid}>
            {[
              {
                q: 'What is Changing?',
                color: '#55D6FF',
                items: [
                  'Long-term warming of land surface temperatures',
                  'Concentration of seasonal rainfall into intense bursts',
                  'Elevated antecedent soil moisture ahead of peak monsoons',
                ],
              },
              {
                q: 'What Should We Monitor?',
                color: '#37D6A3',
                items: [
                  'Multi-day cumulative precipitation thresholds',
                  'Slope saturation levels in vulnerable Himalayan valleys',
                  'Thermal anomalies in dry forest corridors during heat spells',
                ],
              },
              {
                q: 'How Can We Prepare?',
                color: '#FFBF69',
                items: [
                  'Pre-position emergency flood supplies and water purification',
                  'Adjust crop planting dates according to moisture regimes',
                  'Strengthen local embankment and drainage inspection routines',
                ],
              },
            ].map((card, i) => (
              <div key={i} style={styles.prepCard} className="glass-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: card.color,
                      boxShadow: `0 0 8px ${card.color}`,
                    }}
                  />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF' }}>
                    {card.q}
                  </h3>
                </div>
                <ul style={styles.prepList}>
                  {card.items.map((item, j) => (
                    <li key={j} style={styles.prepListItem}>
                      <span style={{ color: card.color, fontWeight: '700' }}>›</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DATA TRANSPARENCY SOURCES */}
      <section style={styles.sourcesSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <span className="badge badge-cyan" style={{ marginBottom: '14px' }}>
              <Database size={12} />
              Open Data Architecture
            </span>
            <h2 style={styles.sectionTitle}>
              Verified NASA & Open Earth Science Sources
            </h2>
            <p style={styles.sectionSubtitle}>
              Built upon publicly accessible, peer-reviewed satellite observations and reanalysis models.
            </p>
          </div>

          <div style={styles.sourcesGrid}>
            {NASA_DATA_SOURCES.map((source, i) => (
              <div key={i} style={styles.sourceCard} className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={styles.sourceName}>{source.name}</span>
                  <Database size={14} color="#55D6FF" />
                </div>
                <div style={styles.sourceFullName}>{source.fullName}</div>
                <p style={styles.sourceDesc}>{source.description}</p>
                <div style={styles.sourceMeta}>
                  <span>Resolution: {source.resolution}</span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.sourceLink}
                  >
                    <span>Source</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. HOMEPAGE CLOSING SECTION */}
      <section style={styles.closingSection}>
        <div className="container">
          <div style={styles.closingCard} className="glass-panel">
            <h2 style={styles.closingHeadline}>
              Understand the Change. Strengthen Preparedness.
            </h2>
            <p style={styles.closingDesc}>
              We cannot predict every disaster. But understanding environmental change can help us ask better questions, monitor important signals, and prepare more intelligently.
            </p>
            <div style={styles.closingQuote}>
              “One warming planet. Different regional responses. Better-informed preparedness.”
            </div>
            <button
              className="btn-primary"
              onClick={() => setActiveTab('explore')}
              style={{ fontSize: '1rem', padding: '14px 36px', marginTop: '28px' }}
              aria-label="Explore Environmental Intelligence Dashboard"
            >
              <span>Explore the Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Signal Story Modal */}
      {storyModalOpen && <SignalStoryModal onClose={() => setStoryModalOpen(false)} />}
    </div>
  );
}

const styles = {
  credibilityStrip: {
    background: 'rgba(8, 13, 27, 0.95)',
    borderTop: '1px solid rgba(85, 214, 255, 0.12)',
    borderBottom: '1px solid rgba(38, 54, 75, 0.6)',
    padding: '16px 0',
  },
  stripContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '32px',
    flexWrap: 'wrap',
  },
  stripItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stripText: {
    fontSize: '0.74rem',
    fontWeight: '600',
    color: '#A6B4C8',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.04em',
  },
  editorialSection: {
    padding: '90px 0 70px 0',
    background: '#050816',
  },
  sectionHeader: {
    textAlign: 'center',
    maxWidth: '740px',
    margin: '0 auto 50px auto',
  },
  sectionTitle: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: '-0.03em',
    lineHeight: 1.15,
    marginBottom: '14px',
  },
  sectionSubtitle: {
    fontSize: '0.98rem',
    color: '#A6B4C8',
    lineHeight: 1.65,
  },
  editorialGrid: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 1fr',
    gap: '24px',
  },
  featureStoryCard: {
    gridRow: 'span 2',
    padding: '36px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  featurePill: {
    fontSize: '0.68rem',
    fontWeight: '800',
    color: '#55D6FF',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.08em',
  },
  featureHeadline: {
    fontSize: '1.45rem',
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 1.3,
    marginBottom: '14px',
  },
  featureText: {
    fontSize: '0.94rem',
    color: '#A6B4C8',
    lineHeight: 1.7,
    marginBottom: '28px',
  },
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(38, 54, 75, 0.6)',
  },
  metricBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  metricLabel: {
    fontSize: '0.68rem',
    color: '#7E8EA6',
    fontFamily: "'JetBrains Mono', monospace",
  },
  metricValue: {
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#FFFFFF',
  },
  supportingCard: {
    padding: '24px',
    borderRadius: '16px',
  },
  iconBox: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: 'rgba(255,100,124,0.1)',
    border: '1px solid rgba(255,100,124,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  regionalSection: {
    padding: '80px 0',
    background: '#080D1B',
  },
  regionalGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
    gap: '22px',
  },
  regionCard: {
    borderRadius: '16px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  regionImageWrapper: {
    position: 'relative',
    height: '180px',
    width: '100%',
    overflow: 'hidden',
  },
  regionImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  regionImageGradient: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to top, rgba(13, 21, 39, 1) 0%, rgba(13, 21, 39, 0.3) 60%, transparent 100%)',
  },
  regionTagBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    background: 'rgba(13, 21, 39, 0.85)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    padding: '3px 8px',
    fontSize: '0.68rem',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
  },
  regionContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'space-between',
  },
  regionCountry: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  regionSummary: {
    fontSize: '0.86rem',
    color: '#A6B4C8',
    lineHeight: 1.6,
    marginBottom: '18px',
  },
  regionFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '14px',
    borderTop: '1px solid rgba(38, 54, 75, 0.5)',
  },
  regionBtn: {
    background: 'transparent',
    border: '1px solid',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.15s ease',
  },
  productPreviewSection: {
    padding: '90px 0',
    background: '#050816',
  },
  productPreviewCard: {
    borderRadius: '18px',
    overflow: 'hidden',
    border: '1px solid rgba(85, 214, 255, 0.2)',
  },
  previewTopBar: {
    background: 'rgba(8, 13, 27, 0.95)',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(38, 54, 75, 0.6)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  macDotRed: { width: '10px', height: '10px', borderRadius: '50%', background: '#FF647C', display: 'inline-block' },
  macDotYellow: { width: '10px', height: '10px', borderRadius: '50%', background: '#FFBF69', display: 'inline-block', marginLeft: '6px' },
  macDotGreen: { width: '10px', height: '10px', borderRadius: '50%', background: '#37D6A3', display: 'inline-block', marginLeft: '6px' },
  varToggleGroup: {
    display: 'flex',
    gap: '6px',
  },
  varToggleBtn: {
    background: 'transparent',
    border: '1px solid rgba(38, 54, 75, 0.8)',
    color: '#7E8EA6',
    borderRadius: '6px',
    padding: '5px 12px',
    fontSize: '0.76rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  varToggleBtnActive: {
    background: 'rgba(85, 214, 255, 0.12)',
    borderColor: '#55D6FF',
    color: '#55D6FF',
  },
  previewBody: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '20px',
    padding: '24px',
    background: 'rgba(13, 21, 39, 0.5)',
  },
  comparisonPreviewCard: {
    background: 'rgba(17, 29, 50, 0.8)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(38, 54, 75, 0.7)',
  },
  previewStatGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  statBox: {
    background: 'rgba(8, 13, 27, 0.7)',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid rgba(38, 54, 75, 0.5)',
  },
  statLabel: {
    fontSize: '0.68rem',
    color: '#7E8EA6',
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: '4px',
  },
  statNum: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  interpretationPreviewCard: {
    background: 'rgba(17, 29, 50, 0.8)',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid rgba(38, 54, 75, 0.7)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  pillarItem: {
    background: 'rgba(8, 13, 27, 0.5)',
    padding: '10px 12px',
    borderRadius: '8px',
  },
  pillarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '4px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  pillarText: {
    fontSize: '0.82rem',
    color: '#A6B4C8',
    lineHeight: 1.5,
    margin: 0,
  },
  previewBottomBar: {
    background: 'rgba(8, 13, 27, 0.95)',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTop: '1px solid rgba(38, 54, 75, 0.6)',
    flexWrap: 'wrap',
    gap: '14px',
  },
  howItWorksSection: {
    padding: '90px 0',
    background: '#080D1B',
  },
  processGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
  },
  processGridFour: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  processCard: {
    padding: '28px',
    borderRadius: '16px',
    borderTop: '3px solid',
  },
  stepNumber: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: '800',
    fontFamily: "'JetBrains Mono', monospace",
  },
  stageTitle: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: '10px',
  },
  stageDesc: {
    fontSize: '0.9rem',
    color: '#A6B4C8',
    lineHeight: 1.65,
  },
  preparednessSection: {
    padding: '90px 0',
    background: '#050816',
  },
  prepGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '22px',
  },
  prepCard: {
    padding: '28px',
    borderRadius: '16px',
  },
  prepList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: 0,
    margin: 0,
  },
  prepListItem: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    fontSize: '0.86rem',
    color: '#A6B4C8',
    lineHeight: 1.5,
  },
  sourcesSection: {
    padding: '80px 0',
    background: '#080D1B',
  },
  sourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '18px',
  },
  sourceCard: {
    padding: '22px',
    borderRadius: '14px',
  },
  sourceName: {
    fontSize: '1rem',
    fontWeight: '800',
    color: '#FFFFFF',
  },
  sourceFullName: {
    fontSize: '0.72rem',
    color: '#55D6FF',
    marginBottom: '10px',
    fontFamily: "'JetBrains Mono', monospace",
  },
  sourceDesc: {
    fontSize: '0.84rem',
    color: '#7E8EA6',
    lineHeight: 1.55,
    marginBottom: '14px',
  },
  sourceMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.74rem',
    color: '#4F637A',
    borderTop: '1px solid rgba(38, 54, 75, 0.6)',
    paddingTop: '12px',
  },
  sourceLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#55D6FF',
    textDecoration: 'none',
    fontSize: '0.74rem',
  },
  closingSection: {
    padding: '90px 0',
    background: '#050816',
  },
  closingCard: {
    padding: '60px 36px',
    textAlign: 'center',
    borderRadius: '20px',
    maxWidth: '820px',
    margin: '0 auto',
    border: '1px solid rgba(85, 214, 255, 0.2)',
  },
  closingHeadline: {
    fontSize: 'clamp(1.8rem, 3.6vw, 2.5rem)',
    fontWeight: '800',
    marginBottom: '16px',
    letterSpacing: '-0.03em',
    color: '#FFFFFF',
  },
  closingDesc: {
    fontSize: '1rem',
    color: '#A6B4C8',
    lineHeight: 1.7,
    marginBottom: '20px',
    maxWidth: '600px',
    margin: '0 auto 20px auto',
  },
  closingQuote: {
    fontSize: '0.9rem',
    fontStyle: 'italic',
    color: '#55D6FF',
    maxWidth: '480px',
    margin: '0 auto',
  },
};
