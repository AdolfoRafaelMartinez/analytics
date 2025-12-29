import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { ethers } from 'ethers';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();
const ETH_API_KEY = process.env.ETH_API_KEY;
const QN_ETH_URL = `https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/${ETH_API_KEY}/`;
const ANKR_URL = `https://rpc.ankr.com/eth_sepolia`;

router.get('/api/key', (req, res) => {
    res.json({ apiKey: ETH_API_KEY });
});

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.get('/create_wallet', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'create_wallet.html'));
});

router.get('/load_hd_wallet', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'load_hd_wallet.html'));
});

router.get('/hd_derivations', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'hd_derivations.html'));
});

router.get('/eth_balance', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'eth_balance.html'));
});

router.get('/get_eth_balance', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'get_eth_balance.html'));
});

router.post('/get_eth_balance', async (req, res) => {
    const { address } = req.body;

    try {
        const provider = new ethers.JsonRpcProvider(QN_ETH_URL);
        const balance_in_wei = await provider.getBalance(address);
        const balance_in_ether = ethers.formatEther(balance_in_wei);
        res.json({ balance: balance_in_ether });
    } catch (error) {
        console.error('Error fetching ETH balance:', error);
        res.status(500).json({ error: 'Error fetching ETH balance' });
    }
});

router.post('/get_eth_balances', async (req, res) => {
    const { addresses } = req.body;

    try {
        const provider_qn = new ethers.JsonRpcProvider(QN_ETH_URL);
        const provider_ankr = new ethers.JsonRpcProvider(ANKR_URL);

        const balances = await Promise.all(addresses.map(async (address) => {
            const balance_qn_wei = await provider_qn.getBalance(address);
            const balance_qn_ether = ethers.formatEther(balance_qn_wei);

            const balance_ankr_wei = await provider_ankr.getBalance(address);
            const balance_ankr_ether = ethers.formatEther(balance_ankr_wei);

            return {
                address,
                balance_qn: balance_qn_ether,
                balance_ankr: balance_ankr_ether,
            };
        }));

        res.json(balances);
    } catch (error) {
        console.error('Error fetching ETH balances:', error);
        res.status(500).json({ error: 'Error fetching ETH balances' });
    }
});

router.get('/transfer_eth', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'transfer_eth.html'));
});

router.get('/load_wallet_view', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'load_wallet_view.html'));
});

router.get('/get_btc_balance', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'get_btc_balance.html'));
});

router.post('/get_btc_balance', async (req, res) => {
    const { address } = req.body;

    try {
        const response = await axios.get(`https://blockstream.info/testnet4/api/address/${address}/utxo`);
        const utxos = response.data;
        const balance = utxos.reduce((acc, utxo) => acc + utxo.value, 0) / 100000000;
        res.json({ balance });
    } catch (error) {
        console.error('Error fetching BTC balance:', error);
        res.status(500).json({ error: 'Error fetching BTC balance' });
    }
});

router.post('/save-mnemonic', (req, res) => {
    const { mnemonic, network, filename } = req.body;
    const data = { mnemonic, network };
    fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error saving wallet:', err);
            return res.status(500).json({ message: 'Error saving wallet' });
        }
        res.json({ message: 'Wallet saved successfully' });
    });
});

router.post('/transfer-eth', async (req, res) => {
    const { senderPrivateKey, recipientAddress, amount } = req.body;

    try {
        const provider = new ethers.JsonRpcProvider(QN_ETH_URL);
        const wallet = new ethers.Wallet(senderPrivateKey, provider);
        const tx = await wallet.sendTransaction({
            to: recipientAddress,
            value: ethers.parseEther(amount)
        });
        res.json({ txHash: tx.hash });
    } catch (error) {
        console.error('Error sending transaction:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/get-transaction-receipt/:txHash', async (req, res) => {
    const { txHash } = req.params;
    try {
        const provider = new ethers.JsonRpcProvider(QN_ETH_URL);
        const receipt = await provider.getTransactionReceipt(txHash);
        res.json({ receipt });
    } catch (error) {
        console.error('Error getting transaction receipt:', error);
        res.status(500).json({ error: 'Error getting transaction receipt' });
    }
});

router.get('/load_wallet_data', (req, res) => {
    const { filename } = req.query;
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.json({ mnemonic: '' });
            }
            console.error('Error reading wallet file:', err);
            return res.status(500).json({ message: 'Error reading wallet file' });
        }
        try {
            const wallet = JSON.parse(data);
            res.json(wallet);
        } catch (parseErr) {
            console.error('Error parsing wallet file:', parseErr);
            res.status(500).json({ message: 'Error parsing wallet file' });
        }
    });
});

router.get('/get_eth_transactions', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'get_eth_transactions.html'));
});

router.post('/get_eth_transactions', async (req, res) => {
    const { address } = req.body;
    const API_KEY = process.env.API_KEY;

    try {
        const response = await axios.get(
            `https.api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${API_KEY}`
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching ETH transactions:', error);
        res.status(500).json({ error: 'Error fetching ETH transactions' });
    }
});

router.post('/get_eth_transactions_by_address', async (req, res) => {
    const { address } = req.body;
    try {
        const response = await axios.post(QN_ETH_URL, {
            method: 'qn_getTransactionsByAddress',
            params: [{
                address: address,
                page: 1,
                perPage: 10
            }],
            id: 1,
            jsonrpc: "2.0"
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching ETH transactions by address:', error);
        res.status(500).json({ error: 'Error fetching ETH transactions by address' });
    }
});

router.get('/get_transaction_by_hash', async (req, res) => {
    const { hash } = req.query;
    try {
        const provider = new ethers.JsonRpcProvider(QN_ETH_URL);
        const tx = await provider.getTransaction(hash);
        res.json(tx);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Error fetching transaction' });
    }
});

router.get('/get_transaction_by_hash_page', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'get_transaction_by_hash.html'));
});

router.get('/get_block_transactions', async (req, res) => {
    const { blockNumber } = req.query;
    try {
        const provider = new ethers.JsonRpcProvider(QN_ETH_URL);
        const block = await provider.getBlock(parseInt(blockNumber));
        res.json(block);
    } catch (error) {
        console.error('Error fetching block transactions:', error);
        res.status(500).json({ error: 'Error fetching block transactions' });
    }
});

router.get('/get_block_transactions_page', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'get_block_transactions.html'));
});

export default router;
