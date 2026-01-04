document.addEventListener('DOMContentLoaded', () => {
    const getTransactionForm = document.getElementById('getTransactionForm');
    const output = document.getElementById('output');

    getTransactionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const txHash = document.getElementById('txHash').value;
        try {
            const response = await fetch(`/get_btc_transaction_by_hash_by_rpc/${txHash}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const transaction = await response.json();
            output.textContent = JSON.stringify(transaction, null, 2);
        } catch (error) {
            output.textContent = `Error: ${error.message}`;
        }
    });
});