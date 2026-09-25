import React from 'react';
import { History, Play, Pause, FastForward } from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function Timeline() {
  const timelineEvents = useWarehouseStore(state => state.timelineEvents);
  const runCongestionDemo = useWarehouseStore(state => state.runCongestionDemo);
  const triggerAiOptimization = useWarehouseStore(state => state.triggerAiOptimization);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        pointerEvents: 'auto',
        fontSize: '11px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan-bright)', fontWeight: '700' }}>
        <History size={16} />
        <span>SIMULATION TIMELINE & PLAYBACK</span>
      </div>

      {/* Timeline stages */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflowX: 'auto' }}>
        {[
          { time: '10:00', label: 'Normal Traffic', action: null },
          { time: '10:02', label: 'Aisle 5 Traffic Surge', action: runCongestionDemo },
          { time: '10:04', label: 'Congestion Alert', action: null },
          { time: '10:05', label: 'AI Multi-Rerouting', action: triggerAiOptimization },
          { time: '10:06', label: 'Traffic Normalized', action: null },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={item.action || undefined}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 8px',
              borderRadius: '4px',
              background: item.action ? 'rgba(0, 240, 255, 0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${item.action ? 'var(--cyan-dim)' : 'rgba(255,255,255,0.06)'}`,
              cursor: item.action ? 'pointer' : 'default',
              transition: 'all 0.2s ease'
            }}
          >
            <span className="mono-text" style={{ color: 'var(--cyan-bright)', fontWeight: '700' }}>
              {item.time}
            </span>
            <span style={{ color: item.action ? '#ffffff' : 'var(--text-muted)' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
