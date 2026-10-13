import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
  Legend
} from 'recharts';
import { GET_TREND_SUMMARY, GENERATE_HISTORICAL_DATA } from '../data/earthSignalsData';
import { Info, Database } from 'lucide-react';

export default function TrendChart({ data, regionId, variableId, variableName, unit }) {
  const [showFullRange, setShowFullRange] = useState(true);
  const trendSummary = GET_TREND_SUMMARY(regionId, variableId);

  // Use correct period depending on variable
  const isSMAP = variableId === 'soil_moisture';
  const fullPeriodLabel = isSMAP ? '2015–2025 (SMAP)' : '2001–2025';
  const recentPeriodLabel = isSMAP ? '2020–2025' : '2015–2025';

  // Filter data appropriately
  const recentStartYear = isSMAP ? 2020 : 2015;
  const chartData = showFullRange ? data : data.filter(d => d.year >= recentStartYear);

  // Compute reference baseline (first half of data)
  const baselineData = data.filter(d => d.year <= (isSMAP ? 2019 : 2012));
  const baselineAvg = baselineData.length > 0
    ? (baselineData.reduce((s, d) => s + d.value, 0) / baselineData.length)
    : null;

  // Compute recent 5-year average
  const recentData = data.filter(d => d.year >= (isSMAP ? 2022 : 2021));
  const recentAvg = recentData.length > 0
    ? (recentData.reduce((s, d) => s + d.value, 0) / recentData.length)
    : null;

  // Determine the unit abbreviation for Y-axis
  const unitAbbr = unit?.split(' ')[0] || unit || '';

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div style={styles.tooltipBox}>
          <div style={styles.tooltipYear}>{label}</div>
          {payload.map((p, i) => (
            p.dataKey === 'value' ? (
              <div key={i} style={{ fontSize: '0.8rem', color: 'var(--color-cyan)', marginTop: '2px' }}>
                Observed: <strong>{typeof p.value === 'number' ? p.value.toFixed(variableId === 'vegetation' || variableId === 'soil_moisture' ? 4 : 2) : '—'} {unitAbbr}</strong>
              </div>
            ) : p.dataKey === 'sensSlopeTrend' ? (
              <div key={i} style={{ fontSize: '0.8rem', color: 'var(--color-amber)', marginTop: '2px' }}>
                Sen's Slope trend: <strong>{typeof p.value === 'number' ? p.value.toFixed(variableId === 'vegetation' || variableId === 'soil_moisture' ? 4 : 2) : '—'} {unitAbbr}</strong>
              </div>
            ) : null
          ))}
          {item.isHistoricalEventYear && (
            <div style={styles.tooltipAlert}>⚠️ {item.eventNote}</div>
          )}
          <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            {item.dataSource || 'Modeled estimate'}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.chartCard} className="glass-panel">

      {/* Chart Header */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.chartTitle}>{variableName} — Long-Term Trend</div>
          <div style={styles.chartSubtitle}>
            <strong>{trendSummary.dataset}</strong>
            {' · '}
            Period: <strong>{trendSummary.samplePeriod || fullPeriodLabel}</strong>
            {' · '}
            <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
              Modeled regional estimates (see Data Note)
            </span>
          </div>
        </div>

        {/* Range Toggle */}
        <div style={styles.toggleGroup}>
          <button
            onClick={() => setShowFullRange(true)}
            style={{ ...styles.toggleBtn, ...(showFullRange ? styles.toggleBtnActive : {}) }}
          >
            {fullPeriodLabel}
          </button>
          <button
            onClick={() => setShowFullRange(false)}
            style={{ ...styles.toggleBtn, ...(!showFullRange ? styles.toggleBtnActive : {}) }}
          >
            {recentPeriodLabel}
          </button>
        </div>
      </div>

      {/* Significance Status Banner */}
      <div style={{
        ...styles.sigBanner,
        background: !trendSummary.isSignificant ? 'rgba(113,128,150,0.1)' : trendSummary.statusType === 'increasing' ? 'rgba(22,134,107,0.1)' : 'rgba(217,119,50,0.1)',
        borderColor: !trendSummary.isSignificant ? 'rgba(113,128,150,0.25)' : trendSummary.statusType === 'increasing' ? 'rgba(22,134,107,0.25)' : 'rgba(217,119,50,0.25)'
      }}>
        <span style={{ fontWeight: '700', color: !trendSummary.isSignificant ? '#718096' : trendSummary.statusType === 'increasing' ? '#16866B' : '#D97732' }}>
          {trendSummary.isSignificant ? (trendSummary.statusType === 'increasing' ? '📈 Significant Increasing' : '📉 Significant Decreasing') : (trendSummary.statusType === 'inconclusive' ? '❓ Inconclusive' : '➡️ No Significant Trend')}
        </span>
        {' · '}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
          Sen's Slope: {trendSummary.sensSlope || '—'}
        </span>
        {' · '}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: trendSummary.isSignificant ? '#16866B' : '#718096' }}>
          {trendSummary.pValueLabel || '—'}
        </span>
      </div>

      {/* Main Chart */}
      <div style={{ width: '100%', height: 300, marginTop: '12px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="year"
              stroke="var(--text-dim)"
              fontSize={11}
              tickLine={false}
              dy={8}
              interval={isSMAP ? 2 : 4}
            />
            <YAxis
              stroke="var(--text-dim)"
              fontSize={11}
              tickLine={false}
              tickFormatter={v => {
                if (variableId === 'vegetation' || variableId === 'soil_moisture') return v.toFixed(3);
                return v.toFixed(0);
              }}
              width={variableId === 'vegetation' || variableId === 'soil_moisture' ? 55 : 45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={28}
              wrapperStyle={{ color: 'var(--text-muted)', fontSize: '0.75rem', paddingBottom: '4px' }}
            />

            {/* Historical baseline reference line */}
            {baselineAvg !== null && showFullRange && (
              <ReferenceLine
                y={baselineAvg}
                stroke="rgba(255,255,255,0.25)"
                strokeDasharray="6 4"
                label={{ value: 'Baseline avg', position: 'insideTopRight', fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
              />
            )}

            {/* Observed values */}
            <Line
              type="monotone"
              dataKey="value"
              name={`Observed ${variableName}`}
              stroke="var(--color-cyan)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5, fill: '#FFFFFF', stroke: 'var(--color-cyan)', strokeWidth: 2 }}
            />

            {/* Sen's Slope trend line — only shown when data supports it */}
            {trendSummary.statusType !== 'inconclusive' && (
              <Line
                type="linear"
                dataKey="sensSlopeTrend"
                name="Sen's Slope Trend"
                stroke={trendSummary.isSignificant
                  ? (trendSummary.statusType === 'increasing' ? '#16866B' : '#D97732')
                  : 'rgba(113,128,150,0.6)'}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            )}

            {/* Historical event reference dots */}
            {chartData.filter(d => d.isHistoricalEventYear).map(d => (
              <ReferenceDot
                key={d.year}
                x={d.year}
                y={d.value}
                r={5}
                fill="var(--color-amber)"
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart legend */}
      <div style={styles.chartFooter}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: 'var(--color-cyan)' }} />
          <span>Observed (modeled regional estimate)</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{
            ...styles.legendDot,
            background: trendSummary.isSignificant
              ? (trendSummary.statusType === 'increasing' ? '#16866B' : '#D97732')
              : '#718096',
            borderRadius: 0, height: '2px', width: '14px'
          }} />
          <span>
            Sen's Slope Trend
            {!trendSummary.isSignificant ? ' (not statistically significant)' : ''}
          </span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: 'var(--color-amber)' }} />
          <span>Documented event year</span>
        </div>
      </div>

      {/* Then vs Now comparison */}
      {baselineAvg !== null && recentAvg !== null && (
        <div style={styles.thenNowBox}>
          <div style={styles.thenNowTitle}>Then vs. Now Comparison</div>
          <div style={styles.thenNowRow}>
            <div style={styles.thenNowItem}>
              <div style={styles.thenNowLabel}>
                {isSMAP ? 'Early Record (2015–2019)' : 'Early Period (2001–2012)'}
              </div>
              <div style={{ ...styles.thenNowVal, fontFamily: 'var(--font-mono)' }}>
                {baselineAvg.toFixed(variableId === 'vegetation' || variableId === 'soil_moisture' ? 4 : 1)} {unitAbbr}
              </div>
            </div>
            <div style={styles.thenNowArrow}>→</div>
            <div style={styles.thenNowItem}>
              <div style={styles.thenNowLabel}>
                {isSMAP ? 'Recent (2022–2025)' : 'Recent (2021–2025)'}
              </div>
              <div style={{ ...styles.thenNowVal, fontFamily: 'var(--font-mono)' }}>
                {recentAvg.toFixed(variableId === 'vegetation' || variableId === 'soil_moisture' ? 4 : 1)} {unitAbbr}
              </div>
            </div>
            <div style={styles.thenNowItem}>
              <div style={styles.thenNowLabel}>Difference</div>
              <div style={{
                ...styles.thenNowVal, fontFamily: 'var(--font-mono)',
                color: (recentAvg - baselineAvg) > 0 ? '#16866B' : '#D97732'
              }}>
                {(recentAvg - baselineAvg) >= 0 ? '+' : ''}
                {(recentAvg - baselineAvg).toFixed(variableId === 'vegetation' || variableId === 'soil_moisture' ? 4 : 1)} {unitAbbr}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '6px' }}>
            ℹ️ A difference between early and recent averages does not by itself establish a statistically significant trend.
            {' '}Refer to the Mann-Kendall result above.
          </div>
        </div>
      )}

      {/* Data Note */}
      <div style={styles.dataNoteBox}>
        <Database size={13} style={{ flexShrink: 0, color: 'var(--text-dim)', marginTop: '1px' }} />
        <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', lineHeight: 1.5 }}>
          <strong>Data Note:</strong> Time series values are modeled regional estimates derived from published trend rates
          ({trendSummary.dataset}). They are not direct API retrievals. Statistical results (Z-score, p-value) are
          derived from published peer-reviewed literature on South Asia climate trends.
          Spatial resolution: {trendSummary.spatialRes || 'see dataset documentation'}.
        </span>
      </div>
    </div>
  );
}

