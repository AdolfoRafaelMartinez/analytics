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

        const responseText = await response.text();
        if (!responseText) {
            throw new Error("Empty response from server.");
        }
        const data = JSON.parse(responseText);

        if (response.status >= 400) {
            throw new Error(data.error || "Server error");
        }

        if (data && data.paginatedItems && data.paginatedItems.length > 0) {
            output_div.innerHTML = `<pre>${JSON.stringify(data.paginatedItems, null, 2)}</pre>`;
        } else {
            output_div.innerHTML = "No transactions found for this address.";
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        output_div.innerHTML = `Error fetching transactions: ${error.message}`;
    }
};

document.getElementById('ethTransactionsForm').addEventListener('submit', get_transactions);