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
        reader.onload = (e) => {
            try {
                const walletData = JSON.parse(e.target.result);
                mnemonicInput.textContent = walletData.mnemonic;
                networkSelector.innerHTML = walletData.network;
                createWallet();
            } catch (error) {
                console.error('Error parsing wallet file:', error);
                alert('Error parsing wallet file. Please make sure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
});

function createWallet() {
    walletInfoDiv.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const mnemonic = mnemonicInput.textContent;
        const network = networkSelector.innerHTML;
        let wallet;
        let walletInfoHtml = '';

        if (network === 'bitcoin-testnet4') {
            wallet = create_hd_wallet_bitcoin(mnemonic);
            let childKeysHtml = '';
            wallet.childKeys.forEach(key => {
                childKeysHtml += `
                    <div>
                        <p>Path:<strong> ${key.path}</strong></p>
                        <p>Address: ${key.address}</p>
                        <p>Private Key: ${btoa(key.privateKey)}</p>
                        <p>Public Key: ${btoa(key.publicKey)}</p>
                    </div>
                    <hr>
                `;
            });

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
            let childKeysHtml = '';
            wallet.childKeys.forEach(key => {
                childKeysHtml += `
                    <div>
                        <p>Path:<strong> ${key.path}</strong></p>
                        <p>Address: ${key.address}</p>
                        <p>Private Key: ${key.privateKey}</p>
                        <p>Public Key: ${key.publicKey}</p>
                    </div>
                    <hr>
                `;
            });

            walletInfoHtml = `
                <br>
                <h3>parent:</h3>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <p>address: ${wallet.root.address}</p>
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

document.addEventListener('DOMContentLoaded', () => {
    fetch('/load_wallet_data')
        .then(response => response.json())
        .then(data => {
            mnemonicInput.textContent = data.mnemonic;
            networkSelector.innerHTML = data.network;
            createWallet();
        })
        .catch(error => {
            console.error('Error loading wallet data:', error);
        });
});