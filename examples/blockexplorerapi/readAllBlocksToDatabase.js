var assert = require("assert");
var Web3 = require("web3");
var web3FusionExtend = require("../../index.js");
var mysql = require("promise-mysql");
const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");
const rp = require("request-promise");

let version = 1.0;
let inHere;
let counter;
let timerSet;

/*  Remember to set your environment variables to run this test
    e.g. CONNECT_STRING="ws://3.16.110.25:9001" DB_CONNECT_STRING="{'host':'localhost','user':'root','password':'password','database':'db1','connectionLimit':10}" node ./examples/readAllBlocksToADatabase
*/

// console.log("CONNECT_STRING ==> ", process.env.CONNECT_STRING);
// console.log("DATABASE_CONNECT ==> ", process.env.DB_CONNECT_STRING);
var dbConnect = JSON.parse(process.env.DB_CONNECT_STRING.replace(/'/g, '"'));
var web3;
var _pool;
var _masterConnection;

const INFO_ID = "INFO_ID";
const VERSION_ID = "VERSION_ID";

let glb_highestBlockOnChain;
let balancesReturned = {};

let numberOfBlocksToWait = 1

let checkPriceOfFSN = true

if ( process.env.NUMBER_OF_BLOCKS_TO_WAIT ) {
  let x = parseInt(  process.env.NUMBER_OF_BLOCKS_TO_WAIT  )
  if ( isNaN(x) || x <= 0 ) {
    console.log("NUMBER_OF_BLOCKS_TO_WAIT must be a number and > 0 ")
    process.exit(1)
  }
}

if ( process.env.CHECK_FSN_PRICE && process.env.CHECK_FSN_PRICE.toLowerCase() === 'false' ) {
  checkPriceOfFSN  = false
  console.log("NOT UPDATING FSN PRICE")
} else {
  console.log("FSN PRICE WILL BE UPDATED")
}

console.log( `NUMBER_OF_BLOCKS_TO_WAIT set to --> ${numberOfBlocksToWait}` )

/** these balances are read on block 1 so the info
 * in the genesis account will be loaded into the
 * database
 */
let genesisAccounts = [
  "0x9c48c796cb0bed51a14291bc8cc56dab5aed7b5c" , // foundation total supply

  "0x0Ac469cf34C4d65515E4eF27eAF0F71F15C5A2fd" , // usan generator

  "0xd2452651834e8f0c19c9d85e0bf09fe99283dabc" , // foundation miner 1
  "0x7da669ea4234473e224a8f5a5f6257729e6f03cd" , // foundation miner 2
  "0x8e448859d7502b1ecf0c8d18008feeff89a30c60" , // foundation miner 3
  "0x722c6716dad0d7f8c1adbfd3360edbe99813f3aa" , // foundation miner 4
  "0x0e93335afe434a73e005cab8bd1b2dc153b73549" , // foundation miner 5
  "0xe3db01c89dcdd68b80e7dfdf931b00a6335d72dd" , // foundation miner 6
  "0xc4a9441afb052cb454240136cce71fb09316ea94" , // foundation miner 7
  "0xfa37b7c3f21060458361ed5322be5af3740bce3c"   // foundation miner 8
]

let buildTheSystem = [
  {
    txt: "Build Blocks",
    sql:
      "CREATE TABLE IF NOT EXISTS blocks (\n" +
      "  hash VARCHAR(68) NOT NULL UNIQUE,\n" +
      "  height BIGINT NOT NULL UNIQUE,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  recEdited DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  timeStamp BIGINT UNSIGNED,\n" +
      "  miner VARCHAR(68),\n" +
      "  numberOfTransactions int,\n" +
      "  ticketSelected VARCHAR(128),\n" +
      "  block json,\n" +
      "  tickInfo json,\n" +
      "  PRIMARY KEY (hash),\n" +
      "  INDEX `ticketSelected` (`ticketSelected`),\n" +
      "  INDEX `recCreated` (`recCreated`),\n" +
      "  INDEX `timestamp` (`timeStamp`),\n" +
      "  INDEX `heightDesc` (`height` DESC),\n" +
      "  INDEX `miner` (`miner`),\n" +
      "  INDEX `minerTimeStamp` (`miner`,`timeStamp`),\n" +
      "  INDEX `numberOfTransactions` (`numberOfTransactions`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
  },
  {
    txt: "Build Transactions",
    sql:
      "BEGIN;\n" +
      "CREATE TABLE IF NOT EXISTS transactions (\n" +
      "  hash VARCHAR(68) NOT NULL UNIQUE,\n" +
      "  height BIGINT NOT NULL,\n" +
      "  timeStamp BIGINT UNSIGNED,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  recEdited DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  fromAddress VARCHAR(68),\n" +
      "  toAddress VARCHAR(68),\n" +
      "  fusionCommand VARCHAR(128),\n" +
      "  commandExtra VARCHAR(128),\n" +
      "  commandExtra2 VARCHAR(128),\n" +
      "  commandExtra3 VARCHAR(128),\n" +
      '  swapDeleted BOOL,\n' +
      "  data text,\n" +
      "  transaction json,\n" +
      "  receipt json,\n" +
      "  PRIMARY KEY (hash),\n" +
      "  INDEX `height` (`height`),\n" +
      "  INDEX `heightDesc` (`height` DESC),\n" +
      "  INDEX `recCreated` (`recCreated`),\n" +
      "  INDEX `toFromAddress` (`toAddress`,`fromAddress`),\n" +
      "  INDEX `fromAddress` (`fromAddress`),\n" +
      "  INDEX `timestamp` (`timeStamp`),\n" +
      "  INDEX `commandExtra` (`commandExtra`),\n" +
      "  INDEX `commandExtra2` (`commandExtra2`),\n" +
      "  INDEX `commandExtra3` (`commandExtra3`),\n" +
      "  INDEX `swapDeletedCmdX` (`swapDeleted`,`commandExtra`),\n" +
      "  INDEX `cmdSwapFusionCmd` (`commandExtra`,`swapDeleted`,`fusionCommand`),\n"+
      "  INDEX `swapDeletedCmd` (`swapDeleted`),\n" +
      "  INDEX `toAddress` (`toAddress`),\n" +
      "  INDEX `cmd3AndFCmd` (`commandExtra3` ASC, `fusionCommand` ASC),\n"+
      // INDEX `toAddressAndFCmd` (`toAddress` ASC, `fusionCommand` ASC);
      // INDEX `fromAddressAndFCmd` (`fromAddress` ASC, `fusionCommand` ASC);
      // INDEX `toAdrCmd3FAddFCmd` (`toAddress` ASC, `commandExtra3` ASC, `fromAddress` ASC, `fusionCommand` ASC);
      "  INDEX `descFCmdFAddrTimeS` (`fusionCommand` ASC, `fromAddress` ASC, `timeStamp` DESC),\n" +
      "  INDEX `fusionCommandAddressTimeStamp` (`fusionCommand` ASC, `fromAddress` ASC, `timeStamp` ASC),\n" +
      "  INDEX `fusionCommand` (`fusionCommand`,`commandExtra`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n" +
      "COMMIT;"
  },
  {
    txt: "Build DeletedSwaps",
    sql:
      "BEGIN;\n" +
      "CREATE TABLE IF NOT EXISTS deletedSwaps (\n" +
      "  swap VARCHAR(68) NOT NULL UNIQUE,\n" +
      "  hash VARCHAR(68) NOT NULL,\n" +
      "  height BIGINT NOT NULL,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  PRIMARY KEY (swap),\n" +
      "  INDEX `hash` (`hash`),\n" +
      "  INDEX `height` (`height`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n" +
      "COMMIT;"
  },
  {
    txt: "Build Swaps",
    sql:
      "BEGIN;\n" +
      "CREATE TABLE IF NOT EXISTS swaps (\n" +
      "  swapID VARCHAR(68) NOT NULL UNIQUE,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  height BIGINT NOT NULL,\n" +
      "  timeStamp BIGINT UNSIGNED,\n" +
      "  hash VARCHAR(68) NOT NULL,\n" +
      "  fromAddress VARCHAR(68),\n" +
      "  fromAsset VARCHAR(68),\n" +
      "  toAsset VARCHAR(68),\n" +
      "  size BIGINT,\n" +
      "  data text,\n" +
      "  PRIMARY KEY (swapID),\n" +
      "  INDEX `hash` (`hash`),\n" +
      "  INDEX `recCreated` (`recCreated`),\n" +
      "  INDEX `fromAddress` (`fromAddress`),\n" +
      "  INDEX `toAsset` (`toAsset`),\n" +
      "  INDEX `fromAsset` (`fromAsset`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n" +
      "COMMIT;"
  },
  {
    txt: "create triggle for transaction",
    sql:
      // "DELIMITER ;;\n" +
      "CREATE TRIGGER transactionTriggerAfterInsert AFTER INSERT ON transactions\n" +
      "FOR EACH ROW\n" +
      "BEGIN\n" +
      "UPDATE info set transactionCount=transactionCount+1 where _id = 'INFO_ID';\n" +
      "END\n"
    // "DELIMITER ;\n"
  },
  {
    txt: "Build Info Table",
    sql:
      "Begin;\n" +
      "CREATE TABLE IF NOT EXISTS info (\n" +
      "  _id varchar(68) NOT NULL UNIQUE,\n" +
      "  lastheightProcessed BIGINT NOT NULL,\n" +
      "  transactionCount BIGINT NOT NULL,\n" +
      "  version BIGINT NOT NULL,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  recEdited DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  PRIMARY KEY (lastheightProcessed)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;" +
      "INSERT  IGNORE INTO info( _id, lastHeightProcessed, recCreated, recEdited)\n" +
      "VALUES " +
      "    ( 'INFO_ID', -1, NOW(), NOW()  ) \n" +
      "ON DUPLICATE KEY UPDATE recEdited = NOW();\n" +
      "Commit;\n"
  },
  {
    txt: "Build Current Balance Table",
    sql:
      "Begin;\n" +
      "CREATE TABLE IF NOT EXISTS currentBalance (\n" +
      "  _id varchar(68) NOT NULL UNIQUE,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  recEdited DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  ticketsWon BIGINT(20) DEFAULT 0,\n" +
      "  rewardEarn DOUBLE DEFAULT 0.0,\n" +
      "  fsnBalance VARCHAR(40) DEFAULT 0,\n" +
      "  numberOfTransactions DOUBLE DEFAULT 0.0,\n" +
      "  san VARCHAR(32),\n" +
      "  assetsHeld DOUBLE DEFAULT 0.0,\n" +
      "  balanceInfo json,\n" +
      "  PRIMARY KEY (_id),\n" +
      "  INDEX `san` (`san`),\n" +
      "  INDEX `assetsHeld` (`assetsHeld`),\n" +
      "  INDEX `fsnBalance` (`fsnBalance`),\n" +
      "  INDEX `ticketsWon` (`ticketsWon`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;" +
      "Commit;\n"
  },
  {
    txt: "Build Fusion Price Table",
    sql:
      "Begin;\n" +
      "CREATE TABLE IF NOT EXISTS priceWatch (\n" +
      "  _id varchar(68) NOT NULL UNIQUE,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  recEdited DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  price DOUBLE,\n" +
      "  market_cap DOUBLE,\n" +
      "  circulating_supply DOUBLE,\n" +
      "  percentChange1H DOUBLE,\n" +
      "  percentChange24H DOUBLE,\n" +
      "  last_updated DATETIME,\n" +
      "  total_supply BIGINT(20),\n" +
      "  PRIMARY KEY (_id),\n" +
      "  index `last_updated` (`last_updated`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;" +
      "Commit;\n"
  }
];

var buildIndex = 0;

function createTables(resolve, reject) {
  console.log("Start - " + buildTheSystem[buildIndex].txt);
  _masterConnection
    .query(buildTheSystem[buildIndex].sql)
    .then((results, fields) => {
      buildIndex += 1;
      if (buildIndex === buildTheSystem.length) {
        console.log("All done building DB tables");
        resolve(true);
      } else {
        setTimeout(() => {
          createTables(resolve, reject);
        }, 10);
      }
    })
    .catch(err => {
      if (err.code === "ER_TRG_ALREADY_EXISTS") {
        console.log("trigger already exists no problem");
        buildIndex += 1;
        if (buildIndex === buildTheSystem.length) {
          console.log("All done building DB tables");
          resolve(true);
        } else {
          setTimeout(() => {
            createTables(resolve, reject);
          }, 10);
        }
        return;
      }
      console.log("ERROR: " + buildTheSystem[buildIndex].txt, err);
      reject(err);
    });
}

let starttUp = true;

function keepSQLAlive() {
  _isDBConnected = false;
  _pool = mysql.createPool(
    Object.assign({ multipleStatements: true }, dbConnect)
  );

  _pool
    .getConnection()
    .then(conn => {
      _masterConnection = conn;
      return new Promise((resolve, reject) => {
        createTables(resolve, reject);
      }).then(ret => {
        _masterConnection
          .query("select * from info where _id = '" + INFO_ID + "';")
          .then(rows => {
            if (starttUp) {
              lastBlock = rows[0].lastheightProcessed; // redo last height to ensure no logic errors
              starttUp = false;
            }
            // console.log(rows)
            _isDBConnected = true;
            console.log("Databsase connected!");
            return { success: true };
          });
      });
    })
    .catch(err => {
      starttUp = true;
      console.error(
        "connect to database failed, trying again in five seconds",
        err,
        JSON.stringify(err)
      );
      setTimeout(() => {
        keepSQLAlive();
      }, 60000);
    })
    .finally(() => {
      console.log("Connection setup finally called");
      if (_masterConnection) {
        _masterConnection.release();
        _masterConnection = null;
      }
    });
}

let lastConnectTimer;
function keepWeb3Alive() {
  //debugger
  lastConnectTimer = null;
  console.log("STARTING WEB3 connection");
  provider = new Web3.providers.WebsocketProvider(process.env.CONNECT_STRING, {
    timeout: 60000,
    clientConfig: {
      maxReceivedFrameSize: 100000000,
      maxReceivedMessageSize: 100000000
    }
  });
  provider.on("connect", function() {
    //debugger
    web3._isConnected = true;
    web3.fsn.enableBigIntJSONParse();
    scheduleNewScan(10);
  });
  provider.on("error", function(err) {
    //debugger
    //debugger
    if (provider && !provider.___disconnected) {
      provider.___disconnected = true;
      provider.disconnect();
      provider = null;
      web3._isConnected = false;
      console.log("web3 connection error ", err);
      console.log("will try to reconnect");
      lastConnectTimer = lastConnectTimer = setTimeout(() => {
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
keepSQLAlive();

let lastBlock = 1;

function queryAddTagsForInsert(q, p) {
  for (let i = 0; i < p.length; i++) {
    if (i > 0) {
      q += ",?";
    } else {
      q += "?";
    }
  }
  q += ")";
  return q;
}

async function updateLastBlockProcessed() {
  let conn;
  try {
    let now = new Date();
    conn = await _pool.getConnection();
    await conn.query(
      "begin;" +
        "update info set lastheightProcessed=" +
        lastBlock +
        ", recEdited = ?, version = ? where _id = '" +
        INFO_ID +
        "';" +
        "commit;",
      [now, version]
    );
    return { success: true };
  } catch (err) {
    console.log("UPDATET block error ", err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

// setup for database writing
//
async function logBlock(block, tkinfo) {
  let conn;
  try {
    conn = await _pool.getConnection();
    let query = "Insert into blocks Values(";
    let now = new Date();

    // "  hash VARCHAR(68) NOT NULL UNIQUE,\n" +
    // "  height BIGINT NOT NULL UNIQUE,\n" +
    // "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
    // "  recEdited DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
    // "  timeStamp BIGINT UNSIGNED,\n" +
    // "  numberOfTransactions int,\n" +
    // "  block json,\n" +
    let params = [
      block.hash.toLowerCase(),
      block.number,
      now,
      now,
      block.timestamp,
      block.miner,
      block.transactions.length,
      tkinfo.selected,
      JSON.stringify(block),
      JSON.stringify(tkinfo)
    ];

    query = queryAddTagsForInsert(query, params);

    let okPacket = await conn.query(query, params);
    return okPacket.affectedRows === 1;
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      // block was already written
      // normal when we restart scan
      return true;
    }
    console.log("Block log error ", err);
    throw err;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

async function logTransactions(block) {
  if (block.transactions.length === 0) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  return new Promise((resolve, reject) => {
    console.log(block.transactions.length + " transactions ");
    logTransaction(null,block, block.transactions, 0, resolve, reject);
  });
}

let gtl = { blockNumber: 0 };

async function getTransactionLog(transaction) {
  // if a fusion command go and get the log for this transaction
  if (transaction.blockNumber != gtl.blockNumber) {
    // reset gtl
    gtl = { blockNumber: transaction.blockNumber };
  }
  if (gtl[transaction.hash]) {
    // we have this transaction already
    return new Promise((resolve, reject) => {
      return resolve(gtl[transaction.hash]);
    });
  }
  let add = transaction.to ? transaction.to.toLowerCase() : null;
  let from = transaction.from;
  if (
    add === web3.fsn.consts.FSNCallAddress ||
    add === web3.fsn.consts.TicketLogAddress ||
    from === web3.fsn.consts.FSNCallAddress ||
    from === web3.fsn.consts.TicketLogAddress
  ) {
    // we will need to go and get the logs for this item
    return web3.eth
      .getPastLogs({
        address: [
          web3.fsn.consts.FSNCallAddress,
          web3.fsn.consts.TicketLogAddress
        ],
        fromBlock: transaction.blockNumber,
        toBlock: transaction.blockNumber
      })
      .then(logs => {
        if (logs) {
          // save cache of all logs from this block for this adddress
          for (let log of logs) {
            gtl[log.transactionHash] = log;
          }
        }
        return gtl[transaction.hash];
      });
  } else {
    // return a blank transaction
    return new Promise((resolve, reject) => {
      return resolve(null);
    });
  }
}

let balancesToGet = {};

async function getBalances( sql, conn, addrs, index, resolve, reject) {
  if ( !sql ) {
    sql = ""
  }
  if (addrs.length === index) {
    try {
      // debugger
      if ( sql.length > 0 ) {
        rows = await conn.query(sql);
      }
      if ( conn && !conn.__released ) {
        conn.__released = true 
        conn.release()
        conn = null
      }
      resolve(true);
      return;
    } catch (err) {
      if ( conn && !conn.__released ) {
        conn.__released = true 
        conn.release()
        conn = null
      }
      console.log(" getAllBalances error  ", err);
      reject(err);
      return
    }
  }

  // debugger
  let address = addrs[index];

  if (
    !address ||
    address === web3.fsn.consts.FSNCallAddress ||
    address === web3.fsn.consts.TicketLogAddress ||
    address.length === 0
  ) {
    return getBalances(sql, conn, addrs, index + 1, resolve, reject);
  }

  let all;

  if (balancesReturned[address] && balancesReturned[address] > lastBlock) {
    // we have this balance already
    console.log("ALREADY HAVE BALANCE " + address);
    getBalances(sql, conn, addrs, index + 1, resolve, reject);
    return;
  }

  console.log("GETTTING BALANCE " + address);


  try {
    let allInfo = await web3.fsn.allInfoByAddress( address )
    let balances = allInfo.balances // await web3.fsn.getAllBalances(address);
    let timeLockBalances = allInfo.timeLockBalances //  await web3.fsn.getAllTimeLockBalances(address);
    let tickets = allInfo.tickets // await web3.fsn.allTicketsByAddress(address);
    let swaps = -1; // new function will need to be supported to get this info as allSwaps is depreciated await web3.fsn.allSwapsByAddress(address);
    let notation = allInfo.notation // await web3.fsn.getNotation(address);
    all = JSON.stringify({
      balances,
      timeLockBalances,
      tickets,
      swaps,
      notation
    });
    if ( !conn ) {
      conn = await _pool.getConnection();
    }
    let rows = await conn.query(
      `select ((select count(*) from transactions where toAddress="${address}")+
      (select count(*) from transactions where  fromAddress="${address}")) as 'count(*)';`
    );
    let count = rows[0]["count(*)"];
    let fsnBalance =
      balances[
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      ];
    if (!fsnBalance) {
      fsnBalance = "0";
    }
    if (fsnBalance.length < 36) {
      fsnBalance = "0".repeat(36 - fsnBalance.length) + fsnBalance;
    }
    let assetsHeld = Object.keys(Object.assign(balances, timeLockBalances))
      .length;

    sql = sql + 
      `INSERT INTO currentBalance( _id, recCreated, recEdited,  numberOfTransactions, assetsHeld,  fsnBalance, san , balanceInfo )\n` +
      `VALUES(  "${address}", NOW(), NOW(), ${count},  ${assetsHeld}, '${fsnBalance}', '${notation}',  '${all}'  )\n` +
      `ON DUPLICATE KEY UPDATE recEdited = NOW(), assetsHeld = ${assetsHeld}, fsnBalance = '${fsnBalance}', numberOfTransactions = ${count}, san = '${notation}', balanceInfo =  '${all}' ;\n`;


    balancesReturned[address] = glb_highestBlockOnChain;

    getBalances(sql,conn, addrs, index + 1, resolve, reject);
  } catch (err) {
    if ( conn && !conn.__released ) {
      conn.__released = true 
      conn.release()
      conn = null
    }
    console.log(" getAllBalances error  ", err);
    reject(err);
  } finally {
  }
}

let lastAssetBlock = -1
let assets = { }
async function cachedGetAsset( block, getAssetBalance) {
  // await web3.fsn.getAsset(getAssetBalance);
  if ( block !== lastAssetBlock ) {
    lastAssetBlock = block
    assets = {}
  }
  if ( assets[getAssetBalance] !== undefined ) {
    return assets[getAssetBalance]
  }
  let asset =  await web3.fsn.getAsset(getAssetBalance);
  assets[getAssetBalance] = asset
  return asset
}

async function logTransaction( conn , block, transactions, index, resolve, reject) {
  console.log("   Transaction " + index + " being proceessed");
  if (index === 0) {
    balancesToGet = {};
    if ( block.number === 1 ) {
      // add the genesis accounts to balances to get
      for ( let act of genesisAccounts ) {
        balancesToGet[act] = true
      }
    }
  }
  if (transactions.length === index) {
    let keys = Object.keys(balancesToGet);
    if (keys.length) {
      return getBalances( "", conn, keys, 0, resolve, reject);
    } else {
      if ( conn && !conn.__released ) {
        conn.__released = true
        conn.release()
        conn = null
      } 
      resolve(true);
    }
    return;
  }
  if (!web3._isConnected) {
    reject(new Error("web3 not connected"));
    return;
  }

  try {
    let data = await web3.fsn.getTransactionAndReceipt(transactions[index]);
    let transaction = data.tx //  await web3.eth.getTransaction(transactions[index]);
    let receipt = data.receiptFound ? data.receipt : null // await web3.eth.getTransactionReceipt(transactions[index]);
    if (!receipt) {
      reject(new Error("transaction not complete, no receipt"));
      return;
    }

    let log = receipt.logs.length > 0 ? receipt.logs[0] : undefined

    if ( !conn ) {
      conn = await _pool.getConnection();
    }
    // merge receipt and transaction
    //debugger
    transaction.topics =
      log && log.topics && log.topics.length > 0 ? log.topics : null;

    // debugger;

    let query = "Insert into transactions Values(";
    let now = new Date();
    let fusionCommand;
    let commandExtra;
    let commandExtra2;
    let commandExtra3;
    let getAssetBalance;
    let blockNumber = parseInt( transaction.blockNumber )

    let logData = null;
    let jsonLogData;
    let saveData = null;

    if (receipt.logs.length) {
      try {
        saveData = web3.fsn.hex2a(receipt.logs[0].data);
        jsonLogData = JSON.parse(saveData);
        logData = JSON.stringify(jsonLogData);
      } catch (e) {
        logData = null;
        saveData = null;
      }
    }

    if (!logData && receipt.logs) {
      try {
        logData = JSON.stringify({ data: receipt.logs[0].data });
      } catch (e) {
        logData = null;
      }
    }

    transaction.to = transaction.to ? transaction.to.toLowerCase() : "";
    transaction.from = transaction.from.toLowerCase();

    balancesToGet[transaction.from] = true;

    if (transaction.topics) {
      let topic = parseInt(transaction.topics[0] , 16 );
      if (
        transaction.to === web3.fsn.consts.FSNCallAddress ||
        transaction.from === web3.fsn.consts.FSNCallAddress
      ) {
        fusionCommand = web3.fsn.consts.FSNCallAddress_Topic_To_Function[topic];
      } else if (
        transaction.to === web3.fsn.consts.TicketLogAddress ||
        transaction.from === web3.fsn.consts.TicketLogAddress
      ) {
        fusionCommand =
          web3.fsn.consts.TicketLogAddress_Topic_To_Function[topic];
        balancesToGet[transaction.to] = true;
      }
    } else {
      balancesToGet[transaction.to] = true;
    }

    let swapDeleted = false
    if (jsonLogData) {
      if (jsonLogData.To) {
        let addTo = jsonLogData.To.toLowerCase();
        balancesToGet[addTo] = true;
        // we are reserving command extra 3 for To field
        commandExtra3 = addTo;
      }

      switch (fusionCommand) {
        case "AssetValueChangeFunc":
        case "AssetValueChangeExtFunc":
          commandExtra = jsonLogData.AssetID;
          getAssetBalance = jsonLogData.AssetID;
          break;
        case "GenAssetFunc":
          commandExtra = jsonLogData.AssetID;
          commandExtra2 =
            jsonLogData.Name + " (" + jsonLogData.Symbol.toUpperCase() + ")";
          getAssetBalance = jsonLogData.AssetID;
          break;
        case "SendAssetFunc":
          commandExtra = jsonLogData.AssetID;
          break;
        case "TimeLockFunc":
          commandExtra = jsonLogData.AssetID;
          fusionCommand = jsonLogData.LockType;
          break;
        case "BuyTicketFunc":
          commandExtra = jsonLogData.TicketID;
          break;
        case "MakeSwapFuncExt":
        case "MakeSwapFunc":
          commandExtra = jsonLogData.SwapID;
          commandExtra2 = jsonLogData.FromAssetID
          commandExtra3 = jsonLogData.ToAssetID
          // add the swap to the swap list
          //
          {
            let swapValues = 
            [ 
              jsonLogData.SwapID,
              now,
              blockNumber,
              block.timestamp,
              transaction.hash.toLowerCase(),
              transaction.from,
              jsonLogData.FromAssetID,
              jsonLogData.ToAssetID,
              jsonLogData.SwapSize,
              saveData
            ]
            let querySwaps = "Insert into swaps Values(";
            querySwaps = queryAddTagsForInsert(querySwaps, swapValues);
            await conn.query(querySwaps, swapValues);
          }
          break
        case "MakeMultiSwapFunc":
          commandExtra = jsonLogData.SwapID;
          break;
        case "TakeSwapFunc":
          commandExtra = jsonLogData.SwapID;
          swapDeleted = ((jsonLogData.Deleted === "true") || (jsonLogData.Deleted === true) )
          // we need the maker of this swap to get the balance
          try {
            // we need to update the balance of the maker as well
            let query = `select * from swaps where swapID = ?`
            let rows = await conn.query( query, [ commandExtra ])
            let address = rows[0].fromAddress;
            let size = rows[0].size
            size = size - jsonLogData.size
            if ( size === 0 ) {
              let querySwaps = "delete from swaps where swapID=?";
              await conn.query(querySwaps,  [jsonLogData.SwapID]);
            } else {
              let querySwaps = "update swaps set `size` = ? where swapID=?";
              await conn.query(querySwaps,  [size, jsonLogData.SwapID ]);
            }
            balancesToGet[address] = true;
          } catch (e ) {
            console.log("takeSwap update failed ", e)
            // if it doesn't work balance can be refreshed later
            throw e
          }
          break;
        case "TakeMultiSwapFunc":
          commandExtra = jsonLogData.SwapID;
          swapDeleted = ((jsonLogData.Deleted === "true") || (jsonLogData.Deleted === true) )
          break;
        case "RecallSwapFunc":
        case "RecallMultiSwapFunc":
          {
            let querySwaps = "delete from swaps where swapID=?";
            await conn.query(querySwaps,  [jsonLogData.SwapID]);
          }
          swapDeleted = true
          commandExtra = jsonLogData.SwapID;
          break;
      }
    }

    if ( swapDeleted ) {
      // update the swap deleted table
      /* 
            "  swap VARCHAR(68) NOT NULL UNIQUE,\n" +
      "  hash VARCHAR(68) NOT NULL,\n" +
      "  height BIGINT NOT NULL,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      */
     /** command to rebuild if neccessary
      * 
      * INSERT INTO deletedSwaps(swap,hash,height,recreated) 
        select commandExtra, hash, height, recCreated  from transactions  where swapDeleted <> 0
      *
      */
     let swapQuery = "Insert into deletedSwaps Values(";
      let params = [
        commandExtra,
        transaction.hash.toLowerCase(),
        blockNumber,
        new Date(),
      ]
      swapQuery = queryAddTagsForInsert(swapQuery, params);
      await conn.query(swapQuery, params);
    }

    // "  hash VARCHAR(68) NOT NULL UNIQUE,\n" +
    // "  height BIGINT NOT NULL,\n" +
    // "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
    // "  recEdited DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
    // "  fromAddress VARCHAR(68),\n" +
    // "  toAddress VARCHAR(68),\n" +
    // "  fusionCommand VARCHAR(68),\n" +
    // "  data json,\n"+
    // "  transaction json,\n" +
    let params = [
      transaction.hash.toLowerCase(),
      blockNumber,
      block.timestamp,
      now,
      now,
      transaction.from,
      transaction.to,
      fusionCommand,
      commandExtra,
      commandExtra2,
      commandExtra3,
      swapDeleted,
      saveData,
      JSON.stringify(transaction),
      JSON.stringify(receipt)
    ];

    query = queryAddTagsForInsert(query, params);
    await conn.query(query, params);

    index += 1;
    if (getAssetBalance) {
      let asset = cachedGetAsset( block, getAssetBalance) // await web3.fsn.getAsset(getAssetBalance);
      let totalSupply = asset.Total;
      await conn.query(
        "UPDATE transactions set commandExtra3  = ? where hash = ?;",
        [totalSupply, transaction.hash.toLowerCase()]
      );
      logTransaction(conn,block, transactions, index, resolve, reject);
    } else {
      logTransaction(conn,block, transactions, index, resolve, reject);
    }
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      // block was already written
      // normal when we restart scan
      logTransaction(conn,block, transactions, index + 1, resolve, reject);
      return true;
    }
    if (conn && !conn.__released) {
      conn.__released = true
      conn.release();
      conn = null;
    }
    console.log("transaction log error ", err);
    reject(err);
  } finally {
  }
}

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

async function logTicketPurchased(blockNumber, tikinfo) {
  let conn;
  try {
    conn = await _pool.getConnection();
    let { selected } = tikinfo;
    let tkQuery =
      "select fromAddress from transactions where fusionCommand='BuyTicketFunc' and commandExtra ='" +
      selected +
      "';";
    // console.log(tkQuery);
    let rows = await conn.query(tkQuery);
    try {
      let address = rows[0].fromAddress;
      await conn.query(
        "UPDATE currentBalance set ticketsWon  = ticketsWon + 1, rewardEarn = rewardEarn + ? where _id = ?;",
        [calcReward(blockNumber), address]
      );
    } catch (e) {
      //debugger
    }
    conn.release();
    conn = null;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

function callBlockScanAgain() {
  if (!timerSet) {
    setTimeout(() => {
      timerSet = null;
      resumeBlockScan();
    }, 2000);
  }
}

function resumeBlockScan() {
  if (!web3._isConnected) {
    console.log("web3 connection down returning");
    callBlockScanAgain();
    return;
  }
  if (!_isDBConnected) {
    console.log("Database is not connected yet ");
    callBlockScanAgain();
    return;
  }

  updateOnlinePrice();
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
      }, 50000);
    }
    return;
  }

  counter = 0;

  inHere = true;

  let query = `SELECT
  CONCAT(z.expected, IF(z.got-1>z.expected, CONCAT(' thru ',z.got-1), '')) AS missing
 FROM (
  SELECT
   @rownum:=@rownum+1 AS expected,
   IF(@rownum=height, 0, @rownum:=height) AS got
  FROM
   (SELECT @rownum:=0) AS a
   JOIN blocks
   ORDER BY height
  ) AS z
 WHERE z.got!=0;`;

  if (process.env.FILLIN === "true") {
    let releaseConn = false;
    return _pool.getConnection().then(conn => {
      return conn
        .query(query)
        .then(rows => {
          conn.release();
          releaseConn = true;
          if (rows && rows.length > 0) {
            let missing = rows[0]["missing"].split(" ")[0];
            lastBlock = parseInt(missing);
            console.log("filling in missing block ", lastBlock);
            doBlockScan();
          } else {
            console.log("no missing blocks, trying again in 30 seconds");
            inHere = false;
            if (!timerSet) {
              timerSet = setTimeout(() => {
                timerSet = null;
                resumeBlockScan();
              }, 30000);
            }
          }
        })
        .catch(err => {
          // throw err;
          console.log("database error ", err);
          inHere = false;
          if (!timerSet) {
            timerSet = setTimeout(() => {
              timerSet = null;
              resumeBlockScan();
            }, 10);
          }
        })
        .finally(() => {
          if (!releaseConn) {
            conn.release();
          }
        });
    });
  } else {
    doBlockScan();
  }
}

function scheduleNewScan(timeToSet) {
  inHere = false;
  if (!timerSet) {
    timerSet = setTimeout(() => {
      timerSet = null;
      resumeBlockScan();
    }, timeToSet || 14000);
  }
}

async function doBlockScan() {
  try {
    let currentBlock = await web3.eth.getBlockNumber();
    glb_highestBlockOnChain = currentBlock;
    if (process.env.FILLIN !== "true" && currentBlock + numberOfBlocksToWait < lastBlock) {
      // wait for two blocks for data to fill in
      console.log("Really Waiting for new block..." + new Date());
      scheduleNewScan();
      return true;
    }
    let block = await web3.eth.getBlock(lastBlock);
    if (!block) {
      // wait for block to update
      console.log("Waiting for new block..." + new Date());
      // lets update the database to show we alive
      scheduleNewScan();
      return;
    }
    console.log("Start Block -> ", lastBlock, block.hash);
    let c=  web3.utils.numberToHex(lastBlock)
    dbg("get snapshot ")
    let jt = await web3.fsn.getSnapshot(c);
    dbg("snapshot done")
    await logBlock(block, jt);
    dbg("log block done")
    await logTransactions(block);
    await logTicketPurchased(lastBlock, jt);
    console.log("Did   Block -> ", lastBlock, block.hash);
    if (process.env.FILLIN === "true") {
      scheduleNewScan(10);
      return true;
    }
    await updateLastBlockProcessed();
    lastBlock += 1;
    scheduleNewScan(10);
  } catch (err) {
    console.log("uncaught error, try again ", err);
    scheduleNewScan();
  }
}

var lasttime = 0;
var inpriceget = false;
var onlineCounter = 0;

function updateOnlinePrice() {
  if (!_isDBConnected) {
    return // this will be called on next block
  }
  if (!process.env.CMC_KEY) {
    return;
  }
  if (inpriceget) {
    return;
  }
  if ( !checkPriceOfFSN ) {
    return
  }
  if (lasttime !== 0) {
    let newtime = new Date().getTime();
    if (lasttime + (600 * 1000) < newtime) {
      // we check every 10 minutes to keep api correct
      lasttime = newtime;
    } else {
      return;
    }
  } else {
    lasttime = new Date().getTime();
  }
  console.log("get quote");

  inpriceget = true;
  onlineCounter += 1;
  // if (onlineCounter < 5) {
  //   return;
  // }
  onlineCounter = 0;

  const requestOptions = {
    method: "GET",
    uri: "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
    qs: {
      id: 2530,
      // symbol: "FSN",
      convert: "USD"
    },
    headers: {
      "X-CMC_PRO_API_KEY": process.env.CMC_KEY
    },
    json: true,
    gzip: true
  };

  // let x = {
  //   status: {
  //     timestamp: "2018-12-09T12:48:28.094Z",
  //     error_code: 0,
  //     error_message: null,
  //     elapsed: 5,
  //     credit_count: 1
  //   },
  //   data: {
  //     FSN: {
  //       id: 2530,
  //       name: "Fusion",
  //       symbol: "FSN",
  //       slug: "fusion",
  //       circulating_supply: 29704811.2,
  //       total_supply: 57344000,
  //       max_supply: null,
  //       date_added: "2018-02-16T00:00:00.000Z",
  //       num_market_pairs: 13,
  //       tags: [],
  //       platform: {
  //         id: 1027,
  //         name: "Ethereum",
  //         symbol: "ETH",
  //         slug: "ethereum"
  //       },
  //       cmc_rank: 133,
  //       last_updated: "2018-12-09T12:46:22.000Z",
  //       quote: {
  //         USD: {
  //           price: 0.654078335847,
  //           volume_24h: 506902.697094068,
  //           percent_change_1h: 0.685086,
  //           percent_change_24h: 1.13452,
  //           percent_change_7d: -3.37596,
  //           market_cap: 19429273.476345327,
  //           last_updated: "2018-12-09T12:46:22.000Z"
  //         }
  //       }
  //     }
  //   }
  // };

  rp(requestOptions)
    .then(response => {
      inpriceget = false;
      let x = response;
      if (x.status.error_code === 0) {
        let query = "Insert into priceWatch Values(";
        x.data.FSN = x.data["2530"];
        priceStructure = {
          price: x.data.FSN.quote.USD.price,
          market_cap: x.data.FSN.quote.USD.market_cap,
          circulating_supply: x.data.FSN.circulating_supply, // : 29704811.2,
          percentChange1H: x.data.FSN.quote.USD.percent_change_1h,
          percentChange24H: x.data.FSN.quote.USD.percent_change_24h,
          last_updated: x.data.FSN.quote.USD.last_updated,
          total_supply: x.data.FSN.total_supply
        };

        let now = new Date();

        let params = [
          x.status.timestamp,
          now,
          now,
          priceStructure.price,
          priceStructure.market_cap,
          priceStructure.circulating_supply,
          priceStructure.percentChange1H,
          priceStructure.percentChange24H,
          new Date(priceStructure.last_updated),
          priceStructure.total_supply
        ];

        query = queryAddTagsForInsert(query, params);

        return _pool.getConnection().then(conn => {
          return conn
            .query(query, params)
            .then(okPacket => {
              return okPacket.affectedRows === 1;
            })
            .catch(err => {
              if (err.code === "ER_DUP_ENTRY") {
                // block was already written
                // normal when we restart scan
                return true;
              }
              console.log("price log error ", err);
              // throw err;
            })
            .finally(() => {
              conn.release();
            });
        });
      }
    })
    .catch(err => {
      console.log("API call error:", err.message);
      inpriceget = false;
    });
}

function formatDecimals(val, decimals) {
  if (typeof val === "object") {
    val = val.toString();
  }
  let len = val.length;
  if (len < decimals) {
    val = "0".repeat(decimals - len) + val;
    len = decimals;
  }
  if (len === decimals) {
    val = "0." + val;
  } else {
    val = insert(val, val.length - decimals, ".");
  }
  return val;
}

function dbg(a) {
  console.log(a)
}