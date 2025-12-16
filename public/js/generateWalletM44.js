import bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import { ECPairFactory } from 'ecpair';
import tinysecp from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';

const bip32 = BIP32Factory(tinysecp);
const ECPair = ECPairFactory(tinysecp);
const network = bitcoin.networks.bitcoin;

async function generateHDWallet() {
  // 1. Generate a random 12-word seed phrase
  const mnemonic = bip39.generateMnemonic();
  console.log('Seed Phrase (Mnemonic):', mnemonic);

  // 2. Convert the mnemonic to a seed buffer
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // 3. Master key from seed
  const root = bip32.fromSeed(seed, network);

  // 4. Derive first account external address (BIP44)
  const path = "m/44'/0'/0'/0/0";
  const child = root.derivePath(path);

  // 5. Create P2PKH address
  const { address } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(child.publicKey),
    network
  });

  console.log('Derived Bitcoin Address:', address);

  // Duplicate derivation (your original code did this twice)
  const path1 = "m/44'/0'/0'/0/0";
  const child1 = root.derivePath(path1);

  const { address: address1 } = bitcoin.payments.p2pkh({
    pubkey: Buffer.from(child1.publicKey),
    network
  });

  console.log('Derived Bitcoin Address:', address1);
}

generateHDWallet();
