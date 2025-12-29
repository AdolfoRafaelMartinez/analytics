
const getTransactions = async (event) => {
    event.preventDefault();
    const address = document.getElementById('address').value;
    const outputDiv = document.getElementById('output');

    outputDiv.innerHTML = "Fetching transactions...";

    try {
        const response = await fetch("https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/7e04ac7ec10c33d61d587d0f0e7ba52ca61fc6ba/", {
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
            outputDiv.innerHTML = JSON.stringify(data.result.paginatedItems, null, 2);
        } else {
            outputDiv.innerHTML = "No transactions found for this address.";
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
        outputDiv.innerHTML = "Error fetching transactions. Please check the address and try again.";
    }
};

document.getElementById('ethTransactionsForm').addEventListener('submit', getTransactions);
