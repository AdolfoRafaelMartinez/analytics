var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "id": 1,
  "jsonrpc": "2.0",
  "method": "eth_getBalance",
  "params": [
    "0xb18A9379E29fd7776BA69C0C3949E24BEF34177b",
    "latest"
  ]
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://wandering-ancient-voice.ethereum-sepolia.quiknode.pro/7e04ac7ec10c33d61d587d0f0e7ba52ca61fc6ba/", requestOptions)
  .then(response => response.json())
  .then(result => {
    const balanceInWei = parseInt(result.result, 16);
    const balanceInEther = balanceInWei / 1e18;
    console.log("Balance in Wei:", balanceInWei);
    console.log("Balance in Ether:", balanceInEther);
  })
  .catch(error => console.log('error', error));