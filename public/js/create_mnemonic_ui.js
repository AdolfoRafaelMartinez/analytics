
import bip39 from "bip39";

document.addEventListener('DOMContentLoaded', () => {
    const mnemonic_info_element = document.getElementById('mnemonic_info_div');
    const spinner = document.getElementById('spinner');
    const save_mnemonic_button = document.getElementById('save_mnemonic_button');

    // Generate and display mnemonic on page load
    spinner.style.display = 'block';
    try {
        const mnemonic = bip39.generateMnemonic();
        mnemonic_info_element.innerHTML = `
            <p><strong>mnemonic:</strong> <span id="mnemonic_text">${mnemonic}</span></p>
        `;
    } catch (error) {
        console.error('Error creating mnemonic:', error);
        mnemonic_info_element.innerHTML = "Error creating mnemonic. Please try again.";
    } finally {
        spinner.style.display = 'none';
    }

    // Add event listener to the save button
    save_mnemonic_button.addEventListener('click', () => {
        const mnemonicTextElement = document.getElementById('mnemonic_text');
        if (mnemonicTextElement) {
            const mnemonic = mnemonicTextElement.innerText;
            spinner.style.display = 'block';

            fetch('/save-mnemonic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mnemonic: mnemonic }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                alert('Mnemonic saved successfully!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Error saving mnemonic.');
            })
            .finally(() => {
                spinner.style.display = 'none';
            });
        }
    });
});
