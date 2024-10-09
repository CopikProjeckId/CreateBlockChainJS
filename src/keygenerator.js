const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const crypto = require("crypto-js");
const nimonic_base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const creatorNimonic = (totalLength = 21) => {
    let result = '';
    for (let i = 0; i < totalLength; i++) {
        let n = ((Math.random() * (6 - 3)) + 3);
        let now_s = "";
        for (let j = 0; j < n; j++) {
            now_s += nimonic_base.charAt(Math.floor(Math.random() * nimonic_base.length));
        }
        result += now_s + ' ';
    }
    return result;
}

exports.generatorAddress = () => {
    let key = ec.genKeyPair();
    let address = crypto.SHA256(key.getPublic()).toString();
    let publicKey = key.getPublic('hex');
    let privateKey = key.getPrivate('hex');
    let nimonic = creatorNimonic(21);
    return {
        address,
        publicKey,
        privateKey,
        nimonic
    }
}