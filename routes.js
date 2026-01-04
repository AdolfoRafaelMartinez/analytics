
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

router.get('/get_latest_btc_block', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_latest_btc_block.html'));
});

router.get('/get_btc_transactions_by_block', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_btc_transactions_by_block.html'));
});

router.get('/get_transaction_by_hash', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_transaction_by_hash.html'));
});

router.get('/get_btc_balance', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_btc_balance.html'));
});

router.get('/create_wallet', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'create_wallet.html'));
});

router.get('/load_hd_wallet', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'load_hd_wallet.html'));
});

router.get('/transfer_btc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'transfer_btc.html'));
});

router.get('/latest_eth_block', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'latest_eth_block.html'));
});

router.get('/get_eth_transactions', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_eth_transactions.html'));
});

router.get('/get_eth_balance', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_eth_balance.html'));
});

router.get('/transfer_eth', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'transfer_eth.html'));
});

router.get('/get_latest_btc_block_by_rpc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_latest_btc_block_by_rpc.html'));
});

router.get('/get_btc_transaction_by_hash_by_rpc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_btc_transaction_by_hash_by_rpc.html'));
});

router.get('/get_latest_btc_block_transactions_by_rpc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_latest_btc_block_transactions_by_rpc.html'));
});

router.get('/get_btc_block_by_hash', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_btc_block_by_hash.html'));
});

router.get('/get_btc_transaction_by_hash', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_btc_transaction_by_hash.html'));
});

router.get('/get_eth_block_by_hash', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_eth_block_by_hash.html'));
});

export default router;
