import { ethers } from 'ethers';

// Create a wallet from a mnemonic
const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
const wallet = ethers.Wallet.fromPhrase(mnemonic);

console.log("-----------------");
console.log("New Ethereum Wallet");
console.log("-----------------");
console.log(`Mnemonic (Seed Phrase): ${mnemonic}`);
console.log(`Address: ${wallet.address}`);
console.log(`Private Key: ${wallet.privateKey}`);
console.log("-----------------");

