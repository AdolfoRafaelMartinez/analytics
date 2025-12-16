import * as ecc from 'tiny-secp256k1';
import { BIP32Factory } from 'bip32';
import * as bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import { Buffer } from 'buffer';

const bip32 = BIP32Factory(ecc);
const network = bitcoin.networks.testnet;
const path_prefix = `m/49'/1'/0'/0`;

export function generateChildKeys() {
    const mnemonic = bip39.generateMnemonic();
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, network);

    const childKeys = [];
    for (let i = 0; i < 10; i++) {
        const childAccount = root.derivePath(`${path_prefix}/${i}`);
        const { address } = bitcoin.payments.p2sh({
            redeem: bitcoin.payments.p2wpkh({
                pubkey: Buffer.from(childAccount.publicKey),
                network
            }),
            network
        });
        childKeys.push({
            path: `${path_prefix}/${i}`,
            address: address,
            privateKey: childAccount.toWIF()
        });
    }
    return childKeys;
}
