import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

router.get('/create_mnemonic', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'create_mnemonic.html'));
});

router.get('/create_hd_wallet', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'create_hd_wallet.html'));
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

router.post('/save-mnemonic', (req, res) => {
    const { mnemonic } = req.body;
    fs.writeFile('mnemonic.txt', mnemonic, (err) => {
        if (err) {
            console.error('Error saving mnemonic:', err);
            return res.status(500).json({ message: 'Error saving mnemonic' });
        }
        res.json({ message: 'Mnemonic saved successfully' });
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

export default router;