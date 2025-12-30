
document.addEventListener('DOMContentLoaded', function() {
    const getTransactionsByBlockBtn = document.getElementById('getTransactionsByBlockBtn');
    if (getTransactionsByBlockBtn) {
        getTransactionsByBlockBtn.addEventListener('click', function() {
            const blockNumber = document.getElementById('blockNumber').value;
            if (!blockNumber) {
                alert('Please enter a block number.');
                return;
            }
            fetch('/get_btc_transactions_by_block', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ blockNumber: blockNumber })
            })
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('transactionsByBlockResult');
                resultDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            })
            .catch(error => {
                console.error('Error:', error);
                const resultDiv = document.getElementById('transactionsByBlockResult');
                resultDiv.innerHTML = `<p>Error fetching transactions. Please check the console for details.</p>`;
            });
        });
    }
});
