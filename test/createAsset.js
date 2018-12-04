var assert = require("assert");
var Web3 = require("web3");
var web3FusionExtend = require("../index.js");

// CONNECT_STRING="ws://3.16.110.25:9001" PASSPHRASE="123456" WALLET_ADDRESS="0x4A5a7Aa4130e407d3708dE56db9000F059200C62" ./node_modules/mocha/bin/mocha --exit ./src/api/test/createAsset.js

console.log("Wallet ==> " , process.env.WALLET_ADDRESS);
console.log("Connect String ==> " , process.env.CONNECT_STRING);

var web3;
var provider;
var milli = new Date().getMilliseconds();
var assetName = "TestAsset " + new Date().toString();
var assetShortName = "T" + milli;
var assetId;

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

describe("Create asset test", function() {
  describe("ensure environment variables are setup correctly ", function() {
    assert(
      process.env.CONNECT_STRING,
      "Environment Variable CONNECT_STRING must be set."
    );
    assert(
      process.env.WALLET_ADDRESS,
      "Environment Variable WALLETT_ADDRESS must be set."
    );
    assert(
      process.env.PASSPHRASE,
      "Environment Variable PASSPHRASE must be set."
    );
  });

  describe("connect to server and get first block", function() {
    it("Connect to Server", function(done) {
      provider = new Web3.providers.WebsocketProvider(
        process.env.CONNECT_STRING
      );
      provider.on("connect", function() {
        done();
      });
      provider.on("error", function(err) {
        done(err);
      });
      web3 = new Web3(provider);
      web3 = web3FusionExtend.extend(web3);
      console.log(web3.version);
    });

    it("getAllBalances", function(done) {
      web3.fsn
        .getAllBalances(process.env.WALLET_ADDRESS)
        .then(balances => {
          // console.log(balances);
          assert(
            balances[web3.fsn.consts.FSNToken],
            "there should be a balance for fusion tokens always"
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it("Generate a new asset", function(done) {
      this.timeout(10000);
      web3.fsn
        .genAsset(
          {
            from: process.env.WALLET_ADDRESS,
            name: assetName,
            symbol: assetShortName,
            decimals: 18,
            total: "0x0",
            CanChange: true
          },
          process.env.PASSPHRASE
        )
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
              done();
            })
            .catch(err => {
              console.log(
                "gen asset (waitForTransactionToComplete) created the following error",
                err
              );
              done(err);
            });
        })
        .catch(err => {
          console.log("gen asset created the following error", err);
          done(err);
        });
    });

    it("increment token supply and add to existing account", function(done) {
      this.timeout(10000);
      web3.fsn
        .incAsset(
          {
            from: process.env.WALLET_ADDRESS,
            to: process.env.WALLET_ADDRESS,
            value: "1000000000000000000",
            asset: assetId
          },
          process.env.PASSPHRASE
        )
        .then(transactionReceipt => {
          return waitForTransactionToComplete(transactionReceipt)
            .then(transactionReceipt => {
              if (transactionReceipt.status !== true) {
                done(new Error("transaction error " + transactionReceipt));
                return;
              }
              let data = JSON.parse(
                web3.fsn.hex2a(transactionReceipt.logs[0].data)
              );
              // console.log("json data => ", data);
              done();
            })
            .catch(err => {
              console.log(
                "inc asset (waitForTransactionToComplete) created the following error",
                err
              );
              done(err);
            });
        })
        .catch(err => {
          console.log("inc asset created the following error", err);
        });
    });

    it("new token should have a balance of 1000000000000000000", function(done) {
      web3.fsn
        .getAllBalances(process.env.WALLET_ADDRESS)
        .then(balances => {
          // console.log(balances);
          assert(
            balances[assetId] === "1000000000000000000",
            "asset balance should be 1000000000000000000"
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it("decrement token supply ", function(done) {
      this.timeout(10000);
      web3.fsn
        .decAsset(
          {
            from: process.env.WALLET_ADDRESS,
            to: process.env.WALLET_ADDRESS,
            value: "0000000000000000001",
            asset: assetId
          },
          process.env.PASSPHRASE
        )
        .then(transactionReceipt => {
          return waitForTransactionToComplete(transactionReceipt)
            .then(transactionReceipt => {
              if (transactionReceipt.status !== true) {
                done(new Error("transaction error " + transactionReceipt));
                return;
              }
              let data = JSON.parse(
                web3.fsn.hex2a(transactionReceipt.logs[0].data)
              );
              // console.log("json data => ", data);
              done();
            })
            .catch(err => {
              console.log(
                "dec asset (waitForTransactionToComplete) created the following error",
                err
              );
              done(err);
            });
        })
        .catch(err => {
          console.log("dec asset created the following error", err);
        });
    });

    it("new token should have a balance of 0999999999999999999", function(done) {                       
      web3.fsn
        .getAllBalances(process.env.WALLET_ADDRESS)
        .then(balances => {
          // console.log(balances);
          assert(
            balances[assetId] === "999999999999999999",
            "asset balance should be 999999999999999999"
          );
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it("cleans up ", function() {
      provider.reset();
      web3.setProvider(null);
    });
  });
});
