var assert = require("assert");
var Web3 = require("web3");
var web3FusionExtend = require("../index.js");
var fs = require("fs");
var provider;

let key;
let password;
let signInfo;

let wb = new Web3();
let web3 = web3FusionExtend.extend(wb);
var milli = new Date().getMilliseconds();
var assetName = "TestAsset " + new Date().toString();
var assetShortName = "T" + milli;
var assetId;
var numberToDo = 10;
var transactionList = [];

function waitForTransactionToComplete(transID) {
  return web3.eth
    .getTransactionReceipt(transID)
    .then(receipt => {
      if (!receipt) {
        // assume not scheduled yet
        return waitForTransactionToComplete(transID);
      }
      return receipt;
    })
    .catch(err => {
      throw err;
    });
}

function incAsset(index, numberToDo, done) {
  if (index === numberToDo) {
    done();
    return;
  }
  console.log(`Sending transaction #${index} of ${numberToDo}`);
  return web3.fsntx
    .buildIncAssetTx({
      from: key.address,
      to: key.address,
      value: "1000000000000000000",
      asset: assetId,
    })
    .then(tx => {
        console.log(tx)
      debugger;
      return web3.fsn.signAndTransmit(tx, signInfo.signTransaction).then(tx => {
        debugger;
        console.log(tx)
        transactionList.push(tx);
      });
    })
    .catch(err => {
      console.log("inc asset created the following error", err);
      done(err);
    });
}

provider = new Web3.providers.WebsocketProvider(process.env.CONNECT_STRING);
provider.on("connect", function() {
  debugger;
  testIt();
});
provider.on("error", function(err) {
  debugger;
  testIt();
});
web3 = new Web3(provider);
web3 = web3FusionExtend.extend(web3);
web3.setExtended = true;
debugger;
console.log(web3.version);

function testIt() {
  assert(
    process.env.CONNECT_STRING,
    "Environment Variable CONNECT_STRING must be set."
  );
  assert(
    process.env.PASSWORD_FILE,
    "Environment Variable CONNECT_STRING must be set."
  );
  assert(
    process.env.KEYSTORE_FILE,
    "Environment Variable PASSWORD_FILE must be set."
  );

  try {
    let data = fs.readFileSync(process.env.KEYSTORE_FILE, "utf8");
    key = JSON.parse(data.toString());
  } catch (e) {
    done(e);
    return;
  }

  // lets open the password file
  try {
    let data = fs.readFileSync(process.env.PASSWORD_FILE, "utf8");
    password = data.toString();
  } catch (e) {
    done(e);
    return;
  }

  // we now have the keystore and password
  //
  let crypto = key.Crypto || key.crypto;

  //debugger;
  try {
    signInfo = web3.eth.accounts.decrypt(
      { crypto, version: key.version },
      password
    );
  } catch (e) {
    done(e);
    return;
  }
  console.log("we have everything to do signing");

  console.log(web3.setExtended);

  debugger;
  web3.fsntx
    .buildGenAssetTx({
      from: key.address,
      name: assetName,
      symbol: assetShortName,
      decimals: 18,
      total: "0x0",
      CanChange: true
    })
    .then(tx => {
      debugger;
      return web3.fsn.signAndTransmit(tx, signInfo.signTransaction);
    })
    .then(transactionReceipt => {
      return waitForTransactionToComplete(transactionReceipt)
        .then(transactionReceipt => {
          if (transactionReceipt.status != "0x1") {
            done(new Error("transaction error"));
            return;
          }
          let data = JSON.parse(
            web3.fsn.hex2a(transactionReceipt.logs[0].data)
          );
          // console.log("json data => ", data);
          assetId = data.AssetID;
          assert(assetId, "there should be an asset id");
          return incAsset(0, numberToDo);
        })
        .catch(err => {
          console.log(
            "gen asset (waitForTransactionToComplete) created the following error",
            err
          );
          process.exit(1);
        });
    })
    .catch(err => {
      console.log("gen asset created the following error", err);
      process.exit(1);
    });
}
