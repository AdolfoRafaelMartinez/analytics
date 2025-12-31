document.addEventListener('DOMContentLoaded', () => {
    const getBlockBtn = document.getElementById('getBlockBtn');
    const blockHashInput = document.getElementById('blockHash');
    const blockResultPre = document.getElementById('blockResult');

    getBlockBtn.addEventListener('click', async () => {
        const block_hash = blockHashInput.value;

        if (!block_hash) {
            alert('Please enter a block hash.');
            return;
        }

        try {
            const response = await fetch('/get_eth_block_by_hash', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ block_hash })
            });

            const result = await response.json();

            if (response.ok) {
                blockResultPre.textContent = JSON.stringify(result, null, 2);
            } else {
                blockResultPre.textContent = `Error: ${result.error}`;
            }
        } catch (error) {
            console.error('Error fetching ETH block:', error);
            blockResultPre.textContent = 'An error occurred while fetching the block.';
        }
    });
});