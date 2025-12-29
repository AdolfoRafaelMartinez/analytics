document.getElementById('transferButton').addEventListener('click', async () => {
    const senderPrivateKey = document.getElementById('senderPrivateKey').value;
    const recipientAddress = document.getElementById('recipientAddress').value;
    const amount = document.getElementById('amount').value;
    const spinner = document.getElementById('spinner');
    const resultDiv = document.getElementById('result');

    spinner.style.display = 'block';
    resultDiv.innerHTML = '';
    resultDiv.className = '';

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
            resultDiv.className = 'result-message';
            resultDiv.innerHTML = `Transaction sent! Transaction Hash: ${result.txHash}. Waiting for confirmation...`;

            const interval = setInterval(async () => {
                try {
                    const receiptResponse = await fetch(`/get-transaction-receipt/${result.txHash}`);
                    const receiptResult = await receiptResponse.json();

                    if (receiptResponse.ok && receiptResult.receipt) {
                        if (receiptResult.receipt.blockNumber) {
                            clearInterval(interval);
                            resultDiv.innerHTML = `Transaction confirmed in block: ${receiptResult.receipt.blockNumber}.<br>Transaction Hash: ${result.txHash}`;
                            spinner.style.display = 'none';
                        } else {
                            resultDiv.innerHTML = `Transaction in mempool. Waiting for confirmation...<br>Transaction Hash: ${result.txHash}`;
                        }
                    } else if (!receiptResponse.ok) {
                        clearInterval(interval);
                    }
                } catch (error) {
                    clearInterval(interval);
                }
            }, 5000);

        } else {
            resultDiv.className = 'result-message error';
            resultDiv.innerHTML = `Error: ${result.error}`;
            spinner.style.display = 'none';
        }
    } catch (error) {
        resultDiv.className = 'result-message error';
        resultDiv.innerHTML = `Error: ${error.message}`;
        spinner.style.display = 'none';
    }
});