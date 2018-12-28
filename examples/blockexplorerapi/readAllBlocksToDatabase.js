var assert = require("assert");
var Web3 = require("web3");
var web3FusionExtend = require("../../index.js");
var mysql = require("promise-mysql");
const fetch = require("node-fetch");
const CryptoJS = require("crypto-js");
const rp = require("request-promise");

let version = 1.0;

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
      "  INDEX `miner` (`miner`),\n" +
      "  INDEX `numberOfTransactions` (`numberOfTransactions`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
  },
  {
    txt: "Build Transactions",
    sql:
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
      "  data text,\n"+
      "  transaction json,\n" +
      "  receipt json,\n" +
      "  PRIMARY KEY (hash),\n" +
      "  INDEX `height` (`height`),\n" +
      "  INDEX `recCreated` (`recCreated`),\n" +
      "  INDEX `fromAddress` (`fromAddress`),\n" +
      "  INDEX `timestamp` (`timeStamp`),\n" +
      "  INDEX `commandExtra` (`commandExtra`),\n" +
      "  INDEX `commandExtra2` (`commandExtra2`),\n" +
      "  INDEX `commandExtra3` (`commandExtra3`),\n" +
      "  INDEX `toAddress` (`toAddress`),\n" +
      "  INDEX `fusionCommand` (`fusionCommand`,`commandExtra`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
  },
  {
    txt: "Build Info Table",
    sql:
      "Begin;\n" +
      "CREATE TABLE IF NOT EXISTS info (\n" +
      "  _id varchar(68) NOT NULL UNIQUE,\n" +
      "  lastheightProcessed BIGINT NOT NULL,\n" +
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
        err
      );
      setTimeout(() => {
        keepSQLAlive();
      }, 60000);
    });
}

function keepWeb3Alive() {
  //debugger
  provider = new Web3.providers.WebsocketProvider(process.env.CONNECT_STRING);
  provider.on("connect", function() {
    //debugger
    web3._isConnected = true;
    resumeBlockScan();
  });
  provider.on("error", function(err) {
    //debugger
    provider.disconnect();
  });
  provider.on("end", function(err) {
    //debugger
    web3._isConnected = false;
    console.log("web3 connection error ", err);
    console.log("will try to reconnect");
    setTimeout(() => {
      keepWeb3Alive();
    }, 2);
  });
  web3 = new Web3(provider);
  web3 = web3FusionExtend.extend(web3);
}

// startup our web3 connection
//
keepWeb3Alive();
keepSQLAlive();

let lastBlock = 0;

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

function updateLastBlockProcessed() {
  let now = new Date();
  return _pool.getConnection().then(conn => {
    conn
      .query(
        "begin;" +
          "update info set lastheightProcessed=" +
          lastBlock +
          ", recEdited = ?, version = ? where _id = '" +
          INFO_ID +
          "';" +
          "commit;",
        [now, version]
      )
      .then(rows => {
        return { success: true };
      })
      .catch(err => {
        console.log("UPDATET block error ");
        throw err;
      })
      .finally(() => {
        conn.release();
      });
  });
}

// setup for database writing
//
function logBlock(block, tkinfo) {
  return _pool.getConnection().then(conn => {
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
        console.log("Block log error ", err);
        throw err;
      })
      .finally(() => {
        conn.release();
      });
  });
}

function logTransactions(block) {
  if (block.transactions.length === 0) {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }

  return new Promise((resolve, reject) => {
    console.log(block.transactions.length + " transactions ");
    logTransaction(block, block.transactions, 0, resolve, reject);
  });
}

let gtl = { blockNumber: 0 };

