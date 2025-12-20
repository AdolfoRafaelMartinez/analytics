import { createHDWallet } from './createHDWalletM49.js';
const createWalletBtn = document.getElementById('createWalletBtn');
const walletInfoDiv = document.getElementById('walletInfo');
const spinner = document.getElementById('spinner');
const mnemonicInput = document.getElementById('mnemonicInput');

createWalletBtn.addEventListener('click', () => {
    walletInfoDiv.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const mnemonic = mnemonicInput.value.trim();
        if (!mnemonic) {
            walletInfoDiv.innerHTML = 'Please enter a mnemonic phrase.';
            return;
        }
        const wallet = createHDWallet(mnemonic);
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
        walletInfoDiv.innerHTML = `
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
            <p><strong>seed:</strong> ${wallet.seed.toBase64()}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">+</div>
            <p><strong>network:</strong> ${(wallet.network.messagePrefix.toLowerCase().includes("bitcoin")) ? "bitcoin test" : "unknown"}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
            <p><strong>root:</strong> ${wallet.root.chainCode.toBase64()}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
            <h3>children:</h3>
            ${childKeysHtml}
            <hr>
        `;
    } catch (error) {
        console.error('Error creating wallet:', error);
        walletInfoDiv.innerHTML = `Error creating wallet: ${error.message}`;
    } finally {
        spinner.style.display = 'none';
    }
});