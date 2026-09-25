import React, { useState } from 'react';
import {
  BrainCircuit,
  TrendingDown,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Sparkles,
  Layers
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function AiPanel() {
  const congestionZones = useWarehouseStore(state => state.congestionZones);
  const predictiveBottlenecks = useWarehouseStore(state => state.predictiveBottlenecks) || [];
  const latestAiAction = useWarehouseStore(state => state.latestAiAction);
  const routeCandidateComparisons = useWarehouseStore(state => state.routeCandidateComparisons) || [];
  const aiStatus = useWarehouseStore(state => state.aiStatus);
  const optimizationProgress = useWarehouseStore(state => state.optimizationProgress) || 100;
  const triggerAiOptimization = useWarehouseStore(state => state.triggerAiOptimization);

  const [isMinimized, setIsMinimized] = useState(false);

  const hasCongestion = congestionZones.length > 0;
  const hasPredictions = predictiveBottlenecks.length > 0;

  if (isMinimized) {
    return (
      <div
        className="glass-panel"
        style={{
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          pointerEvents: 'auto'
        }}
        onClick={() => setIsMinimized(false)}
      >
        <BrainCircuit size={18} color="var(--cyan-bright)" />
        <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
          AI Engine ({aiStatus})
        </span>
      </div>
    );
  }

  return (
    <div
      className="glass-panel hud-border-bracket"
      style={{
        width: '340px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'auto',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto'
      }}
    >
      {/* Title with minimize */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit size={18} color="var(--cyan-bright)" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
              AI ROUTE OPTIMIZER
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Simulated Global Path Planning</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className={`badge ${hasCongestion ? 'badge-red congested-alert-pulse' : (aiStatus === 'OPTIMIZING' ? 'badge-orange' : 'badge-green')}`}>
            {hasCongestion ? 'BOTTLENECK' : (aiStatus === 'OPTIMIZING' ? 'OPTIMIZING' : 'ACTIVE')}
          </span>
          <button
            onClick={() => setIsMinimized(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            title="Minimize Panel"
          >
            <span style={{ fontSize: '16px', lineHeight: 1 }}>−</span>
          </button>
        </div>
      </div>

      {/* Progress Bar when Optimizing */}
      {aiStatus === 'OPTIMIZING' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--orange-reroute)', fontWeight: '700', marginBottom: '4px' }}>
            <span>RECALCULATING GLOBAL FLEET CORRIDORS...</span>
            <span className="mono-text">{optimizationProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${optimizationProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #ff7700 0%, #00ff88 100%)',
                transition: 'width 0.2s ease'
              }}
            />
          </div>
        </div>
      )}

      {/* 1. Real-Time Detection Status Card */}
      <div
        className="glass-panel"
        style={{
          padding: '10px 12px',
          background: hasCongestion ? 'rgba(255, 34, 85, 0.12)' : 'rgba(0, 255, 136, 0.08)',
          borderColor: hasCongestion ? 'rgba(255, 34, 85, 0.4)' : 'rgba(0, 255, 136, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {hasCongestion ? (
            <AlertTriangle size={16} color="var(--red-congested)" />
          ) : (
            <CheckCircle2 size={16} color="var(--green-normal)" />
          )}
          <div style={{ fontSize: '12px', fontWeight: '700', color: hasCongestion ? 'var(--red-congested)' : 'var(--green-normal)' }}>
            {hasCongestion
              ? `Congestion Detected (${congestionZones.length} Zone)`
              : 'Traffic Flow Optimal'}
          </div>
        </div>

        {hasCongestion && (
          <div style={{ fontSize: '11px', color: '#ffe6eb', marginTop: '6px', lineHeight: '1.4' }}>
            {congestionZones.map(z => `${z.name}: ${z.robotCount} robots queueing (${(z.density * 100).toFixed(0)}% Cap)`).join(' • ')}
          </div>
        )}
      </div>

      {/* 2. Simulated Predictive Congestion Warning Card */}
      {hasPredictions && (
        <div
          className="glass-panel"
          style={{
            padding: '10px 12px',
            background: 'rgba(255, 170, 0, 0.12)',
            borderColor: 'rgba(255, 170, 0, 0.45)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="var(--yellow-warn)" />
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--yellow-warn)' }}>
              SIMULATED PREDICTIVE ANALYTICS
            </div>
          </div>
          {predictiveBottlenecks.map((b, i) => (
            <div key={i} style={{ fontSize: '11px', color: '#fff0db', marginTop: '4px' }}>
              ⚠️ {b.name}: Predicted bottleneck in {b.predictedTimeSec}s (Confidence {b.confidence}). Proactive rerouting ready.
            </div>
          ))}
        </div>
      )}

      {/* 3. Candidate Route Comparison Inspector */}
      {routeCandidateComparisons.length > 0 && (
        <div className="glass-panel" style={{ padding: '10px 12px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
            Dynamic Route Candidates Evaluated
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {routeCandidateComparisons[0].candidates.map((cand, idx) => (
              <div
                key={idx}
                style={{
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: cand.selected ? 'rgba(0, 255, 136, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${cand.selected ? 'var(--green-normal)' : 'rgba(255,255,255,0.06)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: cand.selected ? 'var(--green-normal)' : '#ffffff' }}>
                    {cand.id} {cand.selected && '✓ (SELECTED)'}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                    {cand.traffic}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono-text" style={{ fontSize: '11px', color: '#ffffff', fontWeight: '700' }}>
                    {cand.distM} m
                  </div>
                  <div className="mono-text" style={{ fontSize: '9px', color: 'var(--text-dim)' }}>
                    ETA {cand.eta}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. AI Decision Summary & Outcomes */}
      {latestAiAction && (
        <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Last AI Optimization</span>
            <span className="mono-text" style={{ color: 'var(--cyan-bright)' }}>{latestAiAction.timestamp}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div className="glass-panel" style={{ padding: '6px 8px', background: 'rgba(0, 240, 255, 0.06)' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Robots Rerouted</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--cyan-bright)', fontFamily: 'var(--font-mono)' }}>
                {latestAiAction.reroutedCount} units
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '6px 8px', background: 'rgba(0, 255, 136, 0.06)' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Delay Reduced</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--green-normal)', fontFamily: 'var(--font-mono)' }}>
                -{latestAiAction.metrics?.avgDelayReducedSec || 42}s
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '6px 8px', background: 'rgba(157, 78, 221, 0.06)' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Throughput Gain</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#c77dff', fontFamily: 'var(--font-mono)' }}>
                {latestAiAction.metrics?.fleetEfficiencyGain || '+36.8%'}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '6px 8px', background: 'rgba(255, 204, 0, 0.06)' }}>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Safety Compliance</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--yellow-warn)', fontFamily: 'var(--font-mono)' }}>
                {latestAiAction.metrics?.safetyIndex || '99.9%'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Route Legend */}
      <div className="glass-panel" style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '14px', height: '3px', background: '#00ff88', borderRadius: '2px' }} />
            <span style={{ color: 'var(--green-normal)' }}>Active Optimized Corridor</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '14px', height: '2px', borderTop: '2px dashed #ff2255' }} />
            <span style={{ color: 'var(--red-congested)' }}>Old / Congested Path (Rerouted)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '14px', height: '3px', background: '#00f0ff', borderRadius: '2px' }} />
            <span style={{ color: 'var(--cyan-bright)' }}>Selected Robot Route</span>
          </div>
        </div>
      </div>

      {/* Recalculate Button */}
      <button
        className="btn-primary"
        onClick={triggerAiOptimization}
        style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
      >
        <RotateCw size={16} />
        <span>Recalculate Dynamic Fleet Routes</span>
      </button>
    </div>
  );
}