const styles = {
  chartCard: { padding: '20px', borderRadius: 'var(--radius-lg)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' },
  chartTitle: { fontSize: '1rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '2px' },
  chartSubtitle: { fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 },
  sigBanner: {
    marginTop: '12px', padding: '7px 14px', borderRadius: '8px',
    border: '1px solid', fontSize: '0.8rem', color: 'var(--text-secondary)',
    display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center'
  },
  toggleGroup: {
    display: 'flex', gap: '3px', background: 'rgba(0,0,0,0.3)',
    padding: '3px', borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)'
  },
  toggleBtn: {
    background: 'transparent', border: 'none', color: 'var(--text-muted)',
    fontSize: '0.74rem', fontWeight: '600', padding: '5px 10px',
    borderRadius: 'var(--radius-sm)', cursor: 'pointer', transition: 'all 0.2s',
    whiteSpace: 'nowrap'
  },
  toggleBtnActive: {
    background: 'var(--color-cyan-glow)', color: 'var(--color-cyan)',
    border: '1px solid var(--color-cyan)'
  },
  tooltipBox: {
    background: '#111827', border: '1px solid var(--border-glow)',
    borderRadius: '8px', padding: '10px 12px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
  },
  tooltipYear: { fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' },
  tooltipAlert: { fontSize: '0.74rem', color: 'var(--color-amber)', marginTop: '4px', fontWeight: '600' },
  chartFooter: {
    display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '12px',
    paddingTop: '10px', borderTop: '1px solid var(--border-subtle)',
    flexWrap: 'wrap', fontSize: '0.75rem', color: 'var(--text-muted)'
  },
  legendItem: { display: 'flex', alignItems: 'center', gap: '7px' },
  legendDot: { width: '10px', height: '10px', borderRadius: '50%', display: 'inline-block', flexShrink: 0 },
  thenNowBox: {
    marginTop: '14px', padding: '12px 14px',
    background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-subtle)',
    borderRadius: '10px'
  },
  thenNowTitle: { fontSize: '0.72rem', fontWeight: '700', color: 'var(--color-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' },
  thenNowRow: { display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' },
  thenNowItem: { flex: 1, minWidth: '100px' },
  thenNowLabel: { fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '3px' },
  thenNowVal: { fontSize: '0.96rem', fontWeight: '700', color: '#FFFFFF' },
  thenNowArrow: { fontSize: '1.2rem', color: 'var(--text-dim)', fontWeight: '700' },
  dataNoteBox: {
    marginTop: '10px', padding: '8px 10px',
    background: 'rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '6px', display: 'flex', gap: '8px', alignItems: 'flex-start'
  }
};
