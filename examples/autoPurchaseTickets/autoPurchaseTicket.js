var Web3 = require("web3");
var fs = require("fs");
var web3FusionExtend = require("../../index.js");
const commandLineArgs = require("command-line-args");

const optionDefinitions = [
  { name: "connectString", alias: "c", type: String },
  { name: "passPhraseFile", type: String, alias: "p" },
  { name: "keyStore", alias: "k", type: String },
  { name: "gasPrice", alias: "g", type: Number },
  { name: "numberOfTickets", alias: "n", type: Number }
];

console.log(`Example: 
              node autoPurchaseTicket --c"wss://example.com" -p "./password.txt" -k "./keystore.key" -n 10\n
              -c --connectString web socket gateway to connect to
              -k  --keyStore keystore file to use
              -p  --passPharseFile key file
              -c  --chainId (defaults to 1)
              -g  -- gasPrice gas price 1 - 100 (defaults to 2 gwei)
              -n  --Number of tickets to purchase`);

const options = commandLineArgs(optionDefinitions);

function RaiseErrorAndHalt({ condition, message }) {
  if (condition) {
    console.error(message);
    process.exit(1);
  }
}

var chaindId = 1
if (options.chainId) {
  let val = parseInt(options.chainId);
  const condition = isNaN(val) || val < 1 ;
  RaiseErrorAndHalt({
    condition,
    message: "Invalid chain id "
  });
  chainId = val;
}


var gasPrice = 2;

if (options.gasPrice) {
  let val = parseInt(options.gasPrice);
  const condition = isNaN(val) || val < 1 || val > 100;
  RaiseErrorAndHalt({
    condition,
    message: "Invalid gas price"
  });
  gasPrice = val;
}

RaiseErrorAndHalt({
  condition: !options.connectString,
  message: "please set the argument --connectString or -c"
});
RaiseErrorAndHalt({
  condition: !options.keyStore,
  message: "please set the argument --keyStore -k"
});
RaiseErrorAndHalt({
  condition: !options.passPhraseFile,
  message: "please set the argument --passPhraseFile -p"
});
RaiseErrorAndHalt({
  condition: !options.numberOfTickets,
  message: "please set --numberOfTickets -n"
});
RaiseErrorAndHalt({
  condition: options.numberOfTickets < 1,
  message: "--numberOfTickets needs to be greater than zero"
});

//lets open the key store file
let key;
try {
  var data = fs.readFileSync(options.keyStore, "utf8");
  key = JSON.parse(data.toString());
} catch (e) {
  console.log("Error:", e.stack);
  RaiseErrorAndHalt({
    condition: true,
    message: `Error reading pass key file file ${options.keyStore}`
  });
}

// lets open the password file
let password;
try {
  var data = fs.readFileSync(options.passPhraseFile, "utf8");
  password = data.toString().replace(/\n/g, "");
} catch (e) {
  console.log("Error:", e.stack);
  RaiseErrorAndHalt({
    condition: true,
    message: `Error reading pass phrase file ${options.passPhraseFile}`
  });
}

// we now have the keystore and password
//
let crypto = key.Crypto || key.crypto;
let signInfo;

let wb = new Web3();
let web3 = web3FusionExtend.extend(wb);

//debugger;
try {
  signInfo = web3.eth.accounts.decrypt(
    { crypto, version: key.version },
    password
  );
} catch (e) {
  RaiseErrorAndHalt({
    condition: true,
    message: `Unable to decrypt file ${e}`
  });
}

console.log("ALL GOOD WITH PASSWORD AND KEYSTORE");
console.log("Using personal address of ", key.address);

function connectService() {
  let provider;

  try {
    provider = new web3.providers.WebsocketProvider(options.connectString, {
      timeout: 10000
    });
    web3.setProvider(provider);
  } catch (e) {
    console.log(
      "Provider has a problem trying again in 10 seconds or check connect argument"
    );
    setTimeout(() => {
      connectService;
    }, 10000);
    return;
  }

  let data = { lastblock: 0 };
  provider.__data = data;

  function reconnect() {
    if (!data.reset) {
      data.reset = true;
      setTimeout(connectService, 3000);
    }
  }

  provider.on("connect", () => {
    console.log("Connected buying ticket for " + key.address);
    buyATicket(data);
  });

  provider.on("error", e => {
    console.log("connection error ", e);
    reconnect();
  });

  provider.on("end", e => {
    console.log("connection ended will try to reconnect in 5 seconds");
    provider.__reset = true;
    reconnect();
  });
}

connectService();

let totalTicketsBought = 0;

async function buyATicket(data) {
  if (data.reset) {
    return;
  }

  return new Promise(async (resolve, reject) => {
    try {
      const block = await web3.eth.getBlock("latest");

      if (data.lastblock !== block.number) {
        const allTicketsByAddress = await web3.fsn.allTicketsByAddress(
          key.address
        );
        let totalTickets = Object.keys(allTicketsByAddress).length;

        if (totalTickets < options.numberOfTickets) {
          console.log(
            `${totalTickets} of ${
              options.numberOfTickets
            } purchasing one, action happening around block ${block.number} ` +
              key.address +
              " " +
              new Date()
          );

          const tx = await web3.fsntx.buildBuyTicketTx({ from: key.address });
          tx.gasPrice = web3.utils.toWei(new web3.utils.BN(gasPrice), "gwei");
          tx.chaindId = chaindId

          const txHash = await web3.fsn.signAndTransmit(
            tx,
            signInfo.signTransaction
          );
          console.log("wait for buy ticket tx -> ", txHash);

          const response = await waitForTransactionToComplete(
            txHash,
            data,
            new Date().getTime() + 120000
          );

          if (response.status) {
            console.log("Ticket bought");
            totalTicketsBought += 1;
            data.lastblock = block.number;
            resolve();
          } else {
            console.error("Ticket buy failed (? funds)");
            reject("failed to buy");
          }
        } else {
          console.log(
            "Tickets the same - " +
              options.numberOfTickets +
              ",  tb = " +
              totalTicketsBought +
              " for " +
              key.address +
              " " +
              " retrying " +
              new Date()
          );
          resolve();
        }
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  }).then(
    success => {
      setTimeout(() => {
        buyATicket(data);
      }, 4000);
    },
    error => {
      console.log("error ", error);
      console.log("will retry");
      setTimeout(() => {
        buyATicket(data);
      }, 4000);
    }
  );
}

function waitForTransactionToComplete(transID, data, maxTime) {
  if (data.reset) {
    return;
  }
  if (maxTime < new Date().getTime()) {
    console.log("timed out waiting returning ");
    return { status: false };
  }
  return web3.eth
    .getTransactionReceipt(transID)
    .then(receipt => {
      if (data.reset) {
        return true;
      }
      if (!receipt) {
        // assume not scheduled yet
        return waitForTransactionToComplete(transID, data, maxTime);
      }
      return receipt;
    })
    .catch(err => {
      throw err;
    });
}
