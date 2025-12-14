import { ethers } from '/node_modules/ethers/dist/ethers.esm.js';

document.getElementById('createWalletBtn').addEventListener('click', async () => {
    const address = document.getElementById('addressInput').value;
    const resultDiv = document.getElementById('walletInfo');
    const spinner = document.getElementById('spinner');

    if (!address) {
        resultDiv.innerHTML = "Please enter an Ethereum address.";
        return;
    }

    resultDiv.innerHTML = "";
    spinner.style.display = 'block';

    try {
        const provider = new ethers.JsonRpcProvider("https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/7e04ac7ec10c33d61d587d0f0e7ba52ca61fc6ba/");
        const balanceInWei = await provider.getBalance(address);
        const balanceInEther = ethers.formatEther(balanceInWei);
        resultDiv.innerHTML = `Address: ${address}<br>Balance: ${balanceInEther} ETH`;
    } catch (error) {
        console.error('Error fetching balance:', error);
        resultDiv.innerHTML = "Error fetching balance. Please check the address and try again.";
    } finally {
        spinner.style.display = 'none';
    }
});