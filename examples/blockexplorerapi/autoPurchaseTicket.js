var Web3 = require("web3");
var fs = require("fs");
var web3FusionExtend = require("../../index.js");
const commandLineArgs = require("command-line-args");

const optionDefinitions = [
  { name: "connectString", alias: "c", type: String },
  { name: "passPhraseFile", type: String, alias: "p" },
  { name: "keyStore", alias: "k", type: String },
  { name: "numberOfTickets", alias: "n", type: Number }
];

const options = commandLineArgs(optionDefinitions);

console.log(options);

if (!options.connectString) {
  console.log("please set the argument --connectString or -c");
  process.exit(1);
}

if (!options.passPhraseFile) {
  console.log("please set the argument --passPhraseFile -p");
  process.exit(1);
}

if (!options.keyStore) {
  console.log("please set the argument --keyStore -k");
  process.exit(1);
}

if (!options.numberOfTickets) {
  console.log("please set --numberOfTickets -n");
}

if (options.numberOfTickets < 1) {
  console.log("--numberOfTickets needs to be greater than zero");
  process.exit(1);
}

//lets open the key store file
let key;
try {
  var data = fs.readFileSync(options.keyStore, "utf8");
  key = JSON.parse(data.toString());
} catch (e) {
  console.error("Error reading pass key file file " + options.keyStore);
  console.log("Error:", e.stack);
  process.exit();
}

// lets open the password file
let password;
try {
  var data = fs.readFileSync(options.passPhraseFile, "utf8");
  password = data.toString();
} catch (e) {
  console.error("Error reading pass phrase file " + options.passPhraseFile);
  console.log("Error:", e.stack);
  process.exit();
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
  console.log("Unable to decrypt file", e);
}

console.log("ALL GOOD WITH PASSWORD AND KEYSTORE");

console.log("Using personal address of ", key.address);

function connectService() {
  let provider;

  try {
    provider = new web3.providers.WebsocketProvider(options.connectString);
    web3.setProvider(provider)
  } catch (e) {
    console.log(
      "Provider has a problem trying again in 10 seconds or check connect argument"
    );
    setTimeout(() => {
      connectService;
    }, 10000);
    return;
  }

  provider.on("connect", () => {
    console.log("Connected buying ticket")
    let data = { lastblock: 0 };
    provider.__data = data;
    buyATicket(data);
  });

  provider.on("error", e => {
    console.log("connection error ", e);
  });

  provider.on("end", e => {
    console.log("connection ended will try to reconnect in 5 seconds");
    provider.__reset = true;
    provider.__data.reset = true;
    setTimeout(() => {
      connectService();
    }, 5000);
  });
}

connectService();

let totalTicketsBought  = 0

function buyATicket(data) {
  if (data.reset) {
    return;
  }

  web3.eth
    .getBlock("latest")
    .then(block => {
        // debugger
      if (data.lastblock !== block.number) {
        return web3.fsn.allTicketsByAddress(key.address).then(res => {
           //  debugger
          let totalTickets = Object.keys(res).length
          if (totalTickets < options.numberOfTickets) {
            console.log(
              `${totalTickets} of ${options.numberOfTickets} purchasing one`
            );
            return web3.fsntx
              .buildBuyTicketTx({ from: key.address })
              .then(tx => {
                console.log(tx);
                // tx.gasLimit =  this._web3.utils.toWei( 21000, "gwei" )
                return web3.fsn.signAndTransmit(
                  tx,
                  signInfo.signTransaction
                );
              })
              .then(txHash => {
                console.log("wait for buy ticket tx -> ", txHash);
                if (data.reset) {
                  return true;
                }
                return waitForTransactionToComplete(txHash, data)
                  .then(r => {
                    if (r.status) {
                        console.log("Ticket bought")
                        totalTicketsBought += 1
                      data.lastblock = block.number;
                      setTimeout(() => {
                        buyATicket(data);
                      }, 4000);
                    } else {
                        console.log("Ticket buy failed (? funds)")
                      throw new Error("failed to buy");
                    }
                  })
                  .catch(err => {
                    throw err
                  });
              });
          } else {
              console.log("Tickets the same - "+ options.numberOfTickets + ",  tb = " + totalTicketsBought + " retrying " + (new Date()))
            setTimeout(() => {
              buyATicket(data);
            }, 4000);
          }
        });
      } else {
        setTimeout(() => {
          buyATicket(data);
        }, 4000);
      }
    })
    .catch(err => {
      console.log("error ", err);
      console.log("will retry");
      setTimeout(() => {
        buyATicket(data);
      }, 4000);
    });
}

function waitForTransactionToComplete(transID, data) {
  if (data.reset) {
    return;
  }
  return web3.eth
    .getTransactionReceipt(transID)
    .then(receipt => {
      if (!receipt) {
        // assume not scheduled yet
        return waitForTransactionToComplete(transID, data);
      }
      return receipt;
    })
    .catch(err => {
      throw err;
    });
}
