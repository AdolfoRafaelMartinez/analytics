import { generateChildKeys } from './get_accounts.js';

const generateKeysBtn = document.getElementById('generateKeysBtn');
const keysInfoDiv = document.getElementById('keysInfo');
const spinner = document.getElementById('spinner');

generateKeysBtn.addEventListener('click', () => {
    keysInfoDiv.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const keys = generateChildKeys();
        let keysHtml = '<h3>Derived Child Keys:</h3>';
        keys.forEach(key => {
            keysHtml += `
                <div>
                    <p><strong>Path:</strong> ${key.path}</p>
                    <p><strong>Address:</strong> ${key.address}</p>
                    <p><strong>Private Key (WIF):</strong> ${key.privateKey}</p>
                </div>
                <hr>
            `;
        });

        keysInfoDiv.innerHTML = keysHtml;
    } catch (error) {
        console.error('Error generating keys:', error);
        keysInfoDiv.innerHTML = "Error generating keys. Please try again.";
    } finally {
        spinner.style.display = 'none';
    }
});
