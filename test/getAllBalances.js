var assert = require("assert");
var Web3 = require("web3");
var web3FusionExtend = require("../index.js");

/*  Remember to set your environment variables to run this test
    e.g. CONNECT_STRING="ws://3.16.110.25:9001" PASSPHRASE="123456" WALLET_ADDRESS="0x4A5a7Aa4130e407d3708dE56db9000F059200C62" ./node_modules/mocha/bin/mocha --exit ./src/api/test/createAsset.js
*/

console.log(process.env.WALLET_ADDRESS);
console.log(process.env.CONNECT_STRING);

var web3;
var provider;



describe("get all balances test", function() {

  describe("ensure environment variables are setup correctly ", function() {
    assert(
      process.env.CONNECT_STRING,
      "Environment Variable CONNECT_STRING must be set."
    );
    assert(
        process.env.WALLET_ADDRESS,
        "Environment Variable WALLETT_ADDRESS must be set."
      );
  });

  describe("connect to server and get balance", function() {
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
      web3 = web3FusionExtend.extend(web3)
      console.log(web3.version);
    });

    it("getAllBalances", function(done) {
      web3.fsn
        .getAllBalances( process.env.WALLET_ADDRESS)
        .then( balances => {
          console.log( balances )
          assert(  balances[web3.fsn.consts.FSNToken] , "there should be a balance for fusion tokens always"  )
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
