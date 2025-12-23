
import * as bip39 from "bip39";

document.addEventListener('DOMContentLoaded', () => {
    const mnemonic_textarea = document.getElementById('mnemonic_textarea');
    const generate_mnemonic_button = document.getElementById('generate_mnemonic_button');
    const save_mnemonic_button = document.getElementById('save_mnemonic_button');
    const network_select = document.getElementById('network_select');
    const wallet_filename_input = document.getElementById('wallet_filename');
    const spinner = document.getElementById('spinner');

    function generateMnemonic() {
        spinner.style.display = 'block';
        try {
            const mnemonic = bip39.generateMnemonic();
            mnemonic_textarea.value = mnemonic;
        } catch (error) {
            console.error('Error creating mnemonic:', error);
            alert('Error creating mnemonic. Please try again.');
        } finally {
            spinner.style.display = 'none';
        }
    }

    // Generate and display mnemonic on page load
    generateMnemonic();

    // Add event listener to the generate mnemonic button
    generate_mnemonic_button.addEventListener('click', generateMnemonic);

    // Add event listener to the save button
    save_mnemonic_button.addEventListener('click', () => {
        const mnemonic = mnemonic_textarea.value.trim();
        const network = network_select.value;
        const filename = wallet_filename_input.value;

        if (!mnemonic) {
            alert('Mnemonic phrase is required.');
            return;
        }

        spinner.style.display = 'block';

        fetch('/save-mnemonic', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ mnemonic, network, filename }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Wallet saved successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Error saving wallet.');
        })
        .finally(() => {
            spinner.style.display = 'none';
        });
    });
});
