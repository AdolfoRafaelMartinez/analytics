import dotenv from 'dotenv';
dotenv.config();
const ETH_API_KEY = process.env.ETH_API_KEY;

import { ethers } from '/node_modules/ethers/dist/ethers.js';

const get_balance = async () => {
    const address = document.getElementById('addressInput').value;
    const result_div = document.getElementById('walletInfo');
    const spinner = document.getElementById('spinner');

    if (!address) {
        result_div.innerHTML = "Please enter an Ethereum address.";
        return;
    }

    result_div.innerHTML = "";
    spinner.style.display = 'block';

    try {
        const provider = new ethers.JsonRpcProvider(`https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/${ETH_API_KEY}/`);
        const balance_in_wei = await provider.getBalance(address);
        const balance_in_ether = ethers.formatEther(balance_in_wei);
        result_div.innerHTML = `Address: ${address}<br>Balance: ${balance_in_ether} ETH`;
    } catch (error) {
        console.error('Error fetching balance:', error);
        result_div.innerHTML = "Error fetching balance. Please check the address and try again.";
    } finally {
        spinner.style.display = 'none';
    }
};

document.getElementById('addressInput').addEventListener('change', get_balance);
