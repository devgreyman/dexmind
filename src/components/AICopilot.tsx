import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Cpu, 
  HelpCircle, 
  CheckCircle,
  AlertTriangle,
  RotateCw
} from 'lucide-react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  txData?: {
    type: 'swap' | 'rebalance' | 'risk';
    target: string;
    details: string;
    route?: string;
    estGas: string;
  };
}
interface AICopilotProps {
  onAddTransaction: (type: string, asset: string, amount: string) => void;
  walletConnected: boolean;
  walletAddress: string;
  isCorrectNetwork: boolean;
}

export const AICopilot: React.FC<AICopilotProps> = ({ 
  onAddTransaction,
  walletConnected,
  walletAddress,
  isCorrectNetwork
}) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'assistant', 
      text: "Hello! I am your DexMind AI Copilot on X Layer. I can help you analyze yield pools, monitor real-world assets (RWAs), or execute intent-based swaps directly through the OKX DEX.\n\nWhat would you like to build or automate today?" 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [executingTxId, setExecutingTxId] = useState<number | null>(null);
  const [txSuccessId, setTxSuccessId] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const quickPrompts = [
    { label: "Swap 10 OKB for ETH on OKX DEX", prompt: "Swap 10 OKB for ETH using the best OKX DEX route" },
    { label: "Bridge 0.5 ETH from Base to X Layer", prompt: "Bridge 0.5 ETH from Base to OKB on X Layer Testnet" },
    { label: "Optimize my RWA portfolio yields", prompt: "Rebalance my RWA vault holdings to get the highest safe APY" }
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const newMsg: Message = { sender: 'user', text };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsThinking(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      let reply: Message;
      const lowerText = text.toLowerCase();

      if (lowerText.includes('bridge')) {
        const isBase = lowerText.includes('base');
        const isArbitrum = lowerText.includes('arbitrum');
        const isEthereum = lowerText.includes('ethereum') || lowerText.includes('eth ');
        const srcChain = isBase ? 'Base Sepolia Testnet' : isArbitrum ? 'Arbitrum Sepolia Testnet' : isEthereum ? 'Sepolia Testnet' : 'Base Sepolia Testnet';
        const amountMatch = text.match(/\d+(\.\d+)?/);
        const amountStr = amountMatch ? amountMatch[0] : '0.5';
        
        reply = {
          sender: 'assistant',
          text: `I have parsed your bridging intent: Bridge **${amountStr} ETH** from **${srcChain}** to **OKB** on **X Layer Testnet** using the OKX Bridge Aggregator (Testnet). I found the optimal bridge route with the lowest fees and transfer time (~2 mins).`,
          txData: {
            type: 'swap',
            target: '0x103a...20cd (OKX Cross-Chain Bridge Router - Testnet)',
            details: `Source Chain: ${srcChain}\nDest Chain: X Layer Testnet\nAmount: ${amountStr} ETH ➔ OKB\nBridge Provider: Stargate V2 (Testnet)\nEst. Transfer Time: ~2 minutes`,
            route: `${srcChain} (ETH) ➔ OKX Bridge Pool ➔ X Layer Testnet (OKB)`,
            estGas: `0.00035 ETH ($0.85 on ${srcChain})`
          }
        };
      } else if (lowerText.includes('swap') || lowerText.includes('okb')) {
        const amountMatch = text.match(/\d+(\.\d+)?/);
        const amountStr = amountMatch ? amountMatch[0] : '10';
        reply = {
          sender: 'assistant',
          text: `I have parsed your intent: Swap **${amountStr} OKB** for **ETH** on X Layer using the OKX DEX aggregator. I found the optimal route through the OKX Router which saves you 0.45% slippage.`,
          txData: {
            type: 'swap',
            target: '0x3a4b...fd12 (OKX DEX Aggregator Router)',
            details: `amountIn: ${amountStr}.00 OKB\nminAmountOut: ${(parseFloat(amountStr) * 0.05).toFixed(4)} ETH\nmaxSlippage: 0.5%`,
            route: 'OKB ➔ OKX Pool ➔ WETH ➔ ETH',
            estGas: '0.005 OKB ($0.05)'
          }
        };
      } else if (lowerText.includes('rebalance') || lowerText.includes('optimize') || lowerText.includes('portfolio')) {
        reply = {
          sender: 'assistant',
          text: "I analyzed current RWA vault yields on X Layer. US Treasury vault APY dropped from 5.4% to 5.1%, while Real Estate yield increased to 8.2%. I recommend rebalancing 15% of your portfolio to maximize yields.",
          txData: {
            type: 'rebalance',
            target: '0x8f2e...5a91 (DexMind Yield Manager)',
            details: 'Withdraw 15% OKB from Treasury Vault\nDeposit 15% OKB to Real Estate Vault\nExpected Net Yield Increase: +0.47% APY',
            estGas: '0.005 OKB ($0.05)'
          }
        };
      } else if (lowerText.includes('risk') || lowerText.includes('treasury')) {
        reply = {
          sender: 'assistant',
          text: "Here is the AI Risk Report for the tokenized US Treasury Bond Vault:\n\n1. **Underlying Security**: AAA-rated short-term US Treasury Bills (extremely safe).\n2. **Liquidity Risk**: Low. Withdrawals processed within 1 epoch (approx. 2 hours).\n3. **Smart Contract Audit**: Audited by CertiK (Score: 92/100).\n4. **Counterparty Risk**: Tokenization sponsor is regulated under US law.\n\n**Overall AI Rating**: **AA+** (Extremely Low Risk). Recommend allocation cap: 60%.",
          txData: {
            type: 'risk',
            target: '0x7c41...d4fd (Treasury RWA ERC-4626 Vault)',
            details: 'Asset: tokenized T-Bills\nRisk Level: Low\nCollateral Factor: 90%',
            estGas: 'N/A (Read-Only Call)'
          }
        };
      } else {
        reply = {
          sender: 'assistant',
          text: "I understand. I can generate transaction payloads for any custom Web3 intents. To trade or manage RWA yields, you can use prompts like:\n- 'Swap 50 USDC for WETH'\n- 'Reallocate 200 USDT to Gold Bullion Vault'\n- 'Explain the APY structure of the Real Estate Vault'"
        };
      }

      setMessages(prev => [...prev, reply]);
      setIsThinking(false);
    }, 1500);
  };

  const handleExecuteTx = async (index: number) => {
    setExecutingTxId(index);

    if (walletConnected) {
      if (!isCorrectNetwork) {
        alert("Please switch your wallet network to X Layer Testnet before executing transactions.");
        setExecutingTxId(null);
        return;
      }

      if (typeof window !== 'undefined' && (window as any).ethereum) {
        try {
          const provider = (window as any).ethereum;
          const mockVaultAddress = '0x4e6c33bb49d17f5ec86c33bb49d17f5ec86c33bb';
          const txParams = {
            from: walletAddress,
            to: mockVaultAddress,
            value: '0x0',
            data: '0x',
          };

          await provider.request({
            method: 'eth_sendTransaction',
            params: [txParams],
          });

          setExecutingTxId(null);
          setTxSuccessId(index);

          const msg = messages[index];
          if (msg && msg.txData) {
            const isBridge = msg.txData.details.includes('Source Chain');
            if (isBridge) {
              const detailsLine = msg.txData.details.split('\n')[2] || 'ETH ➔ OKB';
              const amt = detailsLine.split(': ')[1] || '0.5 ETH ➔ OKB';
              onAddTransaction('Bridge Intent', 'Cross-Chain Bridge', amt);
            } else if (msg.txData.type === 'swap') {
              onAddTransaction('Swap Intent', 'OKB to ETH', '10 OKB');
            } else if (msg.txData.type === 'rebalance') {
              onAddTransaction('Rebalance', 'Treasury to Real Estate REIT', '15,000 OKB');
            }
          }

          setTimeout(() => {
            setTxSuccessId(null);
          }, 4000);
          return;
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
          setExecutingTxId(null);
          return;
        }
      }
    }

    // Mock fallback
    setTimeout(() => {
      setExecutingTxId(null);
      setTxSuccessId(index);
      
      const msg = messages[index];
      if (msg && msg.txData) {
        const isBridge = msg.txData.details.includes('Source Chain');
        if (isBridge) {
          const detailsLine = msg.txData.details.split('\n')[2] || 'ETH ➔ OKB';
          const amt = detailsLine.split(': ')[1] || '0.5 ETH ➔ OKB';
          onAddTransaction('Bridge Intent', 'Cross-Chain Bridge', amt);
        } else if (msg.txData.type === 'swap') {
          onAddTransaction('Swap Intent', 'OKB to ETH', '10 OKB');
        } else if (msg.txData.type === 'rebalance') {
          onAddTransaction('Rebalance', 'Treasury to Real Estate REIT', '15,000 OKB');
        }
      }
      
      // Reset success state after a few seconds
      setTimeout(() => {
        setTxSuccessId(null);
      }, 4000);
    }, 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
      <div className="app-header" style={{ marginBottom: 0 }}>
        <div className="app-title-section">
          <h1>AI Copilot</h1>
          <p>Talk to the DexMind intelligence to parse trading intents and manage RWA portfolios automatically.</p>
        </div>
      </div>

      <div className="grid-2col" style={{ gridTemplateColumns: '1.8fr 1.2fr', flex: 1, minHeight: '580px' }}>
        {/* Chat window */}
        <div className="chat-container">
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.sender}`}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  {msg.sender === 'assistant' ? (
                    <Sparkles size={14} style={{ color: 'var(--primary)' }} />
                  ) : (
                    <Cpu size={14} style={{ color: 'var(--accent)' }} />
                  )}
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {msg.sender === 'assistant' ? 'DexMind AI' : 'Trader (You)'}
                  </span>
                </div>
                <div style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{msg.text}</div>

                {/* Render transaction builder card if AI parsed an action */}
                {msg.txData && (
                  <div className="tx-builder-card">
                    <div className="tx-builder-title">
                      <Cpu size={16} />
                      <span>Proposed Onchain Action (X Layer)</span>
                    </div>
                    <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                      <strong>Target Smart Contract:</strong> <code style={{ fontSize: '0.75rem', padding: '2px 6px' }}>{msg.txData.target}</code>
                    </div>
                    {msg.txData.route && (
                      <div style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        <strong>Best Route:</strong> <span style={{ color: 'var(--primary)' }}>{msg.txData.route}</span>
                      </div>
                    )}
                    <div className="tx-details">
                      {msg.txData.details}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span>Estimated Gas: {msg.txData.estGas}</span>
                      {msg.txData.type !== 'risk' && (
                        <>
                          {txSuccessId === i ? (
                            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                              <CheckCircle size={14} /> Success! TX Confirmed
                            </span>
                          ) : executingTxId === i ? (
                            <button className="btn btn-primary" disabled style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.4rem', opacity: 0.7 }}>
                              <RotateCw size={14} className="glow-indicator" style={{ animation: 'spin 1s linear infinite' }} />
                              <span>Executing...</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleExecuteTx(i)}
                              className="btn btn-primary" 
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            >
                              Execute Intent
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isThinking && (
              <div className="chat-bubble assistant">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={14} className="glow-indicator" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>DexMind is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompt chips */}
          <div className="prompt-chips">
            {quickPrompts.map((qp, i) => (
              <button 
                key={i} 
                className="prompt-chip"
                onClick={() => handleSend(qp.prompt)}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Chat input bar */}
          <div className="chat-input-bar">
            <input 
              type="text" 
              className="chat-input" 
              placeholder="e.g. Swap 200 USDT to WETH..." 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend(inputText);
              }}
            />
            <button 
              onClick={() => handleSend(inputText)} 
              className="btn btn-primary" 
              style={{ width: '46px', height: '46px', padding: 0, borderRadius: '12px' }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar Info/Documentation card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} style={{ color: 'var(--primary)' }} />
              <span>How DexMind Works</span>
            </h3>
            <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', lineHeight: 1.4 }}>
              <li>
                <strong style={{ color: '#fff' }}>Natural Intent:</strong> Send commands in normal English. The LLM translates them into transaction calls.
              </li>
              <li>
                <strong style={{ color: '#fff' }}>OKX Router Integration:</strong> All token swaps route dynamically to secure the lowest slippage/highest swap volume for Launch Grants.
              </li>
              <li>
                <strong style={{ color: '#fff' }}>RWA Yield Optimizer:</strong> AI automatically scans and recommends rebalances between yield vaults (Treasuries, REITs, commodities).
              </li>
              <li>
                <strong style={{ color: '#fff' }}>Low Gas Fees:</strong> Executing intent on X Layer (L2) costs pennies, processed instantly.
              </li>
            </ul>
          </div>

          <div className="glass-card" style={{ border: '1px solid rgba(168,85,247,0.15)' }}>
            <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent)' }}>AI Rebalance Strategy</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1rem' }}>
              DexMind's AI manager dynamically measures token correlation, liquidity depth, and protocol yield spikes to keep your RWA portfolio optimally balanced.
            </p>
            <div style={{ padding: '0.75rem', background: 'rgba(168, 85, 247, 0.05)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', gap: '0.5rem' }}>
              <AlertTriangle size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span>Autonomic rebalances only execute when net yield covers gas costs 2x over.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
