import { ethers } from '/node_modules/ethers/dist/ethers.js';

const getTransactions = async (event) => {
    event.preventDefault();
    const address = document.getElementById('address').value;
    const outputDiv = document.getElementById('output');
    
    outputDiv.innerHTML = "Fetching transactions...";

    try {
        const provider = new ethers.JsonRpcProvider("https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/7e04ac7ec10c33d61d587d0f0e7ba52ca61fc6ba/");
        const history = await provider.getHistory(address);
        if (history.length === 0) {
            outputDiv.innerHTML = "No transactions found for this address.";
            return;
        }
        outputDiv.innerHTML = JSON.stringify(history, null, 2);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        outputDiv.innerHTML = "Error fetching transactions. Please check the address and try again.";
    }
};

document.getElementById('ethTransactionsForm').addEventListener('submit', getTransactions);