document.addEventListener('DOMContentLoaded', () => {
    const getBestBtcHashForm = document.getElementById('getBestBtcHashForm');
    const bestBtcHashResult = document.getElementById('bestBtcHashResult');

    getBestBtcHashForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        try {
            // First API call to get the best block hash
            const response1 = await fetch('https://bitcoin-testnet-rpc.publicnode.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    jsonrpc: '1.0',
                    id: 'curltest',
                    method: 'getbestblockhash',
                    params: [],
                }),
            });

            if (!response1.ok) {
                throw new Error(`HTTP error! status: ${response1.status}`);
            }

            const data1 = await response1.json();
            const bestBlockHash = data1.result;

            // Second API call to get the block details using the best block hash
            const response2 = await fetch('https://bitcoin-testnet-rpc.publicnode.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    jsonrpc: '1.0',
                    id: 'curltest',
                    method: 'getblock',
                    params: [bestBlockHash],
                }),
            });

            if (!response2.ok) {
                throw new Error(`HTTP error! status: ${response2.status}`);
            }

            const data2 = await response2.json();

            bestBtcHashResult.textContent = JSON.stringify(data2, null, 2);
        } catch (error) {
            console.error('Error:', error);
            bestBtcHashResult.textContent = `Error: ${error.message}`;
        }
    });
});
