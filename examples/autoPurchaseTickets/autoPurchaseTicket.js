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
              -g  -- gasPrice gas price 1 - 100 (defaults to 2 gwei)
              -n  --Number of tickets to purchase`);

const options = commandLineArgs(optionDefinitions);

console.log(options);

var gasPrice = 2;

if (options.gasPrice) {
  let val = parseInt(options.gasPrice);
  if (isNaN(val) || val < 1 || val > 100) {
    console.log("Invalid gas price");
    process.exit(1);
  }
  gasPrice = val;
}

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

  provider.on("connect", () => {
    console.log("Connected buying ticket for " + key.address);
    buyATicket(data);
  });

  provider.on("error", e => {
    console.log("connection error ", e);
    if (!data.reset) {
      data.reset = true;
      setTimeout(() => {
        connectService();
      }, 3000);
    }
  });

  provider.on("end", e => {
    console.log("connection ended will try to reconnect in 5 seconds");
    provider.__reset = true;
    if (!data.reset) {
      data.reset = true;
      setTimeout(() => {
        connectService();
      }, 3000);
    }
  });
}

connectService();

let totalTicketsBought = 0;

function buyATicket(data) {
  if (data.reset) {
    return;
  }

  web3.eth
    .getBlock("latest")
    .then(block => {
      // debugger
      if (data.reset) {
        return;
      }
      if (data.lastblock !== block.number) {
        return web3.fsn.allTicketsByAddress(key.address).then(res => {
          //  debugger
          if (data.reset) {
            return;
          }
          let totalTickets = Object.keys(res).length;
          if (totalTickets < options.numberOfTickets) {
            console.log(
              `${totalTickets} of ${
                options.numberOfTickets
              } purchasing one, action happening around block ${
                block.number
              } ` +
                key.address +
                " " +
                new Date()
            );
            return web3.fsntx
              .buildBuyTicketTx({ from: key.address })
              .then(tx => {
                // console.log(tx);
                // tx.gasLimit =  this._web3.utils.toWei( 21000, "gwei" )
                if (data.reset) {
                  return;
                }
                tx.gasPrice = web3.utils.toWei( new web3.utils.BN( gasPrice ), "gwei");
                return web3.fsn.signAndTransmit(tx, signInfo.signTransaction);
              })
              .then(txHash => {
                console.log("wait for buy ticket tx -> ", txHash);
                if (data.reset) {
                  return true;
                }
                return waitForTransactionToComplete(txHash, data)
                  .then(r => {
                    if (data.reset) {
                      return;
                    }
                    if (r.status) {
                      console.log("Ticket bought");
                      totalTicketsBought += 1;
                      data.lastblock = block.number;
                      setTimeout(() => {
                        buyATicket(data);
                      }, 4000);
                    } else {
                      console.log("Ticket buy failed (? funds)");
                      throw new Error("failed to buy");
                    }
                  })
                  .catch(err => {
                    throw err;
                  });
              });
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
      if (data.reset) {
        return;
      }
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
      if (data.reset) {
        return true;
      }
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
