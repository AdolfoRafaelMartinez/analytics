import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import { Buffer } from 'buffer';

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

const network = bitcoin.networks.testnet; // Always use testnet for testing
const path_prefix = `m/49'/1'/0'/0`; 

export function createHDWallet() {
  // 1. Generate a 12-word mnemonic
  const mnemonic = bip39.generateMnemonic(); 

  // 2. Convert mnemonic to seed
  const seed = bip39.mnemonicToSeedSync(mnemonic); 

  // 3. Create HD root key
  const root = bip32.fromSeed(seed, network);

  // 4. Derive key for first address
  const firstAccount = root.derivePath(`${path_prefix}/0`);
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(firstAccount.publicKey),
      network
    }),
    network
  });

  // 5. Derive the next 10 child keys
  const childKeys = [];
  for (let i = 1; i <= 10; i++) {
    const childAccount = root.derivePath(`${path_prefix}/${i}`);
    const { address: childAddress } = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
            pubkey: Buffer.from(childAccount.publicKey),
            network
        }),
        network
    });
    childKeys.push({
        path: `${path_prefix}/${i}`,
        address: childAddress,
        privateKey: childAccount.toWIF()
    });
  }

  return {
    mnemonic,
    address,
    privateKey: firstAccount.toWIF(),
    childKeys
  };
}