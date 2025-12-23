import { ethers } from "ethers";
import { create_hd_wallet_bitcoin, create_hd_wallet_ethereum } from './createHDWalletM49.js';
const createWalletBtn = document.getElementById('createWalletBtn');
const walletInfoDiv = document.getElementById('walletInfo');
const spinner = document.getElementById('spinner');
const mnemonicInput = document.getElementById('mnemonicInput');
const networkSelector = document.getElementById('networkSelector');

document.addEventListener('DOMContentLoaded', () => {
    fetch('/load_wallet_data')
        .then(response => response.json())
        .then(data => {
            if (data.mnemonic) {
                mnemonicInput.textContent = data.mnemonic;
            }
        })
        .catch(error => {
            console.error('Error loading wallet data:', error);
        });
});

createWalletBtn.addEventListener('click', () => {
    walletInfoDiv.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const mnemonic = mnemonicInput.textContent.trim();
        if (!mnemonic) {
            walletInfoDiv.innerHTML = 'Please enter a mnemonic phrase.';
            spinner.style.display = 'none';
            return;
        }
        const network = networkSelector.value;
        let wallet;
        let walletInfoHtml = '';

        if (network === 'bitcoin_testnet') {
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
        } else if (network === 'ethereum_sepolia') {
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

        // Save the entire wallet object
        fetch('/save-mnemonic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(wallet),
        })
        .then(response => response.json())
        .then(data => console.log(data.message))
        .catch(error => console.error('Error saving wallet:', error));

        walletInfoDiv.innerHTML = walletInfoHtml;
    } catch (error) {
        console.error('Error creating wallet:', error);
        walletInfoDiv.innerHTML = `Error creating wallet: ${error.message}`;
    } finally {
        spinner.style.display = 'none';
    }
});
