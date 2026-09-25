import React from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function DemoModeOverlay() {
  const demoMode = useWarehouseStore(state => state.demoMode);
  const nextDemoStep = useWarehouseStore(state => state.nextDemoStep);
  const prevDemoStep = useWarehouseStore(state => state.prevDemoStep);
  const exitDemoMode = useWarehouseStore(state => state.exitDemoMode);

  if (!demoMode || !demoMode.isActive) return null;

  const { currentStep, totalSteps, stepTitle, stepDesc } = demoMode;
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div
      className="glass-panel-elevated hud-border-bracket"
      style={{
        position: 'absolute',
        top: '84px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        width: '620px',
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        background: 'rgba(8, 14, 26, 0.92)',
        borderColor: 'var(--cyan-bright)',
        boxShadow: '0 0 30px rgba(0, 240, 255, 0.3)'
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--cyan-bright)" />
          <span style={{ fontSize: '13px', fontWeight: '800', letterSpacing: '0.8px', color: '#ffffff' }}>
            INTERACTIVE INDUSTRIAL DEMO
          </span>
          <span className="badge badge-cyan">
            STEP {currentStep} / {totalSteps}
          </span>
        </div>

        <button
          onClick={exitDemoMode}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
          title="Exit Demo Mode"
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--cyan-bright) 0%, var(--green-normal) 100%)',
            transition: 'width 0.3s ease'
          }}
        />
      </div>

      {/* Step Content */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--cyan-bright)', marginBottom: '4px' }}>
          {stepTitle}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.4' }}>
          {stepDesc}
        </div>
      </div>

      {/* Stepper Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
        <button
          className="btn-secondary"
          onClick={prevDemoStep}
          disabled={currentStep <= 1}
          style={{ opacity: currentStep <= 1 ? 0.4 : 1, fontSize: '12px', padding: '6px 14px' }}
        >
          <ChevronLeft size={16} />
          <span>Previous Step</span>
        </button>

        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: i + 1 === currentStep ? 'var(--cyan-bright)' : (i + 1 < currentStep ? 'var(--green-normal)' : 'rgba(255,255,255,0.15)'),
                boxShadow: i + 1 === currentStep ? '0 0 8px var(--cyan-bright)' : 'none'
              }}
            />
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={nextDemoStep}
          style={{ fontSize: '12px', padding: '6px 16px' }}
        >
          <span>{currentStep === totalSteps ? 'Finish Demo' : 'Next Step'}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
