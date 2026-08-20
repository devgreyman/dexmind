import React, { useState } from 'react';
import { 
  ShieldCheck, 
  TrendingUp,
  Award
} from 'lucide-react';

interface Vault {
  id: string;
  name: string;
  symbol: string;
  apy: string;
  risk: string;
  tvl: string;
  desc: string;
  alloc: number;
}
interface RWAVaultsProps {
  onAddTransaction: (type: string, asset: string, amount: string) => void;
  walletConnected: boolean;
  walletAddress: string;
  walletBalance: string;
  isCorrectNetwork: boolean;
}

export const RWAVaults: React.FC<RWAVaultsProps> = ({ 
  onAddTransaction,
  walletConnected,
  walletAddress,
  walletBalance,
  isCorrectNetwork
}) => {
  const [vaults, setVaults] = useState<Vault[]>([
    { id: '1', name: 'Short-Term US Treasuries Vault', symbol: 'dmUST', apy: '5.24%', risk: 'AAA (Low)', tvl: '$6.84M', alloc: 55, desc: 'Yields backed by 0-3 month US Treasury bills managed by regulated sponsors.' },
    { id: '2', name: 'Real Estate Rent Vault', symbol: 'dmREIT', apy: '8.20%', risk: 'A- (Medium)', tvl: '$3.72M', alloc: 30, desc: 'Tokenized commercial real estate yields paid monthly from rental revenues.' },
    { id: '3', name: 'Gold Bullion Yield Vault', symbol: 'dmGOLD', apy: '3.12%', risk: 'AA (Low)', tvl: '$1.92M', alloc: 15, desc: 'Tokenized gold assets combined with option writing strategies for yield.' }
  ]);

  const [selectedVault, setSelectedVault] = useState<Vault>(vaults[0]);
  const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [selectedToken, setSelectedToken] = useState<'OKB' | 'ETH'>('OKB');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsProcessing(true);

    if (walletConnected) {
      if (!isCorrectNetwork) {
        alert("Please switch your wallet network to X Layer Testnet before executing transactions.");
        setIsProcessing(false);
        return;
      }

      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const provider = (window as any).ethereum;
          // Send a 0 value transaction to simulated Vault contract on X Layer Testnet
          const mockVaultAddress = '0x4e6c33bb49d17f5ec86c33bb49d17f5ec86c33bb';
          const txParams = {
            from: walletAddress,
            to: mockVaultAddress,
            value: '0x0',
            data: '0x', // Empty data or mock call
          };

          const txHashResult = await provider.request({
            method: 'eth_sendTransaction',
            params: [txParams],
          });

          setTxHash(txHashResult);
          onAddTransaction(
            actionType === 'deposit' ? 'Deposit' : 'Withdraw',
            selectedVault.name,
            `${parseFloat(amount).toLocaleString()} ${selectedToken}`
          );
          setAmount('');
        } catch (error: any) {
          console.error('Onchain transaction failed:', error);
          const errorMsg = error?.message || '';
          if (errorMsg.toLowerCase().includes('insufficient')) {
            alert('Transaction failed: Insufficient OKB balance to pay gas fees. Please claim testnet OKB from the X Layer faucet.');
          } else if (error?.code === 4001) {
            alert('Transaction cancelled: User rejected the signature request in the wallet.');
          } else {
            alert(`Transaction failed: ${errorMsg || 'Please check your wallet connection and try again.'}`);
          }
        } finally {
          setIsProcessing(false);
        }
        return;
      }
    }

    // Fallback for mocked simulations
    setTimeout(() => {
      setIsProcessing(false);
      const generatedHash = '0x' + Math.random().toString(16).slice(2, 10) + '...' + Math.random().toString(16).slice(2, 6);
      setTxHash(generatedHash);
      onAddTransaction(
        actionType === 'deposit' ? 'Deposit' : 'Withdraw',
        selectedVault.name,
        `${parseFloat(amount).toLocaleString()} ${selectedToken}`
      );
      setAmount('');
    }, 2000);
  };

  const handleAutoRebalance = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate rebalancing allocations
      setVaults(prev => prev.map((v) => {
        if (v.id === '1') return { ...v, alloc: 50 }; // drop 5%
        if (v.id === '2') return { ...v, alloc: 35 }; // add 5%
        return v;
      }));
      setIsProcessing(false);
      setTxHash('0x9a3e...b747 (AI Rebalance Executed)');
      onAddTransaction('Rebalance', 'Treasuries to Real Estate REIT', '$45,000');
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 1 }}>
      <div className="app-header" style={{ marginBottom: 0 }}>
        <div className="app-title-section">
          <h1>RWA Yield Vaults</h1>
          <p>Direct exposure to tokenized real-world assets on X Layer with automated AI rebalancing.</p>
        </div>
        <button 
          onClick={handleAutoRebalance}
          className="btn btn-primary"
          style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          disabled={isProcessing}
        >
          <TrendingUp size={16} />
          <span>Trigger AI Yield Optimization</span>
        </button>
      </div>

      {txHash && (
        <div style={{ 
          padding: '1rem', 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid rgba(16, 185, 129, 0.2)', 
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.9rem'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
            <span>Transaction Executed Successfully! Hash: <strong style={{ fontFamily: 'var(--font-mono)' }}>{txHash}</strong></span>
          </span>
          <button onClick={() => setTxHash('')} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 600 }}>✕</button>
        </div>
      )}

      <div className="grid-2col" style={{ gridTemplateColumns: '2fr 1fr' }}>
        {/* Vaults list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {vaults.map((vault) => (
            <div 
              key={vault.id} 
              onClick={() => setSelectedVault(vault)}
              className="glass-card vault-card" 
              style={{ 
                cursor: 'pointer',
                borderColor: selectedVault.id === vault.id ? 'var(--primary)' : 'var(--border-color)',
                background: selectedVault.id === vault.id ? 'rgba(255, 215, 0, 0.02)' : 'var(--bg-card)'
              }}
            >
              <div className="vault-header">
                <div>
                  <h3 className="vault-title">{vault.name}</h3>
                  <p className="vault-subtitle">{vault.symbol} • TVL: {vault.tvl}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-info">{vault.risk} Risk</span>
                  <span className="badge badge-warning" style={{ background: 'rgba(255,215,0,0.1)', color: 'var(--primary)' }}>{vault.alloc}% Alloc</span>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0.5rem 0' }}>
                {vault.desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Current Yield</span>
                  <div className="vault-apy" style={{ margin: '0.2rem 0 0 0' }}>{vault.apy} APY</div>
                </div>
                <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  Manage Vault
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Invest interface */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.15rem', fontWeight: 600 }}>
              {actionType === 'deposit' ? 'Deposit Into' : 'Withdraw From'} {selectedVault.symbol}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <button 
                onClick={() => setActionType('deposit')} 
                className={`btn ${actionType === 'deposit' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem', fontSize: '0.85rem' }}
              >
                Deposit
              </button>
              <button 
                onClick={() => setActionType('withdraw')} 
                className={`btn ${actionType === 'withdraw' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem', fontSize: '0.85rem' }}
              >
                Withdraw
              </button>
            </div>

            {/* Token Selector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Asset to Invest</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button 
                  type="button"
                  onClick={() => setSelectedToken('OKB')} 
                  className={`btn ${selectedToken === 'OKB' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}
                >
                  OKB
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedToken('ETH')} 
                  className={`btn ${selectedToken === 'ETH' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}
                >
                  ETH
                </button>
              </div>
            </div>

            <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Amount ({selectedToken})</label>
                  {walletConnected && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Balance: <strong style={{ color: 'var(--primary)' }}>
                        {selectedToken === 'OKB' ? `${walletBalance} OKB` : '0.2482 ETH'}
                      </strong>
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="number" 
                    placeholder="0.0" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ 
                      width: '100%', 
                      background: 'rgba(0,0,0,0.2)', 
                      border: '1px solid var(--border-color)', 
                      borderRadius: '12px', 
                      padding: '0.85rem 3rem 0.85rem 1rem',
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: 600
                    }} 
                  />
                  <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {selectedToken}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Slippage Tolerance</span>
                  <span>0.1%</span>
                </div>
                <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Est Gas Fee</span>
                  <span>~0.005 OKB ($0.05)</span>
                </div>
                <div style={{ display: 'flex', justifySelf: 'space-between', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Projected Annual Return</span>
                  <span style={{ color: 'var(--success)' }}>
                    {amount ? `${(parseFloat(amount) * parseFloat(selectedVault.apy) / 100).toFixed(4)} ${selectedToken}` : `0.0000 ${selectedToken}`}
                  </span>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '0.5rem' }}
                disabled={isProcessing || !amount}
              >
                {isProcessing ? 'Processing Transaction...' : `${actionType === 'deposit' ? 'Deposit' : 'Withdraw'} ${selectedToken}`}
              </button>
            </form>
          </div>

          {/* RWA Yield information */}
          <div className="glass-card" style={{ border: '1px solid rgba(255, 215, 0, 0.15)' }}>
            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Award size={18} />
              <span>AI-RWA Track Perks</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
              The best-performing project in the AI-RWA track receives a **$50,000 Liquidity Grant**. DexMind targets this specifically by locking yield reserves in tokenized real-world assets on X Layer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
