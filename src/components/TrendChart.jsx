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
  Legend
} from 'recharts';
import { GET_TREND_SUMMARY } from '../data/earthSignalsData';
import { Info, ZoomIn, RefreshCw } from 'lucide-react';

export default function TrendChart({ data, regionId, variableId, variableName, unit }) {
  const [showFullRange, setShowFullRange] = useState(true);
  const trendSummary = GET_TREND_SUMMARY(regionId, variableId);

  // Filter 1981-2025 or recent 2000-2025
  const chartData = showFullRange ? data : data.filter(d => d.year >= 2000);

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div style={styles.tooltipBox}>
          <div style={styles.tooltipYear}>{label} Observation</div>
          <div style={styles.tooltipVal}>
            Actual Value: <strong>{item.value} {unit}</strong>
          </div>
          <div style={styles.tooltipSlope}>
            Sen's Slope Trend: <strong>{item.sensSlopeTrend} {unit}</strong>
          </div>
          {item.isHistoricalEventYear && (
            <div style={styles.tooltipAlert}>
              ⚠️ {item.eventNote}
            </div>
          )}
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
          <div style={styles.chartTitle}>{variableName} Long-Term Observation</div>
          <div style={styles.chartSubtitle}>
            Dataset: <strong>{trendSummary.dataset}</strong> | Time Period: <strong>{trendSummary.samplePeriod}</strong>
          </div>
        </div>

        {/* Range Toggle */}
        <div style={styles.toggleGroup}>
          <button
            onClick={() => setShowFullRange(true)}
            style={{
              ...styles.toggleBtn,
              ...(showFullRange ? styles.toggleBtnActive : {})
            }}
          >
            1981–2025 (44 Yrs)
          </button>
          <button
            onClick={() => setShowFullRange(false)}
            style={{
              ...styles.toggleBtn,
              ...(!showFullRange ? styles.toggleBtnActive : {})
            }}
          >
            2000–2025 (25 Yrs)
          </button>
        </div>
      </div>

      {/* Main Recharts Area */}
      <div style={{ width: '100%', height: 320, marginTop: '16px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
            <XAxis
              dataKey="year"
              stroke="var(--text-dim)"
              fontSize={12}
              tickLine={false}
              dy={10}
            />
            <YAxis
              stroke="var(--text-dim)"
              fontSize={12}
              tickLine={false}
              unit={` ${unit.split(' ')[0]}`}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ color: 'var(--text-muted)', fontSize: '0.8rem' }} />

            {/* Actual Satellite Observed Annual Line */}
            <Line
              type="monotone"
              dataKey="value"
              name={`Observed ${variableName} (${unit})`}
              stroke="var(--color-cyan)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: '#FFFFFF', stroke: 'var(--color-cyan)', strokeWidth: 2 }}
            />

            {/* Sen's Slope Linear Regression Trend Line */}
            <Line
              type="linear"
              dataKey="sensSlopeTrend"
              name="Sen's Slope Trend Trajectory"
              stroke="var(--color-amber)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />

            {/* Reference Dots for Historical Events */}
            {chartData.filter(d => d.isHistoricalEventYear).map(d => (
              <ReferenceDot
                key={d.year}
                x={d.year}
                y={d.value}
                r={6}
                fill="var(--color-red)"
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Legend Explanation */}
      <div style={styles.chartFooter}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: 'var(--color-cyan)' }} />
          <span>Observed Satellite Value</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: 'var(--color-amber)', borderRadius: 0, height: '2px' }} />
          <span>Sen’s Slope Non-Parametric Trend Line</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.legendDot, background: 'var(--color-red)' }} />
          <span>Historical Environmental Event Anomaly</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  chartCard: {
    padding: '24px',
    borderRadius: 'var(--radius-lg)'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '12px'
  },
  chartTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#FFFFFF'
  },
  chartSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '2px'
  },
  toggleGroup: {
    display: 'flex',
    gap: '4px',
    background: 'rgba(0,0,0,0.3)',
    padding: '4px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-subtle)'
  },
  toggleBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '0.78rem',
    fontWeight: '600',
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  toggleBtnActive: {
    background: 'var(--color-cyan-glow)',
    color: 'var(--color-cyan)',
    border: '1px solid var(--color-cyan)'
  },
  tooltipBox: {
    background: '#111827',
    border: '1px solid var(--border-glow)',
    borderRadius: '8px',
    padding: '12px 14px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
  },
  tooltipYear: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: '6px',
    fontFamily: 'var(--font-heading)'
  },
  tooltipVal: {
    fontSize: '0.8rem',
    color: 'var(--color-cyan)'
  },
  tooltipSlope: {
    fontSize: '0.8rem',
    color: 'var(--color-amber)',
    marginTop: '2px'
  },
  tooltipAlert: {
    fontSize: '0.75rem',
    color: 'var(--color-red)',
    marginTop: '6px',
    fontWeight: '600',
    borderTop: '1px stroke var(--border-subtle)',
    paddingTop: '4px'
  },
  chartFooter: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-subtle)',
    flexWrap: 'wrap',
    fontSize: '0.8rem',
    color: 'var(--text-muted)'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  }
};
