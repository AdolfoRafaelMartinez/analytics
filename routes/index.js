import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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

export default router;