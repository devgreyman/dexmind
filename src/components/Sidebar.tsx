import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  Coins, 
  TrendingUp, 
  Wallet,
  Activity,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  walletConnected,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet
}) => {
  return (
    <aside className="sidebar">
      <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <img src="/dexmindlogo.png" alt="DexMind Logo" style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'contain' }} />
        <span className="logo-text">DexMind</span>
      </div>

      <nav className="nav-links">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`nav-item btn-secondary ${activeTab === 'dashboard' ? 'active' : ''}`}
          style={{ width: '100%', border: 'none', justifyContent: 'flex-start', background: 'transparent' }}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </button>

        <button 
          onClick={() => setActiveTab('copilot')}
          className={`nav-item btn-secondary ${activeTab === 'copilot' ? 'active' : ''}`}
          style={{ width: '100%', border: 'none', justifyContent: 'flex-start', background: 'transparent' }}
        >
          <MessageSquareCode size={20} />
          <span>AI Copilot</span>
        </button>

        <button 
          onClick={() => setActiveTab('rwa')}
          className={`nav-item btn-secondary ${activeTab === 'rwa' ? 'active' : ''}`}
          style={{ width: '100%', border: 'none', justifyContent: 'flex-start', background: 'transparent' }}
        >
          <Coins size={20} />
          <span>RWA Vaults</span>
        </button>
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="glass-card" style={{ padding: '1rem', border: '1px solid rgba(255,215,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Award size={16} className="glow-indicator" style={{ background: 'var(--primary)' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)' }}>Launch Grant Progress</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '42%', height: '100%', background: 'var(--primary)', borderRadius: '3px' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '0.4rem', color: 'var(--text-secondary)' }}>
            <span>$4.2M Vol</span>
            <span>$10M Target</span>
          </div>
        </div>

        {walletConnected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem 0.75rem', 
              background: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: '8px', 
              fontSize: '0.85rem',
              border: '1px solid rgba(16, 185, 129, 0.2)' 
            }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
              <span style={{ fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            </div>
            <button 
              onClick={onDisconnectWallet} 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem', fontSize: '0.8rem' }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={onConnectWallet} className="btn btn-primary" style={{ width: '100%' }}>
            <Wallet size={18} />
            <span>Connect Wallet</span>
          </button>
        )}
      </div>
    </aside>
  );
};
