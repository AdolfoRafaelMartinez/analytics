import * as bitcoin from 'bitcoinjs-lib';
import * as ECPairFactory from 'ecpair';
import * as tinysecp from 'tiny-secp256k1';

const ECPair = ECPairFactory.default(tinysecp);
const network = bitcoin.networks.testnet; // or bitcoin.networks.bitcoin for mainnet
const privateKeyWIF = process.argv[2];
const recipientAddress = process.argv[3];
const amountToSendSatoshis = 300;
async function createAndBroadcastTransaction(privateKeyWIF, recipientAddress, amountToSendSatoshis) {

    // 1. Load sender's key pair
    const keyPair = ECPair.fromWIF(privateKeyWIF, network);
    const senderAddress = bitcoin.payments.p2pkh({ pubkey: Buffer.from(keyPair.publicKey), network }).address;

    // 2. Fetch UTXOs for senderAddress (requires an external API call)
    const utxos = await fetchUTXOs(senderAddress); // Placeholder for API call

    // 3. Create Transaction Builder
    const txb = new bitcoin.TransactionBuilder(network);

    // 4. Add Inputs (example with a single UTXO)
    txb.addInput(utxos[0].txid, utxos[0].vout); 

    // 5. Add Outputs
    txb.addOutput(recipientAddress, amountToSendSatoshis);
    // Add change output if needed

    // 6. Sign Inputs
    txb.sign(0, keyPair); // Sign the first input

    // 7. Build and Broadcast
    const rawTransaction = txb.build().toHex();
    await broadcastTransaction(rawTransaction); // Placeholder for API call
}

createAndBroadcastTransaction(privateKeyWIF, recipientAddress, amountToSendSatoshis);