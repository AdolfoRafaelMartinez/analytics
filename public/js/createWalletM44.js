const { BIP32Factory } = require('bip32')
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const { ECPairFactory } = require('ecpair');
const ecc = require('tiny-secp256k1');

// Initialize ECPair with the ecc library
const ECPair = ECPairFactory(ecc);

// Define the network (use bitcoin.networks.testnet for testing)
const network = bitcoin.networks.testnet;

async function createWallet() {
  // Generate a new 12-word mnemonic seed phrase (BIP39)
  const mnemonic = bip39.generateMnemonic();
  console.log('Mnemonic seed phrase:', mnemonic);

  // Convert the mnemonic to a seed buffer
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // Create a master HD wallet from the seed
  const bip32 = BIP32Factory(ecc)
  const root = bip32.fromSeed(seed, network);

  // Derive the first external address (index 0) using BIP44 standard
  // The derivation path for Bitcoin Testnet is m/44'/1'/0'/0/0
  const path = "m/44'/1'/0'/0/0";
  const child = root.derivePath(path);

  // Get the key pair and public address
  const keyPair = ECPair.fromPrivateKey(child.privateKey);
  const { address } = bitcoin.payments.p2pkh({ pubkey: Buffer.from(keyPair.publicKey), network });

  console.log('Wallet Path:', path);
  console.log('Private Key (WIF):', keyPair.toWIF());
  console.log('Public Address:', address);
}

createWallet();
