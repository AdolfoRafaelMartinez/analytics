document.getElementById('blockTransactionsForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const blockNumber = document.getElementById('blockNumber').value;
    const response = await fetch(`/get_block_transactions?blockNumber=${blockNumber}`);
    const data = await response.json();
    document.getElementById('output').textContent = JSON.stringify(data, null, 2);
});