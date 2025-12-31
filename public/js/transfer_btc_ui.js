document.addEventListener('DOMContentLoaded', function() {
    const transferBtn = document.getElementById('transferBtn');
    const transferResult = document.getElementById('transferResult');

    transferBtn.addEventListener('click', function() {
        const fromAddress = document.getElementById('fromAddress').value;
        const toAddress = document.getElementById('toAddress').value;
        const amount = document.getElementById('amount').value;
        const privateKey = document.getElementById('privateKey').value;

        fetch('/transfer-btc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fromAddress, toAddress, amount, privateKey })
        })
        .then(response => response.json())
        .then(data => {
            transferResult.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error:', error);
            transferResult.textContent = 'An error occurred while transferring BTC.';
        });
    });
});