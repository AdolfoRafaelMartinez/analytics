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
                display_wallet(wallet_data);
            } catch (error) {
                console.error('Error parsing wallet file:', error);
                alert('Error parsing wallet file. Please make sure it is a valid JSON file.');
            }
        };
        reader.readAsText(file);
    }
});

function display_wallet(wallet_data) {
    wallet_info_div.innerHTML = '';
    spinner.style.display = 'block';

    try {
        let wallet_info_html = '';

        if (wallet_data.network.startsWith('bitcoin')) {
            const child_keys_rows = wallet_data.childKeys.map(key => {
                const private_key = btoa(key.privateKey);
                const public_key = btoa(key.publicKey);

                return `
                    <tr>
                        <td><strong>${key.path}</strong></td>
                        <td>${truncate(key.address)}</td>
                        <td>${truncate(private_key)}</td>
                        <td>${truncate(public_key)}</td>
                    </tr>
                `;
            }).join('');

            wallet_info_html = `
                <style>
                    .wallet-table { width: 100%; border-collapse: collapse; }
                    .wallet-table th, .wallet-table td { border: 1px solid #ddd; padding: 8px; }
                    .wallet-table th { background-color: #f2f2f2; text-align: left; }
                </style>
                <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
                <p><strong>seed:</strong> ${wallet_data.seed}</p>
                <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">+</div>
                <p><strong>network:</strong> ${wallet_data.network}</p>
                <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
                <p><strong>root:</strong> ${wallet_data.root}</p>
                <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
                <h3>children:</h3>
                <table class="wallet-table">
                    <thead>
                        <tr>
                            <th>Path</th>
                            <th>Address</th>
                            <th>Private Key</th>
                            <th>Public Key</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${child_keys_rows}
                    </tbody>
                </table>
                <hr>
            `;
        } else if (wallet_data.network.startsWith('ethereum')) {
            const child_keys_rows = wallet_data.childKeys.map(key => {

                return `
                    <tr>
                        <td><strong>${key.path}</strong></td>
                        <td><a href="https://sepolia.etherscan.io/address/${key.address}" target="_blank" rel="noopener noreferrer">${truncate(key.address)}</a></td>
                        <td>${truncate(key.privateKey)}</td>
                        <td>${truncate(key.publicKey)}</td>
                    </tr>
                `;
            }).join('');

            wallet_info_html = `
                <style>
                    .wallet-table { width: 100%; border-collapse: collapse; }
                    .wallet-table th, .wallet-table td { border: 1px solid #ddd; padding: 8px; }
                    .wallet-table th { background-color: #f2f2f2; text-align: left; }
                </style>
                <br>
                <h3>parent:</h3>
                <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
                <p>address: <a href="https://sepolia.etherscan.io/address/${wallet_data.root.address}" target="_blank" rel="noopener noreferrer">${truncate(wallet_data.root.address)}</a></p>
                <p>privateKey: ${truncate(wallet_data.root.privateKey)}</p>
                <p>publicKey: ${truncate(wallet_data.root.publicKey)}</p>
                <div style="text-align: left; font-size: 2em; margin: 0.5em 0;">&darr;</div>
                <h3>children:</h3>
                <table class="wallet-table">
                    <thead>
                        <tr>
                            <th>Path</th>
                            <th>Address</th>
                            <th>Private Key</th>
                            <th>Public Key</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${child_keys_rows}
                    </tbody>
                </table>
                <hr>
            `;
        } else {
            alert("oh oh!");
        }
        wallet_info_div.innerHTML = wallet_info_html;
    } catch (error) {
        console.error('Error displaying wallet:', error);
        wallet_info_div.innerHTML = `Error displaying wallet: ${error.message}`;
    } finally {
        spinner.style.display = 'none';
    }
}
