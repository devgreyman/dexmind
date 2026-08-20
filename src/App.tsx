import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AICopilot } from './components/AICopilot';
import { RWAVaults } from './components/RWAVaults';
import { 
  getEthereumProvider, 
  connectWallet as web3ConnectWallet, 
  getChainId, 
  getOKBBalance, 
  switchToXLayerTestnet, 
  isWeb3Available 
} from './utils/web3';
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
  const [walletBalance, setWalletBalance] = useState('0.0000');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  
  const [recentTxs, setRecentTxs] = useState<Transaction[]>([
    { hash: '0x3f5d...182a', type: 'Rebalance', asset: 'US Treasury Bill Vault', amount: '15,000 OKB', time: '2 mins ago', status: 'Success' },
    { hash: '0x8b2e...5a91', type: 'Deposit', asset: 'Real Estate Rent Vault', amount: '2.5 ETH', time: '14 mins ago', status: 'Success' },
    { hash: '0x7c41...d4fd', type: 'Swap Intent', asset: 'OKB to ETH', amount: '100 OKB', time: '1 hr ago', status: 'Success' },
    { hash: '0x4c0f...ce6e', type: 'Withdraw', asset: 'Gold Bullion Vault', amount: '10 OKB', time: '3 hrs ago', status: 'Success' },
  ]);

  useEffect(() => {
    const provider = getEthereumProvider();
    if (!provider) return;

    // Skip auto-reconnect if the user explicitly disconnected
    const wasDisconnected = localStorage.getItem('wallet_disconnected');
    if (!wasDisconnected) {
      // Check if already connected
      provider.request({ method: 'eth_accounts' })
        .then(async (accounts: string[]) => {
          if (accounts && accounts.length > 0) {
            const currentChainId = await getChainId();
            setIsCorrectNetwork(currentChainId === '0xc3');
            
            setWalletAddress(accounts[0]);
            setWalletConnected(true);
            
            const bal = await getOKBBalance(accounts[0]);
            setWalletBalance(bal);
          }
        })
        .catch(console.error);
    }

    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletConnected(false);
        setWalletAddress('');
        setWalletBalance('0.0000');
      } else {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        const bal = await getOKBBalance(accounts[0]);
        setWalletBalance(bal);
      }
    };

    const handleChainChanged = async (hexChainId: string) => {
      const correct = hexChainId === '0xc3';
      setIsCorrectNetwork(correct);
      if (walletAddress) {
        const bal = await getOKBBalance(walletAddress);
        setWalletBalance(bal);
      }
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [walletAddress]);

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

  const connectWallet = async () => {
    if (!isWeb3Available()) {
      alert('Please install OKX Wallet or MetaMask to connect to X Layer!');
      return;
    }
    try {
      // Clear the disconnected flag since user is explicitly connecting
      localStorage.removeItem('wallet_disconnected');
      
      const accounts = await web3ConnectWallet();
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        
        await switchToXLayerTestnet();
        const currentChainId = await getChainId();
        setIsCorrectNetwork(currentChainId === '0xc3');
        
        const bal = await getOKBBalance(accounts[0]);
        setWalletBalance(bal);
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const disconnectWallet = async () => {
    // Set flag so useEffect won't auto-reconnect on page refresh
    localStorage.setItem('wallet_disconnected', 'true');
    
    // Try to revoke wallet permissions (supported by MetaMask & OKX Wallet)
    const provider = getEthereumProvider();
    if (provider) {
      try {
        await provider.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }]
        });
      } catch (err) {
        // Not all wallets support wallet_revokePermissions — that's OK,
        // the localStorage flag will still prevent auto-reconnect
        console.warn('wallet_revokePermissions not supported:', err);
      }
    }
    
    // Clear React state
    setWalletConnected(false);
    setWalletAddress('');
    setWalletBalance('0.0000');
    setIsCorrectNetwork(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard recentTxs={recentTxs} walletBalance={walletBalance} walletConnected={walletConnected} />;
      case 'copilot':
        return <AICopilot onAddTransaction={addTransaction} walletConnected={walletConnected} walletAddress={walletAddress} isCorrectNetwork={isCorrectNetwork} />;
      case 'rwa':
        return <RWAVaults onAddTransaction={addTransaction} walletConnected={walletConnected} walletAddress={walletAddress} walletBalance={walletBalance} isCorrectNetwork={isCorrectNetwork} />;
      default:
        return <Dashboard recentTxs={recentTxs} walletBalance={walletBalance} walletConnected={walletConnected} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        walletBalance={walletBalance}
        isCorrectNetwork={isCorrectNetwork}
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
        onSwitchNetwork={switchToXLayerTestnet}
      />
      <main className="main-content">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
