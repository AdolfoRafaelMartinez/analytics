import { ethers } from "ethers";
import { create_hd_wallet_bitcoin, create_hd_wallet_ethereum } from './createHDWalletM49.js';
const walletInfoDiv = document.getElementById('walletInfo');
const spinner = document.getElementById('spinner');
const mnemonicInput = document.getElementById('mnemonicInput');
const networkSelector = document.getElementById('networkSelector');
const walletFile = document.getElementById('walletFile');

walletFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const walletData = JSON.parse(e.target.result);
                mnemonicInput.textContent = walletData.mnemonic;
                networkSelector.innerHTML = walletData.network;
                await createWallet();
            } catch (error) {
                console.error('Error parsing wallet file:', error);
                alert('Error parsing wallet file. Please make sure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
});

async function createWallet() {
    walletInfoDiv.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const mnemonic = mnemonicInput.textContent;
        const network = networkSelector.innerHTML;
        let wallet;
        let walletInfoHtml = '';

        if (network === 'bitcoin-testnet4') {
            wallet = create_hd_wallet_bitcoin(mnemonic);
            let childKeysHtml = '<table border="1"><tr><th>Path</th><th>Address</th><th>Private Key</th><th>Public Key</th></tr>';
            wallet.childKeys.forEach(key => {
                childKeysHtml += `
                    <tr>
                        <td><strong>${key.path}</strong></td>
                        <td>${key.address}</td>
                        <td>${btoa(key.privateKey)}</td>
                        <td>${btoa(key.publicKey)}</td>
                    </tr>
                `;
            });
            childKeysHtml += '</table>';

            walletInfoHtml = `
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <p><strong>seed:</strong> ${wallet.seed.toString('base64')}</p>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">+</div>
                <p><strong>network:</strong> ${network}</p>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <p><strong>root:</strong> ${wallet.root.chainCode.toString('base64')}</p>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <h3>children:</h3>
                ${childKeysHtml}
                <hr>
            `;
        } else if (network === 'ethereum-sepolia') {
            wallet = create_hd_wallet_ethereum(mnemonic);
            let childKeysHtml = '<table border="1"><tr><th>Path</th><th>Address</th><th>Private Key</th><th>Public Key</th><th>quicknode bal</th><th>ankr bal</th></tr>';
            const provider = new ethers.JsonRpcProvider("https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/7e04ac7ec10c33d61d587d0f0e7ba52ca61fc6ba/");
            const provider2 = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_sepolia/13c41833c6f210b90724b4042a730bed83958ca5d5966952fba35b42ef3e8e31");
            let totalBalance = 0;
            let totalBalance2 = 0;

            for (const key of wallet.childKeys) {
                const balanceInWei = await provider.getBalance(key.address);
                const balanceInEther = ethers.formatEther(balanceInWei);
                totalBalance += parseFloat(balanceInEther);
                const balanceInWei2 = await provider2.getBalance(key.address);
                const balanceInEther2 = ethers.formatEther(balanceInWei2);
                totalBalance2 += parseFloat(balanceInEther2);
                childKeysHtml += `
                    <tr>
                        <td><strong>${key.path}</strong></td>
                        <td><a href=\"https://sepolia.etherscan.io/address/${key.address}\" target=\"_blank\" rel=\"noopener noreferrer\">${key.address}</a></td>
                        <td>${key.privateKey}</td>
                        <td>${key.publicKey}</td>
                        <td>${balanceInEther} ETH</td>
                        <td>${balanceInEther2} ETH</td>
                    </tr>
                `;
            }
            childKeysHtml += `
                <tr>
                    <td colspan="4" style="text-align: right;"><strong>Total Balance:</strong></td>
                    <td>${totalBalance.toFixed(4)} ETH</td>
                    <td>${totalBalance2.toFixed(4)} ETH</td>
                </tr>
            `;
            childKeysHtml += '</table>';

            walletInfoHtml = `
                <br>
                <h3>parent:</h3>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <p>: </p>
                <p>address: <a href=\"https://sepolia.etherscan.io/address/${wallet.root.address}\" target=\"_blank\" rel=\"noopener noreferrer\">${wallet.root.address}</a></p>
                <p>privateKey: ${wallet.root.privateKey}</p>
                <p>publicKey: ${wallet.root.publicKey}</p>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <h3>children:</h3>
                ${childKeysHtml}
                <hr>
            `;
        } else {
            alert("oh oh!");
        }
        walletInfoDiv.innerHTML = walletInfoHtml;
    } catch (error) {
        console.error('Error creating wallet:', error);
        walletInfoDiv.innerHTML = `Error creating wallet: ${error.message}`;
    } finally {
        spinner.style.display = 'none';
    }
}