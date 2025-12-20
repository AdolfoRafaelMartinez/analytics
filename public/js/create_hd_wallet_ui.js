import { createHDWallet } from './createHDWalletM49.js';
const createWalletBtn = document.getElementById('createWalletBtn');
const walletInfoDiv = document.getElementById('walletInfo');
const spinner = document.getElementById('spinner');
const mnemonicInput = document.getElementById('mnemonicInput');
const saveMnemonicBtn = document.getElementById('saveMnemonicBtn');

createWalletBtn.addEventListener('click', () => {
    walletInfoDiv.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const mnemonic = mnemonicInput.value.trim();
        const wallet = createHDWallet(mnemonic);
        let childKeysHtml = '';
        wallet.childKeys.forEach(key => {
            childKeysHtml += `
                <hr>
                <div>
                    <p>Path:<strong> ${key.path}</strong></p>
                    <p>Address: ${key.address}</p>
                    <p>Private Key: ${btoa(key.privateKey)}</p>
                    <p>Public Key: ${btoa(key.publicKey)}</p>
                </div>
            `;
        });
        walletInfoDiv.innerHTML = `
            <p><strong>mnemonic:</strong> ${wallet.mnemonic}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
            <p><strong>seed:</strong> ${wallet.seed.toBase64()}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">+</div>
            <p><strong>network:</strong> ${(wallet.network.messagePrefix.toLowerCase().includes("bitcoin")) ? "bitcoin test" : "unknown"}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
            <p><strong>root:</strong> ${wallet.root.chainCode.toBase64()}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
            <h2>derived key pairs:</h2>
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

saveMnemonicBtn.addEventListener('click', () => {
    const mnemonic = mnemonicInput.value.trim();
    if (mnemonic) {
        fetch('/save-mnemonic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mnemonic })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error saving mnemonic:', error);
            alert('Error saving mnemonic');
        });
    } else {
        alert('Mnemonic phrase is empty');
    }
});