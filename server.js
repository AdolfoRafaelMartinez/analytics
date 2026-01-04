import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';
import bitcoinRouter from './routes/bitcoin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

app.use(express.json());

// Use the router
app.use('/', routes);
app.use('/api/bitcoin', bitcoinRouter);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
