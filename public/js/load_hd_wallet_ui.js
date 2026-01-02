import { create_hd_wallet_bitcoin, create_hd_wallet_ethereum } from './createHDWalletM49.js';
const wallet_info_div = document.getElementById('walletInfo');
const spinner = document.getElementById('spinner');
const mnemonic_input = document.getElementById('mnemonicInput');
const network_selector = document.getElementById('networkSelector');
const wallet_file = document.getElementById('walletFile');
const wallet_details = document.getElementById('walletDetails');

function truncate(str, n = 4) {
    if (!str) return '';
    if (str.length > n * 2) {
        return str.slice(0, n) + '...' + str.slice(str.length - n);
    }
    return str;
}

wallet_file.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const wallet_data = JSON.parse(e.target.result);
                mnemonic_input.textContent = wallet_data.mnemonic;
                network_selector.innerHTML = wallet_data.network;
                wallet_details.style.display = 'block';
                await create_wallet();
            } catch (error) {
                console.error('Error parsing wallet file:', error);
                alert('Error parsing wallet file. Please make sure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
});

async function create_wallet() {
    wallet_info_div.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const mnemonic = mnemonic_input.textContent;
        const network = network_selector.innerHTML;
        let wallet;
        let wallet_info_html = '';

        if (network === 'bitcoin-testnet4') {
            wallet = create_hd_wallet_bitcoin(mnemonic);
            const addresses = wallet.childKeys.map(key => key.address);

            /* const response = await fetch('/get_btc_balances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ addresses })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to fetch balances and parse error response' }));
                throw new Error(errorData.error || 'Failed to fetch balances');
            }
            
            const balances = await response.json();

            if (!Array.isArray(balances)) {
                console.error('Expected balances to be an array, but received:', balances);
                throw new Error('Invalid data format for balances received from the server.');
            } */

            let child_keys_html = '<table border="1"><tr><th>Path</th><th>Address</th><th>Private Key</th><th>Public Key</th><th>Balance</th></tr>';
            
            let total_balance = 0;

            for (const key of wallet.childKeys) {
                // const balanceData = balances.find(b => b.address === key.address);
                const balance = (Math.random() * 0.01).toFixed(8);
                
                total_balance += parseFloat(balance) || 0;

                const private_key = btoa(key.privateKey);
                const public_key = btoa(key.publicKey);
                child_keys_html += `
                    <tr>
                        <td><strong>${key.path}</strong></td>
                        <td>${truncate(key.address)}</td>
                        <td>${truncate(private_key)}</td>
                        <td>${truncate(public_key)}</td>
                        <td style="text-align: right;">${balance} BTC</td>
                    </tr>
                `;
            }
            child_keys_html += `
                <tr>
                    <td colspan="4" style="text-align: right;"><strong>Total:</strong></td>
                    <td style="text-align: right;"><strong>${total_balance.toFixed(8)} BTC</strong></td>
                </tr>
            `;
            child_keys_html += '</table>';

            wallet_info_html = `
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <p><strong>seed:</strong> ${wallet.seed.toString('base64')}</p>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">+</div>
                <p><strong>network:</strong> ${network}</p>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <p><strong>root:</strong> ${wallet.root.chainCode.toString('base64')}</p>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <h3>children:</h3>
                ${child_keys_html}
                <hr>
            `;
        } else if (network === 'ethereum-sepolia') {
            wallet = create_hd_wallet_ethereum(mnemonic);
            const addresses = wallet.childKeys.map(key => key.address);

            /* const response = await fetch('/get_eth_balances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ addresses })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Failed to fetch balances and parse error response' }));
                throw new Error(errorData.error || 'Failed to fetch balances');
            }
            
            const balances = await response.json();

            if (!Array.isArray(balances)) {
                console.error('Expected balances to be an array, but received:', balances);
                throw new Error('Invalid data format for balances received from the server.');
            } */

            let child_keys_html = '<table border="1"><tr><th>Path</th><th>Address</th><th>Private Key</th><th>Public Key</th><th>quicknode <span style="font-weight:normal">(bal)</span></th><th>ankr <span style="font-weight:normal">(bal)</span></th><th>| error |</th></tr>';
            
            let total_balance = 0;
            let total_balance2 = 0;
            let total_error = 0;

            for (const key of wallet.childKeys) {
                // const balanceData = balances.find(b => b.address === key.address);
                const balance_in_ether = (Math.random() * 0.1).toFixed(18);
                const balance_in_ether2 = (Math.random() * 0.1).toFixed(18);
                
                total_balance += parseFloat(balance_in_ether) || 0;
                total_balance2 += parseFloat(balance_in_ether2) || 0;
                
                const error = Math.abs(parseFloat(balance_in_ether) - parseFloat(balance_in_ether2)) || 0;
                total_error += error;

                child_keys_html += `
                    <tr>
                        <td><strong>${key.path}</strong></td>
                        <td><a href="https://sepolia.etherscan.io/address/${key.address}" target="_blank" rel="noopener noreferrer">${truncate(key.address)}</a></td>
                        <td>${truncate(key.privateKey)}</td>
                        <td>${truncate(key.publicKey)}</td>
                        <td style="text-align: right;">${balance_in_ether} ETH</td>
                        <td style="text-align: right;">${balance_in_ether2} ETH</td>
                        <td style="text-align: right;">${error.toFixed(18)} ETH</td>
                    </tr>
                `;
            }
            child_keys_html += `
                <tr>
                    <td colspan="4" style="text-align: right;"><strong>Totals:</strong></td>
                    <td style="text-align: right;"><strong>${total_balance.toFixed(4)} ETH</strong></td>
                    <td style="text-align: right;"><strong>${total_balance2.toFixed(4)} ETH</strong></td>
                    <td style="text-align: right;"><strong>${total_error.toFixed(4)} ETH</strong></td>
                </tr>
            `;
            child_keys_html += '</table>';

            wallet_info_html = `
                <br>
                <h3>parent:</h3>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <p>address: <a href="https://sepolia.etherscan.io/address/${wallet.root.address}" target="_blank" rel="noopener noreferrer">${truncate(wallet.root.address)}</a></p>
                <p>privateKey: ${truncate(wallet.root.privateKey)}</p>
                <p>publicKey: ${truncate(wallet.root.publicKey)}</p>
                <div style=\"text-align: left; font-size: 2em; margin: 0.5em 0;\">&darr;</div>
                <h3>children:</h3>
                ${child_keys_html}
                <hr>
            `;
        } else {
            alert("oh oh!");
        }
        wallet_info_div.innerHTML = wallet_info_html;
    } catch (error) {
        console.error('Error creating wallet:', error);
        wallet_info_div.innerHTML = `Error creating wallet: ${error.message}`;
    } finally {
        spinner.style.display = 'none';
    }
}
