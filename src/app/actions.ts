'use server';

interface BlockNumberSuccess {
  data: number;
  error: null;
}

interface BlockNumberError {
  data: null;
  error: string;
}

type BlockNumberResult = BlockNumberSuccess | BlockNumberError;

// Types for Ethereum Transaction Details
export interface TransactionDetails {
  blockHash: string | null;
  blockNumber: string | null; // Hex string
  from: string;
  to: string | null;
  gas: string; // Hex string
  gasPrice: string; // Hex string
  hash: string;
  value: string; // Hex string in wei
  input: string;
  nonce: string; // Hex string
  transactionIndex: string | null; // Hex string
  type: string; // Hex string
  v: string; // Hex string
  r: string; // Hex string
  s: string; // Hex string
}

interface TransactionDetailsSuccess {
  data: TransactionDetails | null; // Can be null if not found
  error: null;
}

interface TransactionDetailsError {
  data: null;
  error: string;
}

export type TransactionDetailsResult = TransactionDetailsSuccess | TransactionDetailsError;

// Types for Bitcoin Transaction Details
export interface BitcoinTransactionDetails {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: any[]; // Simplified for this example
  vout: {
    value: number;
    n: number;
    scriptPubKey: {
      asm: string;
      hex: string;
      reqSigs?: number;
      type: string;
      addresses?: string[];
    };
  }[];
  blockhash: string;
  confirmations: number;
  time: number;
  blocktime: number;
}


interface BitcoinTransactionDetailsSuccess {
  data: BitcoinTransactionDetails | null;
  error: null;
}

interface BitcoinTransactionDetailsError {
  data: null;
  error: string;
}

export type BitcoinTransactionDetailsResult =
  | BitcoinTransactionDetailsSuccess
  | BitcoinTransactionDetailsError;
  
// Types for Wallet Balance
export interface WalletBalance {
  balance: string;
  symbol: string;
}

interface WalletBalanceSuccess {
  data: WalletBalance | null;
  error: null;
}

interface WalletBalanceError {
  data: null;
  error: string;
}

export type WalletBalanceResult = WalletBalanceSuccess | WalletBalanceError;

export async function getEthereumBalance(
  address: string
): Promise<WalletBalanceResult> {
  const QUICKNODE_ETHEREUM_RPC_URL = process.env.QUICKNODE_ETHEREUM_RPC_URL;
  const QUICKNODE_ETHEREUM_API_KEY = process.env.QUICKNODE_ETHEREUM_API_KEY;

  if (!QUICKNODE_ETHEREUM_RPC_URL || !QUICKNODE_ETHEREUM_API_KEY) {
    return {
      data: null,
      error: 'Server configuration error: RPC endpoint or API Key is missing.',
    };
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return { data: null, error: 'Invalid Ethereum address format.' };
  }

  const QUICKNODE_ENDPOINT = `${QUICKNODE_ETHEREUM_RPC_URL}${QUICKNODE_ETHEREUM_API_KEY}/`;

  try {
    const response = await fetch(QUICKNODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      }),
      next: { revalidate: 10 }, // Cache for 10 seconds
    });

    if (!response.ok) {
      return {
        data: null,
        error: `API request failed with status ${response.status}.`,
      };
    }

    const json = await response.json();

    if (json.error) {
      return {
        data: null,
        error: json.error.message || 'An unknown JSON-RPC error occurred.',
      };
    }

    const balanceHex = json.result;
    const balanceWei = parseInt(balanceHex, 16);
    const balanceEth = (balanceWei / 1e18).toFixed(8);

    return { data: { balance: balanceEth, symbol: 'ETH' }, error: null };
  } catch (e) {
    if (e instanceof Error) {
      return { data: null, error: e.message };
    }
    return {
      data: null,
      error: 'An unknown error occurred while fetching Ethereum balance.',
    };
  }
}

