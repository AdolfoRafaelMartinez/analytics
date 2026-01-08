
import express from 'express';
import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { ethers } from 'ethers';
import * as secp from '@noble/secp256k1';
import ECPairFactory from 'ecpair';

const ECPair = ECPairFactory(secp);
const router = express.Router();

function create_hd_wallet_bitcoin(mnemonic, network_name) {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    let network;
    let path_prefix;

    if (network_name === 'bitcoin-mainnet') {
        network = bitcoin.networks.bitcoin;
        path_prefix = "m/49'/0'/0'/0";
    } else {
        network = bitcoin.networks.testnet;
        path_prefix = "m/49'/1'/0'/0";
    }

    const root = bip32.fromSeed(seed, network);
    const childKeys = [];

    for (let i = 0; i < 10; i++) {
        const childAccount = root.derivePath(`${path_prefix}/${i}`);
        const { address } = bitcoin.payments.p2wpkh({
            pubkey: childAccount.publicKey,
            network: network,
        });

        childKeys.push({
            path: `${path_prefix}/${i}`,
            address: address,
            privateKey: childAccount.privateKey.toString('hex'),
            publicKey: childAccount.publicKey.toString('hex')
        });
    }

    return {
        seed: seed.toString('hex'),
        network: network_name,
        root: root.toBase58(),
        childKeys
    };
}

function create_hd_wallet_ethereum(mnemonic) {
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

router.post('/create', (req, res) => {
    const { network, mnemonic } = req.body;
    let wallet;

    try {
        if (network === 'bitcoin-testnet4' || network === 'bitcoin-mainnet') {
            wallet = create_hd_wallet_bitcoin(mnemonic, network);
        } else if (network === 'ethereum-sepolia') {
            wallet = create_hd_wallet_ethereum(mnemonic);
        } else {
            return res.status(400).json({ error: 'Invalid network specified' });
        }
        res.json(wallet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/generate-mnemonic', (req, res) => {
    try {
        const mnemonic = bip39.generateMnemonic();
        res.json({ mnemonic });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
