import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get('/get_accounts', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'get_accounts.html'));
});

router.get('/create_hd_wallet', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'create_hd_wallet.html'));
});

router.get('/eth_balance', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'eth_balance.html'));
});

router.get('/get_eth_balance', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'get_eth_balance.html'));
});

export default router;