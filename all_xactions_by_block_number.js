const { ethers } = require('ethers');

const provider = new ethers.JsonRpcProvider('https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/7e04ac7ec10c33d61d587d0f0e7ba52ca61fc6ba/');

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