export async function getBitcoinBalance(
  address: string
): Promise<WalletBalanceResult> {
  // Note: Bitcoin balance lookups are more complex than Ethereum.
  // A common approach is to use a blockbook or indexer API.
  // For this example, we'll simulate a lookup.
  // In a real-world scenario, you would integrate with a service like BlockCypher, Blockchain.com API, or your own Bitcoin node with an indexer.

  // This is a placeholder. Replace with a real Bitcoin balance API.
  // This example does not use a real Bitcoin balance API.
  return {
    data: { balance: (Math.random() * 10).toFixed(8), symbol: 'BTC' },
    error: null,
  };
}

export async function getBitcoinTransactionDetails(
  transactionId: string
): Promise<BitcoinTransactionDetailsResult> {
  const QUICKNODE_BITCOIN_RPC_URL = process.env.QUICKNODE_BITCOIN_RPC_URL;
  const QUICKNODE_BITCOIN_API_KEY = process.env.QUICKNODE_BITCOIN_API_KEY;

  if (!QUICKNODE_BITCOIN_RPC_URL || !QUICKNODE_BITCOIN_API_KEY) {
    return {
      data: null,
      error: 'Server configuration error: Bitcoin RPC endpoint or API Key is missing.',
    };
  }

  // Basic validation for a Bitcoin transaction ID (64 hex characters)
  if (!/^[a-fA-F0-9]{64}$/.test(transactionId)) {
    return { data: null, error: 'Invalid transaction ID format.' };
  }
  
  const QUICKNODE_BITCOIN_ENDPOINT = `${QUICKNODE_BITCOIN_RPC_URL}${QUICKNODE_BITCOIN_API_KEY}/`;

  try {
    const response = await fetch(QUICKNODE_BITCOIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        method: 'getrawtransaction',
        params: [transactionId, true], // Verbose output
        id: 'q-s-2', // Unique id
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        data: null,
        error: `API request failed with status ${response.status}.`,
      };
    }

    const json = await response.json();

    if (json.error) {
      return {
        data: null,
        error: json.error.message || 'An unknown JSON-RPC error occurred.',
      };
    }

    return { data: json.result, error: null };
  } catch (e) {
    if (e instanceof Error) {
      return { data: null, error: e.message };
    }
    return {
      data: null,
      error: 'An unknown error occurred while fetching Bitcoin transaction details.',
    };
  }
}

export async function getEthereumTransactionDetails(
  transactionHash: string
): Promise<TransactionDetailsResult> {
  const QUICKNODE_ETHEREUM_RPC_URL = process.env.QUICKNODE_ETHEREUM_RPC_URL;
  const QUICKNODE_ETHEREUM_API_KEY = process.env.QUICKNODE_ETHEREUM_API_KEY;

  if (!QUICKNODE_ETHEREUM_RPC_URL || !QUICKNODE_ETHEREUM_API_KEY) {
    return {
      data: null,
      error: 'Server configuration error: RPC endpoint or API Key is missing.',
    };
  }
  // Validate transaction hash format
  if (!/^0x([A-Fa-f0-9]{64})$/.test(transactionHash)) {
    return { data: null, error: 'Invalid transaction hash format.' };
  }


  const QUICKNODE_ENDPOINT = `${QUICKNODE_ETHEREUM_RPC_URL}${QUICKNODE_ETHEREUM_API_KEY}/`;

  try {
    const response = await fetch(QUICKNODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [transactionHash],
        id: 1,
      }),
      // Cache responses for a longer period as transaction details are immutable
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        data: null,
        error: `API request failed with status ${response.status}.`,
      };
    }

    const json = await response.json();

    if (json.error) {
      return {
        data: null,
        error: json.error.message || 'An unknown JSON-RPC error occurred.',
      };
    }

    return { data: json.result, error: null };
  } catch (e) {
    if (e instanceof Error) {
      return { data: null, error: e.message };
    }
    return {
      data: null,
      error: 'An unknown error occurred while fetching transaction details.',
    };
  }
}

