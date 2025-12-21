document.getElementById('transferButton').addEventListener('click', async () => {
    const senderPrivateKey = document.getElementById('senderPrivateKey').value;
    const recipientAddress = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('amount').value;
    const spinner = document.getElementById('spinner');
    const resultDiv = document.getElementById('result');

    spinner.style.display = 'block';
    resultDiv.innerHTML = '';

    try {
        const response = await fetch('/transfer-eth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ senderPrivateKey, recipientAddress, amount }),
        });

        const result = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `Transaction successful! Transaction Hash: ${result.txHash}`;
        } else {
            resultDiv.innerHTML = `Error: ${result.error}`;
        }
    } catch (error) {
        resultDiv.innerHTML = `Error: ${error.message}`;
    }
    finally {
        spinner.style.display = 'none';
    }
});