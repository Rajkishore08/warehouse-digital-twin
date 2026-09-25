import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function AlertPanel() {
  const alerts = useWarehouseStore(state => state.alerts);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '520px',
        pointerEvents: 'auto',
        transition: 'all 0.3s ease'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={16} color="var(--cyan-bright)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
            LIVE SYSTEM ALERTS & EVENT LOG
          </span>
          <span className="badge badge-cyan" style={{ fontSize: '10px' }}>
            {alerts.length}
          </span>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Latest Alert Banner */}
      {alerts.length > 0 && (
        <div
          style={{
            fontSize: '11px',
            color: alerts[0].type === 'warning' ? 'var(--yellow-warn)' : (alerts[0].type === 'danger' ? 'var(--red-congested)' : (alerts[0].type === 'success' ? 'var(--green-normal)' : 'var(--cyan-bright)')),
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span className="mono-text" style={{ color: 'var(--text-dim)', fontSize: '10px' }}>[{alerts[0].time}]</span>
          <span>{alerts[0].message}</span>
        </div>
      )}

      {/* Expanded Log List */}
      {isExpanded && (
        <div
          style={{
            maxHeight: '180px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            marginTop: '6px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: '8px'
          }}
        >
          {alerts.map((alt) => {
            let icon = <Info size={14} color="var(--cyan-bright)" />;
            if (alt.type === 'warning') icon = <AlertTriangle size={14} color="var(--yellow-warn)" />;
            if (alt.type === 'danger') icon = <ShieldAlert size={14} color="var(--red-congested)" />;
            if (alt.type === 'success') icon = <CheckCircle2 size={14} color="var(--green-normal)" />;

            return (
              <div
                key={alt.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '11px',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                {icon}
                <div style={{ flex: 1 }}>
                  <span className="mono-text" style={{ color: 'var(--text-dim)', fontSize: '10px', marginRight: '6px' }}>
                    {alt.time}
                  </span>
                  <span style={{ color: 'var(--text-main)' }}>{alt.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
