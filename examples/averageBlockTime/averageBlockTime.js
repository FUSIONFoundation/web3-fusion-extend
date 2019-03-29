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

let highestBlock = 5000; // highest block will be determined after launch

let sumOfTimes = 0;
let highestTime = 0;
let highestTimeBlock;
let shortestTime = 100000000000000000000000;
let shortestTimeBlock;
let lastBlockTime = 0;


let allTicketsRetreatedExpired = []


let maxTD = 0 , maxTR = 0, maxTE = 0


/*  Remember to set your environment variables to run this test
    e.g. CONNECT_STRING="wss://testpsn2.fusionnetwork.io:10001"

    else the default will be "wss://testpsn2.fusionnetwork.io:10001"
*/

var web3;
let minerRewards = {};

let connectString = process.env.CONNECT_STRING;
if (!connectString) {
  connectString = "wss://testpsn2.fusionnetwork.io:10001";
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
    web3.fsn.enableBigIntJSONParse();
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
  if (highestBlock === lastBlock) {
    process.exit(1)
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
      timeerSet = setTimeout(() => {
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
    if ( highestBlock === lastBlock + 1 ) {
      console.log( "maxTD " + maxTD+ " , maxTR " +  maxTR + " ,  maxTE " + maxTE )
      console.log("all done")
      process.exit(1)
    }
    let block = await web3.eth.getBlock(lastBlock);
    if (!block) {
      // wait for block to update
      console.log("Waiting for new block..." + new Date());
      // lets update the database to show we alive
      scheduleNewScan();
      return;
    }
    let newTime = block.timestamp;
    let ti = await web3.fsn.getSnapshot(web3.utils.numberToHex(lastBlock));

    let TD = ti.deleted.length
    let TR = ti.retreat.length
    let TE = ti.expired.length

    if ( maxTD < TD ) {
        maxTD = TD
    }
    if ( maxTR < TR ) {
      maxTR = TR
    }
    if ( maxTE < TE ) {
      maxTE = TE
    }

    if ( TR ) {
      allTicketsRetreatedExpired.push( ...ti.retreat )
    }
    if ( TE ) {
      allTicketsRetreatedExpired.push( ...ti.expired )
    }
    
    //console.log( jt )
    if (!lastBlockTime) {
      lastBlockTime = newTime;
      lastBlock += 1;
    } else {
      timeDiff = newTime - lastBlockTime;
      lastBlockTime = newTime;
      if (timeDiff < shortestTime) {
        shortestTime = timeDiff;
        shortestTimeBlock = lastBlock;
      }
      if (timeDiff > highestTime) {
        highestTime = timeDiff;
        highestTimeBlock = lastBlock;
      }
      sumOfTimes += timeDiff;

      console.log( `Blck: ${lastBlock}, time: ${timeDiff} avgTime=${sumOfTimes/(lastBlock-1)}, highestTime=${highestTime} (b:${highestTimeBlock}), lowestTime=${shortestTime} (b:${shortestTimeBlock}) TD ${TD} TE ${TE} TR ${TR}  TREL ${allTicketsRetreatedExpired.length}`)

      lastBlock += 1;
    }
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
