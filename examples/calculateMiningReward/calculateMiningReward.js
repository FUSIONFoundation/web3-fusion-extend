/** calculateMiningReward.js
 * 
 * example to how mining rewards can be calculated
 * 
 */
var Web3 = require("web3");
var web3FusionExtend = require("../../index.js");
let version = 1.0;
let inHere;
let counter;
let timerSet;

let highestBlock = 232000 // highest block will be determined after launch

/*  Remember to set your environment variables to run this test
    e.g. CONNECT_STRING="wss://gateway.fusionnetwork.io:10001"

    else the default will be "wss://gateway.fusionnetwork.io:10001"
*/

var web3;
let minerRewards = {};

let connectString = process.env.CONNECT_STRING
if ( !connectString ) {
  connectString = "wss://gateway.fusionnetwork.io:10001"
}

/** the following function helps us connect and reconnect to the 
 * gateway specified
 */
let lastConnectTimer;
function keepWeb3Alive() {
  //debugger
  lastConnectTimer = null;
  console.log("STARTING WEB3 connection");
  provider = new Web3.providers.WebsocketProvider(connectString, {
    timeout: 60000
  });
  provider.on("connect", function() {
    //debugger
    web3._isConnected = true;
    web3.fsn.enableBigIntJSONParse()
    scheduleNewScan(10);
  });
  provider.on("error", function(err) {
    //debugger
    if (provider && !provider.___disconnected) {
      provider.___disconnected = true;
      provider.disconnect();
      provider = null;
      web3._isConnected = false;
      console.log("web3 connection error ", err);
      console.log("will try to reconnect");
      lastConnectTimer = setTimeout(() => {
        keepWeb3Alive();
      }, 1000);
    }
  });
  provider.on("end", function(err) {
    //debugger
    if (!lastConnectTimer) {
      if (provider && !provider.___disconnected) {
        provider.___disconnected = true;
        try {
          provider.disconnect();
        } catch (e) {}
        provider = null;
        web3._isConnected = false;
        console.log("web3 connection error ", err);
        console.log("will try to reconnect");
        lastConnectTimer = setTimeout(() => {
          keepWeb3Alive();
        }, 10000);
      }
    }
  });
  web3 = new Web3(provider);
  web3._isConnected = false;
  web3 = web3FusionExtend.extend(web3);
}

// startup our web3 connection
//
keepWeb3Alive();

let lastBlock = 1; // reporting will start at block as genesis block does not get a reward

/** caclulate the reward at the block
 * 
 * @param {height to calculate reward for} height 
 */
function calcReward(height) {
  let i;
  // initial reward 2.5
  let reward = 2.5;
  // every 4915200 blocks divide reward by 2
  let segment = Math.floor(height / 4915200);
  for (i = 0; i < segment; i++) {
    reward = reward / 2;
  }
  return reward;
}

/**
 * reschedule the next block via a timer
 */
function callBlockScanAgain() {
  if (!timerSet) {
    setTimeout(() => {
      timerSet = null;
      resumeBlockScan();
    }, 2000);
  }
}

/**
 * check if web3 is connected if not reschedule to resume
 * check if at highest block requested and printout report if so
 */
function resumeBlockScan() {
  if ( highestBlock === lastBlock ) {
    printOutRewards()
  }
  if (!web3._isConnected) {
    console.log("web3 connection down returning");
    callBlockScanAgain();
    return;
  }

  if (lastBlock === -1) {
    lastBlock = 0;
  }

  if (inHere) {
    console.log("...Already Processing Block");
    counter++;
    if (counter === 10) {
      counter = 0;
      inHere = false;
    }
    if (!timerSet) {
      timerSet = setTimeout(() => {
        timerSet = null;
        resumeBlockScan();
      }, 5000);
    }
    return;
  }

  counter = 0;

  inHere = true;
 
  doBlockScan();
}

/**
 * for the current block see who mined it and add to 
 * global object keeping track of count
 * every 100 print out a status message
 */
async function doBlockScan() {
  try {
    let block = await web3.eth.getBlock(lastBlock);
    if (!block) {
      // wait for block to update
      console.log("Waiting for new block..." + new Date());
      // lets update the database to show we alive
      scheduleNewScan();
      return;
    }
    let miner = block.miner.toLowerCase()
    if ( !minerRewards[miner] ) {
      minerRewards[miner] = []
    }
    let blocksForMiner = minerRewards[miner]
    blocksForMiner.push( lastBlock )
    if ( lastBlock % 100  === 0 ) { 
      console.log( "Did   Block -> " , lastBlock, block.miner );
    }
    lastBlock += 1
    scheduleNewScan(1);
  } catch (err) {
    console.log("uncaught error, try again ", err);
    scheduleNewScan();
  }
}

/**
 * 
 * @param {schedule a new call for next block, if timeset use this value else default to 500ms } timeToSet 
 */
function scheduleNewScan(timeToSet) {
  inHere = false;
  if (!timerSet) {
    timerSet = setTimeout(() => {
      timerSet = null;
      resumeBlockScan();
    }, timeToSet || 500);
  }
}

/**
 * print out the reward table in csv format
 */
function printOutRewards() {
    let miners = Object.keys( minerRewards )

    console.log( "Sorting miners based on blocks...")
    miners = miners.sort( (a,b) => { 
          let m1 = minerRewards[a].length
          let m2 = minerRewards[b].length
          if ( m1 === m2 ) {
            return 0
          }
          if ( m1 < m2 ) {
            return 1
          }
          return -1
    })

    console.log( "Printng rewards...")

    console.log("\n\n\n")

    console.log( "miner,blocksMined,ERC20FSN_DUE,PFSN_DUE")

    for ( miner of miners ) {
      let blockArray = minerRewards[miner]
      let pfsnReward = blockArray.reduce( (accumulator, val )=> {
          return accumulator + calcReward( val )
      }, 0)
      let blockCount = blockArray.length
      let erc20Reward = pfsnReward / 4
      console.log(  `${miner},${blockCount},${erc20Reward},${pfsnReward}`  )
    }

    process.exit(0)
}
