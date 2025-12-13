var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": [
    "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    "latest"
  ]
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://attentive-lingering-isle.sepolia.quiknode.pro/269f89a463c647898299abddd6a583e25b16df8d/", requestOptions)
  .then(response => response.json())
  .then(result => {
    const balanceInWei = parseInt(result.result, 16);
    const balanceInEther = balanceInWei / 1e18;
    console.log("Balance in Wei:", balanceInWei);
    console.log("Balance in Ether:", balanceInEther);
  })
  .catch(error => console.log('error', error));