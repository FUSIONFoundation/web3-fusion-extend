var assert = require("assert");
var Web3 = require("web3");
var web3FusionExtend = require("../index.js");

/*  Remember to set your environment variables to run this test
    e.g. CONNECT_STRING="ws://3.16.110.25:9001" node ./examples/readAllBlocksToADatabase

    */

console.log("CONNECT_STRING ==> ", process.env.CONNECT_STRING);

var web3;

function keepWeb3Alive() {
  provider = new Web3.providers.WebsocketProvider(process.env.CONNECT_STRING);
  provider.on("connect", function() {
    web3._isConnected = true;
    resumeBlockScan();
  });
  provider.on("error", function(err) {
    web3._isConnected = false;
    console.log("web3 connection error ", err);
    console.log("will try to reconnect");
    setTimeout(() => {
      keepWeb3Alive();
    }, 5);
  });
  provider.on("end", function() {
    web3._isConnected = false;
    console.log("web3 connection error ", err);
    console.log("will try to reconnect");
    setTimeout(() => {
      keepWeb3Alive();
    }, 5);
  });
  web3 = new Web3(provider);
  web3 = web3FusionExtend.extend(web3);
}

// startup our web3 connection
//
keepWeb3Alive();

let lastBlock = 0;

// setup for database writing
//
function logBlock(block) {
  return new Promise((resolve, reject) => {
    console.log(block);
    resolve(true);
  });
}

function logTransactions(block) {
  if (block.transactions.length === 0) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  return new Promise((resolve, reject) => {
    console.log(block.transactions.length + " transactions ");
    logTransaction(block.transactions, 0, resolve, reject);
  });
}

function logTransaction(transactions, index, resolve, reject) {
  if (transactions.length === index) {
    resolve(true);
    return;
  }
  if (!web3._isConnected) {
    reject(new Error("web3 not connected"));
    retturn;
  }

  web3.eth
    .getTransaction(transactions[index])
    .then(transaction => {
      web3.eth.getTransactionReceipt(transactions[index]).then(receipt => {
        console.log("transaction => ", receipt, transaction);
        index += 1;
        logTransaction(transactions, index, resolve, reject);
      });
    })
    .catch(err => {
      console.log("error getting transaction ", err);
      reject(err);
    });
}

function resumeBlockScan() {
  if (!web3._isConnected) {
    console.log("web3 connection down returning");
    return;
  }

  return web3.eth
    .getBlock(lastBlock)
    .then(block => {
      return logBlock(block).then(ret => {
        return logTransactions(block).then(ret => {
          console.log(lastBlock, block);
          lastBlock += 1;
          setTimeout(() => {
            resumeBlockScan();
          }, 10);
        });
      });
    })
    .catch(err => {
      console.log("error talking to server, try again ", err);
      setTimeout(() => {
        resumeBlockScan();
      }, 10000);
    });
}
