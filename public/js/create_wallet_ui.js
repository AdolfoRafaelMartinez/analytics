document.addEventListener('DOMContentLoaded', () => {
    const mnemonic_textarea = document.getElementById('mnemonic_textarea');
    const generate_mnemonic_button = document.getElementById('generate_mnemonic_button');
    const save_mnemonic_button = document.getElementById('save_mnemonic_button');
    const network_select = document.getElementById('network_select');
    const wallet_filename_input = document.getElementById('wallet_filename');
    const spinner = document.getElementById('spinner');

    async function generateMnemonic() {
        spinner.style.display = 'block';
        try {
            const response = await fetch('/api/wallet/generate-mnemonic', { method: 'POST' });
            const data = await response.json();
            if (data.mnemonic) {
                mnemonic_textarea.value = data.mnemonic;
            } else {
                throw new Error(data.error || 'Failed to generate mnemonic');
            }
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
    save_mnemonic_button.addEventListener('click', async () => {
        const mnemonic = mnemonic_textarea.value.trim();
        const network = network_select.value;
        const filename = wallet_filename_input.value;

        if (!mnemonic) {
            alert('Mnemonic phrase is required.');
            return;
        }

        spinner.style.display = 'block';

        try {
            const response = await fetch('/api/wallet/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mnemonic, network }),
            });

            const walletData = await response.json();

            if (response.ok) {
                const blob = new Blob([JSON.stringify(walletData, null, 2)], { type: 'application/json' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                alert('Wallet saved successfully!');
            } else {
                throw new Error(walletData.error || 'Failed to save wallet');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error saving wallet.');
        } finally {
            spinner.style.display = 'none';
        }
    });
});
