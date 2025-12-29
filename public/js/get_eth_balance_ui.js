const get_balance = async () => {
    const address = document.getElementById('addressInput').value;
    const result_div = document.getElementById('walletInfo');
    const spinner = document.getElementById('spinner');

    if (!address) {
        result_div.innerHTML = "Please enter an Ethereum address.";
        return;
    }

    result_div.innerHTML = "";
    spinner.style.display = 'block';

    try {
        const response = await fetch('/get_eth_balance', {
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
        result_div.innerHTML = `Address: ${address}<br>Balance: ${data.balance} ETH`;
    } catch (error) {
        console.error('Error fetching balance:', error);
        result_div.innerHTML = `Error fetching balance: ${error.message}`;
    } finally {
        spinner.style.display = 'none';
    }
};

document.getElementById('addressInput').addEventListener('change', get_balance);
