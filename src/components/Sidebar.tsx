import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquareCode, 
  Coins, 
  Wallet,
  Award
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  walletConnected: boolean;
  walletAddress: string;
  walletBalance: string;
  isCorrectNetwork: boolean;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  onSwitchNetwork: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  walletConnected,
  walletAddress,
  walletBalance,
  isCorrectNetwork,
  onConnectWallet,
  onDisconnectWallet,
  onSwitchNetwork
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
            {/* Network Indicator */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.5rem 0.75rem', 
              background: isCorrectNetwork ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)', 
              borderRadius: '8px', 
              fontSize: '0.8rem',
              border: isCorrectNetwork ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(239, 68, 68, 0.15)' 
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  background: isCorrectNetwork ? 'var(--success)' : '#ef4444' 
                }}></div>
                <span style={{ color: isCorrectNetwork ? '#fff' : '#ef4444', fontWeight: 500, fontSize: '0.75rem' }}>
                  {isCorrectNetwork ? 'X Layer Testnet' : 'Wrong Network'}
                </span>
              </div>
              {!isCorrectNetwork && (
                <button 
                  onClick={onSwitchNetwork}
                  style={{ 
                    background: 'var(--primary)', 
                    border: 'none', 
                    color: '#000', 
                    fontSize: '0.7rem', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Switch
                </button>
              )}
            </div>

            {/* Address & Balance */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '0.25rem',
              padding: '0.6rem 0.75rem', 
              background: 'rgba(255, 255, 255, 0.02)', 
              borderRadius: '8px', 
              fontSize: '0.85rem',
              border: '1px solid var(--border-color)' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                <span>Address</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                <span>Balance</span>
                <span style={{ color: 'var(--primary)' }}>{walletBalance} OKB</span>
              </div>
            </div>

            <button 
              onClick={onDisconnectWallet} 
              className="btn btn-secondary" 
              style={{ padding: '0.5rem', fontSize: '0.8rem', marginTop: '0.25rem' }}
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
