import express from 'express';
const router = express.Router();
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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