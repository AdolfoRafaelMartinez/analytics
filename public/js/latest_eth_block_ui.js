async function getLatestEthBlock() {
    const output = document.getElementById('output');
    output.textContent = 'Fetching latest block...';

    try {
        const response = await fetch('/api/latest_eth_block');
        const block = await response.json();
        output.textContent = JSON.stringify(block, null, 2);
    } catch (error) {
        console.error('Error fetching latest Ethereum block:', error);
        output.textContent = 'Error fetching latest Ethereum block.';
    }
}

getLatestEthBlock();