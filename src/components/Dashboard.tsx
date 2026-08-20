import React, { useState } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Coins, 
  Percent, 
  ShieldCheck, 
  ExternalLink,
  Info,
  DollarSign
} from 'lucide-react';

import type { Transaction } from '../App';

interface DashboardProps {
  recentTxs: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ recentTxs }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity'>('overview');

  const stats = [
    { label: 'Total Value Locked (TVL)', value: '$12,482,920', change: '+14.2%', isUp: true, icon: <Coins size={20} style={{ color: 'var(--primary)' }} /> },
    { label: '24h DEX Volume via OKX', value: '$1,842,502', change: '+28.4%', isUp: true, icon: <TrendingUp size={20} style={{ color: 'var(--accent)' }} /> },
    { label: 'Avg Yield APY', value: '8.45%', change: '+0.6%', isUp: true, icon: <Percent size={20} style={{ color: 'var(--success)' }} /> },
    { label: 'Active AI Agents', value: '4,102', change: '-2.1%', isUp: false, icon: <ShieldCheck size={20} style={{ color: 'var(--success)' }} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
      <div className="app-header" style={{ marginBottom: 0 }}>
        <div className="app-title-section">
          <h1>Dashboard Overview</h1>
          <p>Real-time analytics and performance tracking for DexMind agents on X Layer.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ExternalLink size={16} />
            <span>X Layer Explorer</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="stat-label">{stat.label}</span>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {stat.icon}
              </div>
            </div>
            <div>
              <div className="stat-value">{stat.value}</div>
              <div className={`stat-change ${stat.isUp ? 'up' : 'down'}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                <span>{stat.change} vs last week</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2col">
        {/* Main interactive metrics */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '380px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600 }}>Yield Allocations & Rebalancing Logs</h3>
            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
              >
                Allocations
              </button>
              <button 
                onClick={() => setActiveTab('activity')} 
                className={`btn ${activeTab === 'activity' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', borderRadius: '6px' }}
              >
                Rebalance Logs
              </button>
            </div>
          </div>

          {activeTab === 'overview' ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifySelf: 'center', margin: '0 auto' }}>
                  {/* SVG Donut Chart */}
                  <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                    <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="transparent"></circle>
                    <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="3"></circle>
                    
                    {/* US Treasury (55%) - Gold */}
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--primary)" strokeWidth="3.5" strokeDasharray="55 45" strokeDashoffset="25"></circle>
                    {/* Real Estate (30%) - Purple */}
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--accent)" strokeWidth="3.5" strokeDasharray="30 70" strokeDashoffset="70"></circle>
                    {/* Gold (15%) - Success Emerald */}
                    <circle className="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--success)" strokeWidth="3.5" strokeDasharray="15 85" strokeDashoffset="40"></circle>
                  </svg>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>8.45%</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Net APY</span>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.8rem', minWidth: '200px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--primary)' }}></div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>US Treasury Vault</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>55%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--accent)' }}></div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Real Estate Rent Vault</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>30%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--success)' }}></div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Gold Bullion Vault</span>
                    </div>
                    <span style={{ fontWeight: 600 }}>15%</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
              <div style={{ padding: '0.85rem', background: 'rgba(255,215,0,0.03)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Info size={18} style={{ color: 'var(--primary)', marginTop: '0.1rem', flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong style={{ color: '#fff' }}>AI Copilot Autonomic Rebalancing:</strong> Markets are monitored 24/7. When interest rates on US Treasuries fell by 12bps, the AI reallocated 5% portfolio TVL to Real Estate REITs to maximize APY efficiency on X Layer.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <span>REALLOCATION EVENT</span>
                  <span>TRIGGER CONDITION</span>
                  <span>TIMESTAMP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', alignItems: 'center' }}>
                  <span>Treasuries ➔ Real Estate Vault</span>
                  <span style={{ color: 'var(--success)' }}>Yield Spreads &gt; 1.5%</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Today, 02:44 AM</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', alignItems: 'center' }}>
                  <span>Gold Vault ➔ Treasuries Vault</span>
                  <span style={{ color: 'var(--success)' }}>Treasury APY &gt; 5.2%</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Yesterday, 04:12 PM</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hackathon Launch Grant Progress & Rules */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Launch Grant Program</span>
              <span className="badge badge-warning">Target Locked</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem 0', lineHeight: 1.4 }}>
              Unlock 50,000 USDT in Launch Grants for every 10,000,000 USDT cumulative trading volume routed through OKX DEX interface on X Layer.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <span>Tier 1 Progress</span>
                <span style={{ color: 'var(--primary)' }}>42% ($4.2M / $10M)</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '42%', height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%)', borderRadius: '4px' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                <span>Current Unlock: $0 USDT</span>
                <span>Next Milestone: $50K Grant</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DEX TRANSACTIONS</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginTop: '0.2rem' }}>14,920</div>
            </div>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>GAS REBATES EARNED</span>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.2rem' }}>1.24 ETH</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card">
        <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: 600 }}>Recent Copilot Transactions</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem 1rem' }}>TX HASH</th>
                <th style={{ padding: '0.75rem 1rem' }}>TYPE</th>
                <th style={{ padding: '0.75rem 1rem' }}>ASSET/VAULT</th>
                <th style={{ padding: '0.75rem 1rem' }}>AMOUNT</th>
                <th style={{ padding: '0.75rem 1rem' }}>TIMESTAMP</th>
                <th style={{ padding: '0.75rem 1rem' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {recentTxs.map((tx, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)', cursor: 'pointer' }}>
                    {tx.hash} <ExternalLink size={12} style={{ display: 'inline-block', marginLeft: '0.2rem' }} />
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{tx.type}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{tx.asset}</td>
                  <td style={{ padding: '0.85rem 1rem', color: '#fff', fontWeight: 600 }}>{tx.amount}</td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{tx.time}</td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ 
                      padding: '0.2rem 0.5rem', 
                      background: 'rgba(16, 185, 129, 0.1)', 
                      color: 'var(--success)', 
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
