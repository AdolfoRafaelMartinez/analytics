import { createHDWallet } from './createHDWalletM49.js';
const createWalletBtn = document.getElementById('createWalletBtn');
const walletInfoDiv = document.getElementById('walletInfo');
const spinner = document.getElementById('spinner');

createWalletBtn.addEventListener('click', () => {
    walletInfoDiv.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const wallet = createHDWallet();
        let childKeysHtml = '';
        wallet.childKeys.forEach(key => {
            childKeysHtml += `
                <hr>
                <div>
                    <p><strong>Path:</strong> ${key.path}</p>
                    <p><strong>Address:</strong> ${key.address}</p>
                    <p><strong>Private Key (WIF):</strong> ${key.privateKey}</p>
                    <p><strong>Public Key (WIF):</strong> ${key.publicKey}</p>
                </div>
            `;
        });
        walletInfoDiv.innerHTML = `
            <p><strong>mnemonic:</strong> ${wallet.mnemonic}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
            <p><strong>seed:</strong> (Base64) ${wallet.seed.toBase64()}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">+</div>
            <p><strong>network:</strong> ${(wallet.network.messagePrefix.toLowerCase().includes("bitcoin")) ? "bitcoin test" : "unknown"}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
            <p><strong>root:</strong> (Base64) ${wallet.root.chainCode.toBase64()}</p>
            <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
            ${childKeysHtml}
            <hr>
        `;
    } catch (error) {
        console.error('Error creating wallet:', error);
        walletInfoDiv.innerHTML = "Error creating wallet. Please try again.";
    } finally {
        spinner.style.display = 'none';
    }
});
