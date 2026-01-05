import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const router = express.Router();
import path from 'path';
import { fileURLToPath } from 'url';
import { Core } from '@quicknode/sdk';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BTC_API_KEY = process.env.BTC_API_KEY;
const QN_BTC_URL = `https://wispy-muddy-mound.btc-testnet4.quiknode.pro/${BTC_API_KEY}/`

async function bitcoinRpc(method, params) {
    const response = await fetch('https://bitcoin-testnet-rpc.publicnode.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
            jsonrpc: '1.0',
            id: 'curltest',
            method,
            params,
        }),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.result;
}

router.post('/get_btc_balance_by_rpc', async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }
        const unspent = await bitcoinRpc('listunspent', [0, 9999999, [address]]);
        const balance = unspent.reduce((sum, utxo) => sum + utxo.amount, 0);
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const getBalanceWithSDK = async (address, endpointUrl) => {
  const core = new Core({
    endpointUrl: endpointUrl,
  });

  try {
    const balance = await core.client.getBalance({
      address: address,
    });
    return balance;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

router.get('/get_btc_balance_url', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'get_btc_balance_url.html'));
});

router.post('/get_btc_balance_url', async (req, res) => {
    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ error: 'Address is required' });
    }

    const requestBody = {
        method: "bb_getAddress",
        params: [address, { details: "basic" }], // 'basic' details are sufficient for balance
        id: 1,
        jsonrpc: "2.0",
    };

    try {
        const response = await fetch(QN_BTC_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            return 'method not found';
        }

        // The balance is returned in satoshis (1 BTC = 100 million satoshis)
        const balanceInSatoshis = data.result.balance;
        return balanceInSatoshis;

    } catch (error) {
        console.error("Error fetching Bitcoin balance:", error);
        return "Error fetching balance";
    }
});

router.get('/get_btc_balance_sdk', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'get_btc_balance_sdk.html'));
});

router.post('/get_btc_balance_sdk', async (req, res) => {
    try {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }
        const balance = await getBalanceWithSDK(address, QN_BTC_URL);
        res.json({ balance });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// block

router.get('/get_latest_btc_block_by_rpc', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'get_latest_btc_block_by_rpc.html'));
});

router.get('/api/get_latest_btc_block_by_rpc', async (req, res) => {
    try {
        const bestBlockHash = await bitcoinRpc('getbestblockhash', []);
        const block = await bitcoinRpc('getblock', [bestBlockHash]);
        res.json(block);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// transactions

router.get('/get_latest_btc_block_transactions_by_rpc', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'get_latest_btc_block_transactions_by_rpc.html'));
});

router.get('/api/get_latest_btc_block_transactions_by_rpc', async (req, res) => {
    try {
        const bestBlockHash = await bitcoinRpc('getbestblockhash', []);
        const block = await bitcoinRpc('getblock', [bestBlockHash]);
        res.json(block.tx);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/get_btc_transaction_by_hash_by_rpc', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'get_btc_transaction_by_hash_by_rpc.html'));
});

router.get('/get_btc_transaction_by_hash_by_rpc/:hash', async (req, res) => {
    try {
        const txid = req.params.hash;
        const transaction = await bitcoinRpc('getrawtransaction', [txid, true]);
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;