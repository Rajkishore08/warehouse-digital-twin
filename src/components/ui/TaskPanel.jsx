import React, { useState } from 'react';
import {
  ClipboardList,
  Package,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useWarehouseStore } from '../../store/useWarehouseStore';

export function TaskPanel() {
  const ordersQueue = useWarehouseStore(state => state.ordersQueue);
  const inventory = useWarehouseStore(state => state.inventory);
  const selectedRackId = useWarehouseStore(state => state.selectedRackId);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory'
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="glass-panel"
      style={{
        padding: '10px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '380px',
        pointerEvents: 'auto'
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
          <ClipboardList size={16} color="var(--cyan-bright)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
            WMS TASK & INVENTORY PIPELINE
          </span>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px' }}>
        <button
          onClick={() => { setActiveTab('orders'); setIsExpanded(true); }}
          style={{
            flex: 1,
            padding: '4px 8px',
            background: activeTab === 'orders' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255,255,255,0.04)',
            border: '1px solid',
            borderColor: activeTab === 'orders' ? 'var(--cyan-bright)' : 'rgba(255,255,255,0.08)',
            borderRadius: '4px',
            color: activeTab === 'orders' ? 'var(--cyan-bright)' : 'var(--text-muted)',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Active Orders ({ordersQueue.length})
        </button>
        <button
          onClick={() => { setActiveTab('inventory'); setIsExpanded(true); }}
          style={{
            flex: 1,
            padding: '4px 8px',
            background: activeTab === 'inventory' ? 'rgba(157, 78, 221, 0.2)' : 'rgba(255,255,255,0.04)',
            border: '1px solid',
            borderColor: activeTab === 'inventory' ? '#9d4edd' : 'rgba(255,255,255,0.08)',
            borderRadius: '4px',
            color: activeTab === 'inventory' ? '#c77dff' : 'var(--text-muted)',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Rack Inventory ({inventory.length})
        </button>
      </div>

      {/* Content */}
      {isExpanded && activeTab === 'orders' && (
        <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          {ordersQueue.map((ord) => (
            <div
              key={ord.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {ord.id} <span style={{ color: 'var(--cyan-bright)' }}>• {ord.sku}</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                  Qty: {ord.qty} units → {ord.dest}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-blue" style={{ fontSize: '9px' }}>
                  {ord.robotId}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isExpanded && activeTab === 'inventory' && (
        <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
          {inventory.map((item) => {
            const isRackSelected = selectedRackId === item.rack;
            return (
              <div
                key={item.sku}
                style={{
                  padding: '6px 8px',
                  background: isRackSelected ? 'rgba(0, 240, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '6px',
                  border: `1px solid ${isRackSelected ? 'var(--cyan-bright)' : 'rgba(255,255,255,0.06)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', color: '#ffffff' }}>
                  <span>{item.name}</span>
                  <span className="mono-text" style={{ color: 'var(--cyan-bright)' }}>{item.stock} in stock</span>
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '6px' }}>
                  <span>SKU: {item.sku}</span>
                  <span>•</span>
                  <span>Location: {item.rack} (L{item.level}-B{item.bay})</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
