import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Bot,
  Radio,
  Cpu,
  Layers,
  Zap,
  TrendingDown,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

const LEARN_TOPICS = [
  {
    id: 'amr_agv',
    title: 'AMRs vs AGVs vs Forklifts',
    category: 'Robotics Hardware',
    icon: <Bot size={20} color="var(--cyan-bright)" />,
    summary: 'Autonomous Mobile Robots (AMRs) navigate dynamically using onboard LiDAR and SLAM without magnetic tape, whereas AGVs follow fixed floor guides. Autonomous Forklifts handle heavy vertical pallet retrieval up to 1500 kg.'
  },
  {
    id: 'lidar_slam',
    title: 'LiDAR & Perception Systems',
    category: 'Sensors & Perception',
    icon: <Radio size={20} color="#c77dff" />,
    summary: '360° LiDAR pucks emit pulsed laser beams at 10-20 Hz to create point clouds. Robots continuously calculate distance to obstacles, human workers, and racks, feeding safety envelopes directly to motion controllers.'
  },
  {
    id: 'digital_twin',
    title: 'Digital Twin Concept',
    category: 'Industrial IoT',
    icon: <Layers size={20} color="var(--green-normal)" />,
    summary: 'A virtual 3D replica of the physical warehouse continuously synchronized with telemetry (position, velocity, battery, SKU tags). Enables real-time simulation, anomaly detection, and predictive flow analysis.'
  },
  {
    id: 'ai_routing',
    title: 'AI Global Route Optimization',
    category: 'Fleet Intelligence',
    icon: <Cpu size={20} color="var(--yellow-warn)" />,
    summary: 'Instead of isolated single-robot pathfinding, global AI fleet routing evaluates network-wide corridor density, dynamically penalizing congested corridors and distributing traffic across parallel paths.'
  },
  {
    id: 'predictive_analytics',
    title: 'Predictive Bottleneck Analytics',
    category: 'Predictive AI',
    icon: <TrendingDown size={20} color="var(--orange-reroute)" />,
    summary: 'By analyzing upcoming waypoints 30-60 seconds ahead, the system forecasts traffic convergence before physical jams occur, executing proactive rerouting to eliminate delays.'
  },
  {
    id: 'wms_integration',
    title: 'WMS & Task Bidding Flow',
    category: 'Enterprise Integration',
    icon: <Zap size={20} color="var(--cyan-bright)" />,
    summary: 'Warehouse Management Systems (WMS) ingest customer orders, generate picking waves, and use multi-criteria bidding algorithms (evaluating battery, payload, proximity) to assign the best robot.'
  }
];

export function LearnModal() {
  const learnModalOpen = useWarehouseStore(state => state.learnModalOpen);
  const setLearnModalOpen = useWarehouseStore(state => state.setLearnModalOpen);
  const [selectedTopic, setSelectedTopic] = useState(LEARN_TOPICS[0]);

  if (!learnModalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(4, 8, 16, 0.8)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={() => setLearnModalOpen(false)}
    >
      <div
        className="glass-panel-elevated hud-border-bracket"
        style={{
          width: '840px',
          maxWidth: '95vw',
          maxHeight: '85vh',
          background: 'rgba(10, 18, 32, 0.95)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={22} color="var(--cyan-bright)" />
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                LEARN MODE — INDUSTRIAL WAREHOUSE INTELLIGENCE
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                Interactive technical guide to Autonomous Mobile Robotics, Digital Twins, and Fleet AI
              </p>
            </div>
          </div>

          <button
            onClick={() => setLearnModalOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Left sidebar topics + Right detail view */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Topics List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {LEARN_TOPICS.map((topic) => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isSelected ? 'var(--cyan-bright)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {topic.icon}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: isSelected ? '#ffffff' : 'var(--text-main)' }}>
                      {topic.title}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      {topic.category}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Topic Detailed Content */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              background: 'rgba(255,255,255,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {selectedTopic.icon}
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--cyan-bright)', margin: 0 }}>
                {selectedTopic.title}
              </h3>
            </div>

            <p style={{ fontSize: '13px', color: '#e0e8f5', lineHeight: '1.6' }}>
              {selectedTopic.summary}
            </p>

            <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(0, 240, 255, 0.05)', borderRadius: '8px', borderLeft: '3px solid var(--cyan-bright)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--cyan-bright)', marginBottom: '4px' }}>
                DIGITAL TWIN SIMULATION IMPLEMENTATION:
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                In this digital twin, {selectedTopic.title.toLowerCase()} is actively modeled with 60 FPS real-time kinematics, dynamic A* graph weighting, and continuous sensor streaming.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
