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
var assetName = "BigTestAsset " + new Date().toString();
var assetShortName = "T" + milli;
var assetId;
var numberToDo = 1000;
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

let subToDo = 5
let totalSent = 0

function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

function subInc( index , subindex ) {
    let x = (index + 1 ) * subindex
    let val = "10000000000000"+ pad(x,5);//   0 00 00",
    return web3.fsntx
      .buildIncAssetTx({
        from: key.address,
        to: key.address,
        value: val,
        asset: assetId
      })
      .then(tx => {
        tx.gasPrice = web3.utils.toWei( new web3.utils.BN( "3" ), "gwei");
        return web3.fsn.signAndTransmit(tx, signInfo.signTransaction).then(tx => {
            totalSent +=1 
          console.log("   total Sent  " + totalSent + "     ---- " + index +"."+subindex , tx);
          transactionList.push(tx);
        });
      })
      .catch(err => {
        console.log("inc asset created the following error", err);
      });
  }

function incAsset(index, numberToDo, done) {
  if (index === numberToDo) {
    done();
  }

//   for ( let i = 0 ; i < subToDo ; i++  ) {
//         subInc( index, i+1 )
//   }
  console.log(`Sending transaction #${index} of ${numberToDo}`);
  return web3.fsntx
    .buildIncAssetTx({
      from: key.address,
      to: key.address,
      value: "1000000000000000000",
      asset: assetId
    })
    .then(tx => {
      tx.gasPrice = web3.utils.toWei( new web3.utils.BN( "3" ), "gwei");
      return web3.fsn.signAndTransmit(tx, signInfo.signTransaction).then(tx => {
        totalSent += 1
        console.log( totalSent + "   " +  index * subToDo , tx);
        transactionList.push(tx);
        incAsset(index + 1, numberToDo, done) 
      });
    })
    .catch(err => {
      console.log("inc asset created the following error", err);
      done(err);
    });
}

provider = new Web3.providers.WebsocketProvider(process.env.CONNECT_STRING);
provider.on("connect", function() {

  testIt();
});
provider.on("error", function(err) {
    console.log("link error", err )
});
provider.on("end", function(err) {
    debugger;
    console.log("link broken", err )
    process.exit()
  });
web3 = new Web3(provider);
web3 = web3FusionExtend.extend(web3);
web3.setExtended = true;

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
          return incAsset(0, numberToDo, ()=>{
              console.log( `${numberToDo} has been sent for AssetID `,assetId)
          });
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