function getTransactionLog(transaction) {
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

function getBalances(addrs, index, resolve, reject) {
  if (addrs.length === index) {
    resolve(true);
    return;
  }

  // debugger
  let address = addrs[index];

  if (
    address === web3.fsn.consts.FSNCallAddress ||
    address === web3.fsn.consts.TicketLogAddress
  ) {
    return getBalances(addrs, index + 1, resolve, reject);
  }

  let all;

  console.log("GETTTING BALANCE " + address);

  return web3.fsn
    .getAllBalances(address)
    .then(balances => {
      web3.fsn.getAllTimeLockBalances(address).then(timeLockBalances => {
        web3.fsn.allTicketsByAddress(address).then(tickets => {
          web3.fsn.allSwapsByAddress(address).then(swaps => {
            web3.fsn.getNotation(address).then(notation => {
              all = JSON.stringify({
                balances,
                timeLockBalances,
                tickets,
                swaps,
                notation
              });
              return _pool.getConnection().then(conn => {
                return conn
                  .query(
                    `select count(*) from transactions where toAddress="${address}" or fromAddress="${address}";`
                  )
                  .then(rows => {
                    let count = rows[0]["count(*)"];
                    let fsnBalance =
                      balances[
                        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
                      ];
                    if (!fsnBalance) {
                      fsnBalance = "0";
                    }
                    if (fsnBalance.length < 36) {
                      fsnBalance =
                        "0".repeat(36 - fsnBalance.length) + fsnBalance;
                    }
                    let assetsHeld = Object.keys(
                      Object.assign(balances, timeLockBalances)
                    ).length;

                    let sql =
                      `INSERT INTO currentBalance( _id, recCreated, recEdited,  numberOfTransactions, assetsHeld,  fsnBalance, san , balanceInfo )\n` +
                      `VALUES(  "${address}", NOW(), NOW(), ${count},  ${assetsHeld}, '${fsnBalance}', '${notation}',  '${all}'  )\n` +
                      `ON DUPLICATE KEY UPDATE recEdited = NOW(), assetsHeld = ${assetsHeld}, fsnBalance = '${fsnBalance}', numberOfTransactions = ${count}, san = '${notation}', balanceInfo =  '${all}' ;\n`;
                    return conn.query(sql).then(rows => {
                      getBalances(addrs, index + 1, resolve, reject);
                    });
                  })
                  .finally(() => {
                    conn.release();
                  });
              });
            });
          });
        });
      });
    })
    .catch(err => {
      console.log(" getAllBalances error  ", err);
      reject(err);
    });
}

function logTransaction(block, transactions, index, resolve, reject) {
  if (index === 0) {
    balancesToGet = {};
  }
  if (transactions.length === index) {
    let keys = Object.keys(balancesToGet);
    if (keys.length) {
      return getBalances(keys, 0, resolve, reject);
    } else {
      resolve(true);
    }
    return;
  }
  if (!web3._isConnected) {
    reject(new Error("web3 not connected"));
    retturn;
  }

  return web3.eth
    .getTransaction(transactions[index])
    .then(transaction => {
      return web3.eth
        .getTransactionReceipt(transactions[index])
        .then(receipt => {
          return getTransactionLog(transaction).then(log => {
            console.log("transaction => ", receipt, transaction, log);
            return _pool.getConnection().then(conn => {
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

              let logData = null;
              let jsonLogData;
              let saveData = null

              if (receipt.logs.length) {
                try {
                  saveData = web3.fsn.hex2a(receipt.logs[0].data)
                  jsonLogData = JSON.parse(
                    saveData
                  );
                  logData = JSON.stringify(jsonLogData);
                } catch (e) {
                  logData = null;
                  saveData = null
                }
              }

              if (!logData && receipt.logs) {
                try {
                  logData = JSON.stringify({ data: receipt.logs[0].data });
                } catch (e) {
                  logData = null;
                }
              }

              transaction.to = transaction.to.toLowerCase();
              transaction.from = transaction.from.toLowerCase();

              balancesToGet[transaction.from] = true;

              if (transaction.topics) {
                let topic = parseInt(transaction.topics[0].substr(2));
                if (
                  transaction.to === web3.fsn.consts.FSNCallAddress ||
                  transaction.from === web3.fsn.consts.FSNCallAddress
                ) {
                  fusionCommand =
                    web3.fsn.consts.FSNCallAddress_Topic_To_Function[topic];
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

              if (jsonLogData) {
                if (jsonLogData.To) {
                  balancesToGet[jsonLogData.To.toLowerCase()] = true;
                }

                switch (fusionCommand) {
                  case "AssetValueChangeFunc":
                    commandExtra = jsonLogData.AssetID;
                    getAssetBalance = jsonLogData.AssetID;
                    break;
                  case "GenAssetFunc":
                    commandExtra = jsonLogData.AssetID;
                    commandExtra2 =
                      jsonLogData.Name +
                      " (" +
                      jsonLogData.Symbol.toUpperCase() +
                      ")";
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
                    commandExtra = jsonLogData.Ticket;
                    break;
                  case "MakeSwapFunc":
                    commandExtra = jsonLogData.SwapID;
                    break;
                  case "TakeSwapFunc":
                    commandExtra = jsonLogData.SwapID;
                    break;
                  case "RecallSwapFunc":
                    commandExtra = jsonLogData.SwapID;
                    break;
                }
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
                transaction.blockNumber,
                block.timestamp,
                now,
                now,
                transaction.from,
                transaction.to,
                fusionCommand,
                commandExtra,
                commandExtra2,
                commandExtra3,
                saveData,
                JSON.stringify(transaction),
                JSON.stringify(receipt)
              ];

              query = queryAddTagsForInsert(query, params);

              return conn
                .query(query, params)
                .then(okPacket => {
                  // if ( okPacket.affectedRows === 1 ) {
                  index += 1;
                  if (getAssetBalance) {
                    return web3.fsn.getAsset(getAssetBalance).then(asset => {
                      let totalSupply = asset.Total;
                      conn
                        .query(
                          "UPDATE transactions set commandExtra3  = ? where hash = ?;",
                          [totalSupply, transaction.hash.toLowerCase()]
                        )
                        .then(rows => {
                          logTransaction(
                            block,
                            transactions,
                            index,
                            resolve,
                            reject
                          );
                        });
                    });
                  } else {
                    logTransaction(block, transactions, index, resolve, reject);
                  }
                })
                .catch(err => {
                  if (err.code === "ER_DUP_ENTRY") {
                    // block was already written
                    // normal when we restart scan
                    logTransaction(
                      block,
                      transactions,
                      index + 1,
                      resolve,
                      reject
                    );
                    return true;
                  }
                  console.log("transaction log error ", err);
                  reject(err);
                })
                .finally(() => {
                  conn.release();
                });
            });
          });
        });
    })
    .catch(err => {
      console.log("error getting transaction ", err);
      reject(err);
    });
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

function logTicketPurchased(blockNumber, tikinfo) {
  return _pool.getConnection().then(conn => {
    let { selected } = tikinfo;
    let tkQuery =
      "select fromAddress from transactions where fusionCommand='BuyTicketFunc' and commandExtra ='" +
      selected +
      "';";
    console.log(tkQuery);
    return conn
      .query(tkQuery)
      .then(rows => {
        try {
          let address = rows[0].fromAddress;
          return conn
            .query(
              "UPDATE currentBalance set ticketsWon  = ticketsWon + 1, rewardEarn = rewardEarn + ? where _id = ?;",
              [calcReward(blockNumber), address]
            )
            .then(rows => {});
        } catch (e) {
          //debugger
        }
        //console.log(rows)
        //debugger
      })
      .finally(() => {
        conn.release();
      });
  });
}

function resumeBlockScan() {
  if (!web3._isConnected) {
    console.log("web3 connection down returning");
    setTimeout(() => {
      resumeBlockScan();
    }, 2000);
    return;
  }
  if (!_isDBConnected) {
    console.log("Database is not connected yet ");
    setTimeout(() => {
      resumeBlockScan();
    }, 2000);
    return;
  }

  updateOnlinePrice();
  if (lastBlock === -1) {
    lastBlock = 0;
  }

  return web3.eth
    .getBlock(lastBlock)
    .then(block => {
      return web3.fsn
        .getSnapshot(web3.utils.numberToHex(lastBlock))
        .then(jt => {
          if (block) {
            return logBlock(block, jt).then(ret => {
              return logTransactions(block).then(ret => {
                return logTicketPurchased(lastBlock, jt).then(ret => {
                  console.log(lastBlock, block);
                  return updateLastBlockProcessed().then(ret => {
                    lastBlock += 1;
                    setTimeout(() => {
                      resumeBlockScan();
                    }, 10);
                  });
                });
              });
            });
          } else {
            // wait for block to update
            console.log("Waiting for new block..." + new Date());
            // lets update the database to show we alive
            setTimeout(() => {
              resumeBlockScan();
            }, 15000);
          }
        });
    })
    .catch(err => {
      console.log("error talking to server, try again ", err);
      setTimeout(() => {
        resumeBlockScan();
      }, 10000);
    });
}

var lasttime = 0;
var inpriceget = false;
var onlineCounter = 0;

function updateOnlinePrice() {
  if (!_isDBConnected) {
    setTimeout(() => {
      updateOnlinePrice();
    }, 100);
  }
  if (!process.env.CMC_KEY) {
    return;
  }
  if (inpriceget) {
    return;
  }
  if (lasttime !== 0) {
    let newtime = new Date().getTime();
    if (lasttime + 420 * 1000 < newtime) {
      // we check every 7 minutes to keep api correct
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
