var Web3 = require("web3");
var web3FusionExtend = require("../../index.js");


console.log("CONNECT_STRING ==> ", process.env.CONNECT_STRING);

if ( ! process.env.CONNECT_STRING ) {
    console.log("please set the environment variable CONNECT_STRING")
    process.exit(1)
}

if ( !process.env.NUMBER_OF_TICKETS ) {
    console.log("please set the environment variable NUMBER_OF_TICKETS")
    process.exit(1)
}

if ( !process.env.PASSPHRASE  ) {
    console.log("please set the environment variable PASSPHRASE")
    process.exit(1)
}

if ( !process.env.KEYSTORE ) {
    console.log("please set the keystore file")
}


