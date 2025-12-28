import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { ethers } from 'ethers';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

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

router.get('/transfer_eth', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'transfer_eth.html'));
});

router.get('/latest_btc_block', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'latest_btc_block.html'));
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
        const provider = new ethers.JsonRpcProvider("https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/7e04ac7ec10c33d61d587d0f0e7ba52ca61fc6ba/");
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
        const provider = new ethers.JsonRpcProvider("https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/7e04ac7ec10c33d61d587d0f0e7ba52ca61fc6ba/");
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
    // You can get a free API key from https://etherscan.io/
    const apiKey = '';

    try {
        const response = await axios.get(
            `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apiKey}`
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching ETH transactions:', error);
        res.status(500).json({ error: 'Error fetching ETH transactions' });
    }
});

export default router;
