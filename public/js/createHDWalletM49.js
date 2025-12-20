import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import { Buffer } from 'buffer';

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

const path_prefix = `m/49'/1'/0'/0`; 

export function createHDWallet(mnemonic, networkType) {
  let network;
  if (networkType === 'bitcoin_testnet') {
    network = bitcoin.networks.testnet;
  } else {
    network = { name: networkType };
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic); 
  const root = bip32.fromSeed(seed, network);
  const childKeys = [];

  for (let i = 0; i <= 10; i++) {
    const childAccount = root.derivePath(`${path_prefix}/${i}`);
    let childAddress = "Not implemented for this network";

    if (networkType === 'bitcoin_testnet') {
        const { address } = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
                pubkey: Buffer.from(childAccount.publicKey),
                network
            }),
            network
        });
        childAddress = address;
    }

    childKeys.push({
        path: `${path_prefix}/${i}`,
        address: childAddress,
        privateKey: childAccount.privateKey.toString('hex'),
        publicKey: childAccount.publicKey.toString('hex')
    });
  }

  return {
    seed,
    network,
    root,
    childKeys
  };
}