const get_transactions = async (event) => {
    event.preventDefault();
    const address = document.getElementById('address').value;
    const output_div = document.getElementById('output');

    output_div.innerHTML = "Fetching transactions...";

    try {
        const response = await fetch('/get_eth_transactions_by_address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address })
        });
        const data = await response.json();
        if (data.result && data.result.paginatedItems && data.result.paginatedItems.length > 0) {
            output_div.innerHTML = JSON.stringify(data.result.paginatedItems, null, 2);
        } else {
            output_div.innerHTML = "No transactions found for this address.";
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        output_div.innerHTML = "Error fetching transactions. Please check the address and try again.";
    }
};

document.getElementById('ethTransactionsForm').addEventListener('submit', get_transactions);
