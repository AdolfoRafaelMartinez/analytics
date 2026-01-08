import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRouter from './routes/index.js';
import bitcoinRouter from './routes/bitcoin.js';
import walletRouter from './routes/wallet.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use(express.json());

// Use the router
app.use('/', indexRouter);
app.use('/', bitcoinRouter);
app.use('/api/wallet', walletRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
