document.addEventListener('DOMContentLoaded', async () => {
    const bestBtcHashResult = document.getElementById('bestBtcHashResult');

    try {
        const response = await fetch('/api/getbestblock');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        bestBtcHashResult.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error:', error);
        bestBtcHashResult.textContent = `Error: ${error.message}`;
    }
});
