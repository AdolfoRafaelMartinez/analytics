document.getElementById('get_balance_button').addEventListener('click', async () => {
    const address = document.getElementById('address_input').value;
    const spinner = document.getElementById('spinner');
    const wallet_info_div = document.getElementById('wallet_info_div');

    if (!address) {
        alert('Please enter a Bitcoin address.');
        return;
    }

    spinner.style.display = 'block';
    wallet_info_div.innerHTML = '';

    try {
        const response = await fetch('/get_btc_balance_sdk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        wallet_info_div.innerHTML = `<p>Balance: ${data.balance} BTC</p>`;

    } catch (error) {
        console.error('Error fetching balance:', error);
        wallet_info_div.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    } finally {
        spinner.style.display = 'none';
    }
});