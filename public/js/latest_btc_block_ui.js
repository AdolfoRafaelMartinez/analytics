const output_div = document.getElementById('output');

const get_latest_block = async () => {
    output_div.innerHTML = "Fetching latest block...";
    try {
        const response = await fetch('/api/latest_btc_block');
        const data = await response.json();
        output_div.innerHTML = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Error fetching latest block:', error);
        output_div.innerHTML = "Error fetching latest block. Please try again.";
    }
};

get_latest_block();
