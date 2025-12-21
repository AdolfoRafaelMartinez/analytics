const QUICKNODE_URL = 'https://wispy-muddy-mound.btc-testnet4.quiknode.pro/9d3168def96c68f2c77df93184521a4ac1aa661f/';

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "method": "getblockchaininfo",
    "params": [],
    "id": 1,
    "jsonrpc": "2.0"
});

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
};

fetch(QUICKNODE_URL, requestOptions)
    .then(response => response.text())
    .then(result => {
        document.getElementById('output').textContent = result;
    })
    .catch(error => console.log('error', error));
