import dotenv from 'dotenv';
dotenv.config();

const ETH_API_KEY = process.env.ETH_API_KEY;

const { ethers } = require('ethers';

const provider = new ethers.JsonRpcProvider(`https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/${ETH_API_KEY}/`);

async function getAllTransactionsInBlock(blockNumber) {
  // Get the block with full transaction details
  const block = await provider.getBlock(blockNumber, true);
  
  // Access all transactions
  const transactions = block.transactions;
  
  console.log(`Block ${blockNumber} contains ${transactions.length} transactions:`);
  
  transactions.forEach((tx, index) => {
    console.log(`Transaction ${index}:`, {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: tx.value.toString(),
      gasPrice: tx.gasPrice?.toString()
    });
  });
  
  return transactions;
}

getAllTransactionsInBlock(9834305);
