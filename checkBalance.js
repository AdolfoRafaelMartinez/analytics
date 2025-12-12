import axios from 'axios';

// IMPORTANT: Replace with your QuickNode endpoint URL
// You can get one for free at https://www.quicknode.com/
const QUICKNODE_URL = 'https://wispy-muddy-mound.btc-testnet4.quiknode.pro/9d3168def96c68f2c77df93184521a4ac1aa661f/';

async function getTestnetBalance(address) {
  if (QUICKNODE_URL === 'YOUR_QUICKNODE_URL_HERE') {
    console.error('Please replace "YOUR_QUICKNODE_URL_HERE" with your actual QuickNode endpoint URL in checkBalance.js');
    return;
  }

  try {
    const response = await axios.post(QUICKNODE_URL, {
      method: 'getaddressutxos',
      params: [{'addresses': [address]}]
    });

    if (response.data.error) {
      console.error('Error fetching balance from QuickNode:', response.data.error.message);
      return;
    }

    const utxos = response.data.result;
    const balance = utxos.reduce((acc, utxo) => acc + utxo.satoshis, 0);

    console.log(`Address: ${address}`);
    console.log(`Balance: ${balance} satoshis`);
    return balance;
  } catch (error) {
    console.error('Error fetching balance:', error.message);
  }
}

// Replace with the testnet address you want to check
const testnetAddress = 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx'; 
getTestnetBalance(testnetAddress);
