import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js';
import bitcoinRouter from './routes/bitcoin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use(express.json());

app.get('/get_latest_btc_block_by_rpc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_latest_btc_block_by_rpc.html'));
});

app.get('/get_btc_transaction_by_hash_by_rpc', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'get_btc_transaction_by_hash_by_rpc.html'));
});


// Use the router
app.use('/', indexRouter);
app.use('/api/bitcoin', bitcoinRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
