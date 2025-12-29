document.getElementById('getTransactionForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const txHash = document.getElementById('txHash').value;
    const response = await fetch(`/get_transaction_by_hash?hash=${txHash}`);
    const data = await response.json();
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
});