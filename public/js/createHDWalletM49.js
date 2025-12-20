import * as ecc from 'tiny-secp256k1';
import { ECPairFactory } from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import { BIP32Factory } from 'bip32';
import { Buffer } from 'buffer';
import { ethers } from "ethers";

const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc);

const path_prefix = `m/49'/1'/0'/0`;

export function create_hd_wallet_bitcoin(mnemonic) {
    const network = bitcoin.networks.testnet;

    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, network);
    const childKeys = [];

    for (let i = 0; i <= 10; i++) {
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
export function create_hd_wallet_ethereum(mnemonic) {
    const mnemonicObj = ethers.Mnemonic.fromPhrase(mnemonic);
    const accountNode = ethers.HDNodeWallet.fromMnemonic(mnemonicObj, "m/44'/60'/0'/0");
    const childKeys = [];

    for (let i = 0; i < 10; i++) {
        const childNode = accountNode.derivePath(String(i));
        childKeys.push({
            path: childNode.path,
            address: childNode.address,
            privateKey: childNode.privateKey,
            publicKey: childNode.publicKey,
        });
    }

    return {
        root: accountNode,
        childKeys
    };
}
