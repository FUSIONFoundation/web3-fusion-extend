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

describe("send many transactions to server", function() {
  describe("ensure environment variables are setup correctly ", function() {
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
  });

  describe("try to open keystore", function() {
    it("password can unlock keystore", function(done) {
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
        return
      }
      console.log("we have everything to do signing");
      done()
    });
  });

  describe("connect to server", function() {
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
      console.log(web3.version);
    });
  });

  describe("do a transaction", function() {
      debugger
    it("gets first block", function(done) {
      web3.eth
        .getBlock(0)
        .then(block => {
          assert(
            block.number === 0,
            "block number of block zero should be zero"
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
