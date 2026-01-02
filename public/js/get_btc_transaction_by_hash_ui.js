document.addEventListener('DOMContentLoaded', () => {
    const getTransactionBtn = document.getElementById('getTransactionBtn');
    const txHashInput = document.getElementById('txHash');
    const transactionResult = document.getElementById('transactionResult');

    getTransactionBtn.addEventListener('click', async () => {
        const txHash = txHashInput.value.trim();
        if (!txHash) {
            alert('Please enter a transaction hash.');
            return;
        }

        try {
            const response = await fetch('/get_btc_transaction_by_hash', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ txHash })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Network response was not ok');
            }

            transactionResult.textContent = JSON.stringify(result, null, 2);
        } catch (error) {
            console.error('Error fetching transaction:', error);
            transactionResult.textContent = error.message;
        }
    });
});