export async function getEthereumBlockNumber(): Promise<BlockNumberResult> {
  const QUICKNODE_ETHEREUM_RPC_URL = process.env.QUICKNODE_ETHEREUM_RPC_URL;
  const QUICKNODE_ETHEREUM_API_KEY = process.env.QUICKNODE_ETHEREUM_API_KEY;

  if (!QUICKNODE_ETHEREUM_RPC_URL || !QUICKNODE_ETHEREUM_API_KEY) {
    console.error('QUICKNODE_ETHEREUM_RPC_URL or QUICKNODE_ETHEREUM_API_KEY environment variable is not set.');
    return {
      data: null,
      error: 'Server configuration error: RPC endpoint or API Key is missing.',
    };
  }

  const QUICKNODE_ENDPOINT = `${QUICKNODE_ETHEREUM_RPC_URL}${QUICKNODE_ETHEREUM_API_KEY}/`;


  try {
    const response = await fetch(QUICKNODE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      }),
      // Revalidate frequently to get near-live data, but cache for short periods
      // to prevent hitting rate limits on rapid refreshes.
      next: { revalidate: 5 },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('QuickNode API Error:', response.status, errorBody);
      return {
        data: null,
        error: `API request failed with status ${response.status}. Please check the endpoint and API key.`,
      };
    }

    const json = await response.json();

    if (json.error) {
      console.error('QuickNode JSON-RPC Error:', json.error);
      return {
        data: null,
        error: json.error.message || 'An unknown JSON-RPC error occurred.',
      };
    }

    const blockNumberHex = json.result;
    if (typeof blockNumberHex !== 'string' || !blockNumberHex.startsWith('0x')) {
      return { data: null, error: 'Invalid response format from API.' };
    }

    const blockNumber = parseInt(blockNumberHex, 16);

    if (isNaN(blockNumber)) {
      return { data: null, error: 'Failed to parse block number from API response.'};
    }

    return { data: blockNumber, error: null };
  } catch (e) {
    console.error('Network or unexpected error:', e);
    if (e instanceof Error) {
      return { data: null, error: e.message };
    }
    return {
      data: null,
      error: 'An unknown error occurred while fetching the block number.',
    };
  }
}

export async function getBitcoinBlockCount(): Promise<BlockNumberResult> {
  const QUICKNODE_BITCOIN_RPC_URL = 'https://wispy-muddy-mound.btc-testnet4.quiknode.pro/';
  const QUICKNODE_BITCOIN_API_KEY = '9d3168def96c68f2c77df93184521a4ac1aa661f';

  if (!QUICKNODE_BITCOIN_RPC_URL || !QUICKNODE_BITCOIN_API_KEY) {
    console.error(
      'QUICKNODE_BITCOIN_RPC_URL or QUICKNODE_BITCOIN_API_KEY environment variable is not set.'
    );
    return {
      data: null,
      error: 'Server configuration error: Bitcoin RPC endpoint or API Key is missing.',
    };
  }

  const QUICKNODE_BITCOIN_ENDPOINT = `${QUICKNODE_BITCOIN_RPC_URL}${QUICKNODE_BITCOIN_API_KEY}/`;

  try {
    const response = await fetch(QUICKNODE_BITCOIN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        method: 'getblockcount',
        params: [],
        id: 'q-s-1',
      }),
      next: { revalidate: 5 },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('QuickNode Bitcoin API Error:', response.status, errorBody);
      return {
        data: null,
        error: `API request failed with status ${response.status}.`,
      };
    }

    const json = await response.json();

    if (json.error) {
      console.error('QuickNode Bitcoin JSON-RPC Error:', json.error);
      return {
        data: null,
        error: json.error.message || 'An unknown JSON-RPC error occurred.',
      };
    }

    const blockCount = json.result;
    if (typeof blockCount !== 'number') {
      return { data: null, error: 'Invalid response format from API.' };
    }

    return { data: blockCount, error: null };
  } catch (e) {
    console.error('Network or unexpected error:', e);
    if (e instanceof Error) {
      return { data: null, error: e.message };
    }
    return {
      data: null,
      error: 'An unknown error occurred while fetching the block count.',
    };
  }
}
