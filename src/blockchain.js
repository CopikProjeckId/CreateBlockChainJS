const crypto = require("crypto-js");

class Address{
    constructor(address, publicKey, privateKey, nimonic) {
        this.address = address;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.nimonic = nimonic;
    }
}

class Transaction{
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return crypto.SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey) {
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        
    }
}
//! 개별 block data;
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return crypto.SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("BLOCK MINED: " + this.hash); 
    }
}


class BlockChain{
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }
    //! 첫 block 생성
    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis Block", "0");
    }
    //! 마지막 블록 가져오기
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    //! MINING 
    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        
        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(let block of this.chain) {
            for(let trans in block.transactions) {
                if(block.transactions[trans].fromAddress === address) {
                    balance -= block.transactions[trans].amount;
                }

                if(block.transactions[trans].toAddress === address) {
                    balance += block.transactions[trans].amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}