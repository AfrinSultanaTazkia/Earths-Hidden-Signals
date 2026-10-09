import React, { useState } from 'react';
import { BookOpen, Calendar, MapPin, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function CaseStudies({ selectedRegionId }) {
  const [activeCase, setActiveCase] = useState(selectedRegionId || 'bangladesh');

  const cases = [
    {
      id: 'bangladesh',
      country: 'Bangladesh',
      flag: '🇧🇩',
      title: 'Jamuna-Padma River Basin Inundation Signals',
      subtitle: 'Long-term hydrological volume accumulation in deltaic basins',
      signalSummary: 'Precipitation intensity increases (+14.6 mm/yr) paired with root-zone soil saturation expansion.',
      timelineEvents: [
        { year: '1998', note: 'Unprecedented 68% land area standing water inundation following upstream rain surges.' },
        { year: '2007', note: 'Dual monsoon surge events affecting haor wetlands and agricultural plains.' },
        { year: '2020', note: 'Extended 35-day river inundation window during pandemic emergency response.' },
        { year: '2024', note: 'Eastern basin high-intensity runoff surge challenging embankment stability.' }
      ],
      associatedVariables: [
        { name: 'Annual Precipitation', val: '+14.6 mm / yr', trend: 'Statistically Significant (p < 0.005)' },
        { name: 'Surface Water Area', val: '+68.4 km² / yr', trend: 'Expanding Monsoon Extent' },
        { name: 'Soil Moisture', val: '+0.11 % / yr', trend: 'High Root-Zone Saturation' }
      ],
      humanImpact: 'Impacts agricultural planting calendars, riverbank erosion stability, and coastal embankment resilience across 18 high-density deltaic districts.',
      whatToMonitor: [
        'Upstream transboundary river discharge velocities during monsoon peak (July–Sept)',
        'Sustained 5-day cumulative rainfall thresholds exceeding 250 mm',
        'Embankment seepage and soil saturation levels in low-lying char areas'
      ],
      preparednessConsiderations: [
        'Reinforce riverbank embankment zones with bio-engineered slope vegetation',
        'Elevate community seed banks and livestock shelters above 100-yr flood stage levels',
        'Deploy automated river stage radar sensors feeding local mobile notification channels'
      ]
    },
    {
      id: 'nepal',
      country: 'Nepal',
      flag: '🇳🇵',
      title: 'Koshi Basin High-Altitude Slope Saturation',
      subtitle: 'Mountain slope destabilization under extreme rain bursts',
      signalSummary: 'Localized heavy rainfall spikes (+18.2 mm/yr bursts) hitting steep topography with saturated soil layers.',
      timelineEvents: [
        { year: '2015', note: 'Post-seismic monsoonal rains triggering widespread slope mass movement along hill roads.' },
        { year: '2021', note: 'Melamchi flash surge and debris flood following high-altitude cloudburst.' },
        { year: '2023', note: 'Eastern hill corridor slope detachment blocking highway transport links.' }
      ],
      associatedVariables: [
        { name: 'Rainfall Burst Intensity', val: '+18.2 mm / yr', trend: 'Significant Extreme Spikes (p < 0.01)' },
        { name: 'Antecedent Soil Moisture', val: 'High Saturation', trend: 'Deep Soil Moisture Accumulation' },
        { name: 'Vegetation Canopy (NDVI)', val: '-0.0018 / yr', trend: 'Localized Canopy Loss' }
      ],
      humanImpact: 'Threatens mountain highway corridors, hydroelectric infrastructure, and remote hill settlements during peak monsoonal rain windows.',
      whatToMonitor: [
        'Continuous 24-hour localized rainfall accumulation exceeding 150 mm on steep slopes',
        'Deep soil moisture saturation levels along highway cut slopes and river gorges',
        'Early signs of topsoil cracking or small slope creep in vulnerable villages'
      ],
      preparednessConsiderations: [
        'Install low-cost slope movement sensors and automated rain gauges in high-risk hill corridors',
        'Enforce bio-engineering slope stabilization (vetiver planting, terracing, retaining walls)',
        'Maintain pre-positioned heavy road-clearing machinery near critical mountain highway passes'
      ]
    },
    {
      id: 'india',
      country: 'India',
      flag: '🇮🇳',
      title: 'Western Ghats & Central Forest Thermal Anomaly',
      subtitle: 'Warming land surface temperatures and dry biomass fire signals',
      signalSummary: 'Sustained land surface warming (+0.042 °C/yr) coupled with root-zone soil moisture deficits.',
      timelineEvents: [
        { year: '2016', note: 'Simlipal & Uttarakhand forest fire clusters during pre-monsoon heatwave.' },
        { year: '2019', note: 'Bandipur tiger reserve dry-spell fire event consuming 10,000+ forest acres.' },
        { year: '2021', note: 'Elevated thermal hotspot cluster density across central deciduous forests.' },
        { year: '2024', note: 'Pre-monsoon heat dome accelerating forest litter fuel drying.' }
      ],
      associatedVariables: [
        { name: 'Land Surface Temp', val: '+0.042 °C / yr', trend: 'Significant Warming (p < 0.001)' },
        { name: 'Thermal Hotspots (FIRMS)', val: '+28.5 / yr', trend: 'Increasing Dry-Spell Hotspots' },
        { name: 'Root-Zone Moisture', val: '-0.14 % / yr', trend: 'Consistent Moisture Deficit' }
      ],
      humanImpact: 'Affects forest biodiversity corridors, tribal forest communities, timber reserves, and regional air quality during dry spring months.',
      whatToMonitor: [
        'MODIS/VIIRS thermal hotspot pixel alerts updated 3-hourly via satellite feeds',
        'Consecutive dry days exceeding 35°C surface temperature in forest reserves',
        'Moisture content of ground forest litter and understory dry brush'
      ],
      preparednessConsiderations: [
        'Clear strategic forest firebreaks and maintain water storage tanks before summer dry season',
        'Equip forest ranger units with real-time mobile satellite hotspot alert mapping tools',
        'Engage forest-adjacent village committees in controlled burn management and reporting'
      ]
    },
    {
      id: 'pakistan',
      country: 'Pakistan',
      flag: '🇵🇰',
      title: 'Lower Indus Basin Monsoonal Surge & Arid Shift',
      subtitle: 'Thermal contrast driving concentrated moisture surges and agricultural droughts',
      signalSummary: 'High land surface heat variance paired with concentrated atmospheric moisture surges.',
      timelineEvents: [
        { year: '2010', note: 'Historic Indus river inundation surge affecting 20 million residents.' },
        { year: '2018–21', note: 'Extended agricultural drought in Thar Desert and lower canal networks.' },
        { year: '2022', note: 'Record monsoon atmospheric surge inundating 1/3 of nation’s land area.' }
      ],
      associatedVariables: [
        { name: 'Precipitation Surges', val: 'High Spikes', trend: 'Extreme Inter-annual Variance' },
        { name: 'Land Surface Temp', val: '+0.048 °C / yr', trend: 'Elevated Thermal Contrast' },
        { name: 'Inundated Area', val: '+45.2 km² / yr', trend: 'Basin Runoff Expansion' }
      ],
      humanImpact: 'Challenges agricultural canal management, cotton and wheat crop yields, and urban drainage resilience in Sindh and Punjab provinces.',
      whatToMonitor: [
        'Atmospheric moisture transport trajectories from Arabian Sea monsoon low-pressure systems',
        'Indus river barrage water discharge volumes and canal head gates',
        'Soil moisture depletion in arid rain-fed farming belts during sowing windows'
      ],
      preparednessConsiderations: [
        'Upgrade canal control gates and barrage flood-spillway capacities for extreme surges',
        'Promote drought-tolerant crop seed distribution for rain-fed agricultural zones',
        'Strengthen community early-warning loudspeaker and SMS channels in river villages'
      ]
    }
  ];

  const currentCase = cases.find(c => c.id === activeCase) || cases[0];

  return (
    <div style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <div className="container">
        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            <BookOpen size={12} />
            REGIONAL DEEP DIVES
          </div>
          <h1 style={styles.pageTitle}>Case Studies: Signals to Context</h1>
          <p style={styles.pageSub}>
            Detailed analysis connecting multi-decadal NASA satellite observations, historical event evidence, and actionable community preparedness considerations.
          </p>
        </div>

        {/* Case Study Selection Buttons */}
        <div style={styles.caseTabRow}>
          {cases.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCase(c.id)}
              style={{
                ...styles.caseTabBtn,
                ...(activeCase === c.id ? styles.caseTabBtnActive : {})
              }}
            >
              <span>{c.flag}</span>
              <span>{c.country} Case Study</span>
            </button>
          ))}
        </div>

        {/* Main Case Study Display Box */}
        <div style={styles.caseMainCard} className="glass-panel glass-panel-glow">
          {/* Banner */}
          <div style={styles.caseHeader}>
            <div>
              <span className="badge badge-cyan">{currentCase.flag} {currentCase.country}</span>
              <h2 style={styles.caseTitle}>{currentCase.title}</h2>
              <div style={styles.caseSubtitle}>{currentCase.subtitle}</div>
            </div>
          </div>

          {/* Associated Satellite Variables Grid */}
          <div style={styles.varsRow}>
            {currentCase.associatedVariables.map((v, i) => (
              <div key={i} style={styles.varCard}>
                <div style={styles.varName}>{v.name}</div>
                <div style={styles.varVal} className="mono">{v.val}</div>
                <div style={styles.varTrend}>{v.trend}</div>
              </div>
            ))}
          </div>

          {/* Historical Timeline Events */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={styles.sectionHeading}>
              <Calendar size={18} color="var(--color-cyan)" />
              <span>Documented Historical Event Timeline</span>
            </h3>

            <div style={styles.timelineList}>
              {currentCase.timelineEvents.map((e, idx) => (
                <div key={idx} style={styles.timelineItem}>
                  <div style={styles.yearBox} className="mono">{e.year}</div>
                  <div style={styles.noteText}>{e.note}</div>
                </div>
              ))}
            </div>

            <div style={styles.causationNotice}>
              <AlertCircle size={14} color="var(--color-amber)" style={{ flexShrink: 0 }} />
              <span>
                <strong>Scientific Attribution Note:</strong> Environmental signals represent associated background conditions observed around historical events. They are framed as risk-relevant evidence, not direct causal claims.
              </span>
            </div>
          </div>

          {/* Human & Ecosystem Impact */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={styles.sectionHeading}>
              <MapPin size={18} color="var(--color-amber)" />
              <span>Human & Ecosystem Context</span>
            </h3>
            <p style={styles.paragraphText}>{currentCase.humanImpact}</p>
          </div>

          {/* Two Column Grid: What to Monitor vs Preparedness Considerations */}
          <div style={styles.twoColGrid}>
            <div style={styles.colCard}>
              <div style={styles.colHeader}>
                <AlertCircle size={18} color="var(--color-cyan)" />
                <h4 style={{ color: '#FFF', fontSize: '1rem' }}>What Should Be Monitored?</h4>
              </div>
              <ul style={styles.checkList}>
                {currentCase.whatToMonitor.map((item, i) => (
                  <li key={i} style={styles.checkItem}>
                    <span style={{ color: 'var(--color-cyan)', fontWeight: '700' }}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={styles.colCard}>
              <div style={styles.colHeader}>
                <ShieldCheck size={18} color="var(--color-green)" />
                <h4 style={{ color: '#FFF', fontSize: '1rem' }}>Preparedness Considerations</h4>
              </div>
              <ul style={styles.checkList}>
                {currentCase.preparednessConsiderations.map((item, i) => (
                  <li key={i} style={styles.checkItem}>
                    <span style={{ color: 'var(--color-green)', fontWeight: '700' }}>✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '2.2rem',
    marginBottom: '6px'
  },
  pageSub: {
    fontSize: '1rem',
    color: 'var(--text-muted)'
  },
  caseTabRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  caseTabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-subtle)',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '600',
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  caseTabBtnActive: {
    background: 'var(--color-cyan-glow)',
    color: '#FFF',
    borderColor: 'var(--color-cyan)'
  },
  caseMainCard: {
    padding: '36px',
    borderRadius: 'var(--radius-lg)'
  },
  caseHeader: {
    marginBottom: '24px'
  },
  caseTitle: {
    fontSize: '1.8rem',
    fontWeight: '800',
    marginTop: '6px'
  },
  caseSubtitle: {
    fontSize: '0.95rem',
    color: 'var(--color-cyan)',
    marginTop: '4px'
  },
  varsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '30px'
  },
  varCard: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '16px'
  },
  varName: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
  },
  varVal: {
    fontSize: '1.2rem',
    fontWeight: '700',
    color: '#FFF',
    marginTop: '4px'
  },
  varTrend: {
    fontSize: '0.75rem',
    color: 'var(--color-cyan)',
    marginTop: '2px'
  },
  sectionHeading: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '1.15rem',
    marginBottom: '16px',
    color: '#FFF'
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '14px'
  },
  timelineItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '8px',
    padding: '12px 16px'
  },
  yearBox: {
    background: 'var(--color-cyan-glow)',
    color: 'var(--color-cyan)',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '700'
  },
  noteText: {
    fontSize: '0.88rem',
    color: 'var(--text-muted)'
  },
  causationNotice: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    background: 'rgba(245, 158, 11, 0.05)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: '6px',
    padding: '8px 12px'
  },
  paragraphText: {
    fontSize: '0.95rem',
    color: 'var(--text-muted)',
    lineHeight: 1.6
  },
  twoColGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  },
  colCard: {
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    padding: '20px'
  },
  colHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '14px'
  },
  checkList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  checkItem: {
    display: 'flex',
    gap: '10px',
    fontSize: '0.88rem',
    color: 'var(--text-muted)',
    lineHeight: 1.4
  }
};
