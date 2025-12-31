      document.addEventListener('DOMContentLoaded', function () {
          const getBlockBtn = document.getElementById('getBlockBtn');
          const blockHashInput = document.getElementById('blockHash');
          const blockResult = document.getElementById('blockResult');
      
          getBlockBtn.addEventListener('click', function () {
              const blockHash = blockHashInput.value.trim();
      
              if (blockHash === '') {
                  alert('Please enter a block hash.');
                  return;
              }
      
              fetch('/get_btc_block_by_hash', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ blockHash: blockHash })
              })
              .then(response => response.json())
              .then(data => {
                  blockResult.textContent = JSON.stringify(data, null, 2);
              })
              .catch(error => {
                  console.error('Error:', error);
                  blockResult.textContent = 'Error: ' + error.message;
              });
          });
      });