import dotenv from 'dotenv';
dotenv.config();
const ETH_API_KEY = process.env.ETH_API_KEY;

import { ethers } from 'ethers';

const QUICKNODE_URL = `https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/${ETH_API_KEY}/`;
const TX_HASH = '0x8ca3a7231664207a098db614e8c0c07a8573d004813b61c817c8b91d07d7cd67';

const provider = new ethers.JsonRpcProvider(QUICKNODE_URL);

async function getTransactionDetails() {
  try {
    const transaction = await provider.getTransaction(TX_HASH);
    if (transaction) {
      console.log('Transaction Details:', transaction);
      // You can access specific fields, e.g., transaction.from, transaction.to, transaction.value
    } else {
      console.log('Transaction not found or still pending.');
    }
  } catch (error) {
    console.error('Error fetching transaction:', error);
  }
}

getTransactionDetails();
