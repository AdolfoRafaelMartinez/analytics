var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "id": 1,
    "jsonrpc": "2.0",
    "method": "bb_getAddress",
    "params": [
        "2NAVfT2MEKVoaZmsbRtZ7t2oqyT1xV7u8h1",
        {
            "page": 1,
            "size": 1000,
            "fromHeight": 0,
            "details": "txids"
        }
    ]
});

var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
};

fetch("https://wispy-muddy-mound.btc-testnet4.quiknode.pro/9d3168def96c68f2c77df93184521a4ac1aa661f/", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));