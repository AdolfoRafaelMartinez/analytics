import dotenv from 'dotenv';
dotenv.config();

const ETH_API_KEY = process.env.ETH_API_KEY;

const get_transactions = async (event) => {
    event.preventDefault();
    const address = document.getElementById('address').value;
    const output_div = document.getElementById('output');

    output_div.innerHTML = "Fetching transactions...";

    try {
        const response = await fetch(`https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/${ETH_API_KEY}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                method: 'qn_getTransactionsByAddress',
                params: [{
                    address: address,
                    page: 1,
                    perPage: 10
                }],
                id: 1,
                jsonrpc: "2.0"
            })
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
