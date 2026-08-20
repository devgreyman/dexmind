import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AICopilot } from './components/AICopilot';
import { RWAVaults } from './components/RWAVaults';
import './index.css';

export interface Transaction {
  hash: string;
  type: string;
  asset: string;
  amount: string;
  time: string;
  status: string;
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [recentTxs, setRecentTxs] = useState<Transaction[]>([
    { hash: '0x3f5d...182a', type: 'Rebalance', asset: 'US Treasury Bill Vault', amount: '$45,000', time: '2 mins ago', status: 'Success' },
    { hash: '0x8b2e...5a91', type: 'Deposit', asset: 'Real Estate Rent Vault', amount: '$12,500', time: '14 mins ago', status: 'Success' },
    { hash: '0x7c41...d4fd', type: 'Swap Intent', asset: 'USDC to WETH', amount: '$3,400', time: '1 hr ago', status: 'Success' },
    { hash: '0x4c0f...ce6e', type: 'Withdraw', asset: 'Gold Bullion Vault', amount: '$8,200', time: '3 hrs ago', status: 'Success' },
  ]);

  const addTransaction = (type: string, asset: string, amount: string) => {
    const newTx: Transaction = {
      hash: '0x' + Math.random().toString(16).slice(2, 6) + '...' + Math.random().toString(16).slice(2, 6),
      type,
      asset,
      amount,
      time: 'Just now',
      status: 'Success'
    };
    setRecentTxs(prev => [newTx, ...prev]);
  };

  const connectWallet = () => {
    // Simulate OKX Wallet connection
    setWalletConnected(true);
    setWalletAddress('0x4e6c33bb49d17f5ec86c33bb49d17f5ec86c33bb');
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard recentTxs={recentTxs} />;
      case 'copilot':
        return <AICopilot onAddTransaction={addTransaction} />;
      case 'rwa':
        return <RWAVaults onAddTransaction={addTransaction} />;
      default:
        return <Dashboard recentTxs={recentTxs} />;
    }
  };


  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
