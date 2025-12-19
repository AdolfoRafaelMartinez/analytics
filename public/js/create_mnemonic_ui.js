import bip39 from "bip39";
const create_mnemonic = document.getElementById('create_mnemonic_button');
const mnemonic_info_div = document.getElementById('mnemonic_info_div');
const spinner = document.getElementById('spinner');

create_mnemonic.addEventListener('click', () => {
    mnemonic_info_div.innerHTML = '';
    spinner.style.display = 'block';

    try {
        const mnemonic = bip39.generateMnemonic();
        mnemonic_info_div.innerHTML = `
            <p><strong>mnemonic:</strong> ${mnemonic}</p>
        `;
    } catch (error) {
        console.error('Error creating mnemonic:', error);
        mnemonic_info_div.innerHTML = "Error creating mnemonic. Please try again.";
    } finally {
        spinner.style.display = 'none';
    }
});
