export interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener: (event: string, callback: (...args: any[]) => void) => void;
}

export const XLAYER_TESTNET_PARAMS = {
  chainId: '0xc3', // 195 decimal
  chainName: 'X Layer Testnet',
  nativeCurrency: {
    name: 'OKB',
    symbol: 'OKB',
    decimals: 18
  },
  rpcUrls: ['https://testrpc.xlayer.tech'],
  blockExplorerUrls: ['https://www.okx.com/web3/explorer/xlayer-testnet']
};

export function getEthereumProvider(): EthereumProvider | null {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return (window as any).ethereum;
  }
  return null;
}

export function isWeb3Available(): boolean {
  return getEthereumProvider() !== null;
}

export async function connectWallet(): Promise<string[]> {
  const provider = getEthereumProvider();
  if (!provider) throw new Error('No ethereum provider found');
  
  return await provider.request({ method: 'eth_requestAccounts' });
}

export async function getChainId(): Promise<string> {
  const provider = getEthereumProvider();
  if (!provider) return '0x0';
  
  return await provider.request({ method: 'eth_chainId' });
}

export async function getOKBBalance(address: string): Promise<string> {
  const provider = getEthereumProvider();
  if (!provider) return '0.0000';
  
  try {
    const hexBalance = await provider.request({
      method: 'eth_getBalance',
      params: [address, 'latest']
    });
    
    const wei = BigInt(hexBalance);
    // Convert Wei to OKB (10^18)
    const balanceNum = Number(wei) / 1e18;
    return balanceNum.toFixed(4);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0.0000';
  }
}

export async function switchToXLayerTestnet(): Promise<boolean> {
  const provider = getEthereumProvider();
  if (!provider) return false;
  
  try {
    // Try switching first
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: XLAYER_TESTNET_PARAMS.chainId }]
    });
    return true;
  } catch (switchError: any) {
    // Code 4902 means the chain has not been added to the wallet
    if (switchError.code === 4902) {
      try {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [XLAYER_TESTNET_PARAMS]
        });
        return true;
      } catch (addError) {
        console.error('Error adding X Layer Testnet:', addError);
        return false;
      }
    }
    console.error('Error switching to X Layer Testnet:', switchError);
    return false;
  }
}
