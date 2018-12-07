var assert = require("assert");
var Web3 = require("web3");
var web3FusionExtend = require("../index.js");
var mysql = require("promise-mysql");

/*  Remember to set your environment variables to run this test
    e.g. CONNECT_STRING="ws://3.16.110.25:9001" DB_CONNECT_STRING="{'host':'localhost','user':'root','password':'password','database':'db1','connectionLimit':10}" node ./examples/readAllBlocksToADatabase
*/

console.log("CONNECT_STRING ==> ", process.env.CONNECT_STRING);
console.log("DATABASE_CONNECT ==> ", process.env.DB_CONNECT_STRING);
var dbConnect = JSON.parse(process.env.DB_CONNECT_STRING.replace(/'/g, '"'));
var web3;
var _pool;
var _masterConnection;


const INFO_ID = "INFO_ID"

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
      "  numberOfTransactions int,\n" +
      "  block json,\n" +
      "  PRIMARY KEY (hash),\n" +
      "  INDEX `recCreated` (`recCreated`),\n" +
      "  INDEX `timestamp` (`timeStamp`),\n" +
      "  INDEX `numberOfTransactions` (`numberOfTransactions`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
  },
  {
    txt: "Build Transactions",
    sql:
      "CREATE TABLE IF NOT EXISTS transactions (\n" +
      "  hash VARCHAR(68) NOT NULL UNIQUE,\n" +
      "  height BIGINT NOT NULL,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  recEdited DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  fromAddress VARCHAR(68),\n" +
      "  toAddress VARCHAR(68),\n" +
      "  fusionCommand VARCHAR(68),\n" +
      "  data json,\n"+
      "  transaction json,\n" +
      "  PRIMARY KEY (hash),\n" +
      "  INDEX `height` (`height`),\n" +
      "  INDEX `recCreated` (`recCreated`),\n" +
      "  INDEX `fromAddress` (`fromAddress`),\n" +
      "  INDEX `toAddress` (`toAddress`),\n" +
      "  INDEX `fusionCommand` (`fusionCommand`)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
  },
  {
    txt: "Build Info Table",
    sql:
      "Begin;\n"+
      "CREATE TABLE IF NOT EXISTS info (\n" +
      "  _id varchar(68) NOT NULL UNIQUE,\n" +
      "  lastheightProcessed BIGINT NOT NULL,\n" +
      "  recCreated DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  recEdited DATETIME DEFAULT CURRENT_TIMESTAMP,\n" +
      "  PRIMARY KEY (lastheightProcessed)\n" +
      ") ENGINE=InnoDB CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"+
      "INSERT INTO info( _id, lastHeightProcessed, recCreated, recEdited)\n"+
      "VALUES( 'INFO_ID', -1, NOW(), NOW()  )\n"+
      "ON DUPLICATE KEY UPDATE recEdited = NOW();\n"+
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
        _masterConnection.query( "select * from info where _id = '"+INFO_ID+"';")
        .then( (rows)=> {
          lastBlock = rows[0].lastheightProcessed + 1;
          // console.log(rows)
          _isDBConnected = true;
          console.log("Databsase connected!");
          return { success: true };
        })
      });
    })
    .catch(err => {
      console.error(
        "connect to database failed, trying again in five seconds",
        err
      );
      setTimeout(() => {
        keepSQLAlive();
      }, 50000);
    });
}

function keepWeb3Alive() {
  provider = new Web3.providers.WebsocketProvider(process.env.CONNECT_STRING);
  provider.on("connect", function() {
    web3._isConnected = true;
    resumeBlockScan();
  });
  provider.on("error", function(err) {
    web3._isConnected = false;
    console.log("web3 connection error ", err);
    console.log("will try to reconnect");
    setTimeout(() => {
      keepWeb3Alive();
    }, 5);
  });
  provider.on("end", function() {
    web3._isConnected = false;
    console.log("web3 connection error ", err);
    console.log("will try to reconnect");
    setTimeout(() => {
      keepWeb3Alive();
    }, 5);
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
  return _pool.getConnection().then(conn => {
    conn.query( "update info set lastheightProcessed="+(lastBlock+1)+" where _id = '"+INFO_ID+"';")
  .then( (rows)=> {
    return { success: true };
  })
  .finally( ()=> {
    conn.release();
  })
})
}

// setup for database writing
//
function logBlock(block) {
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
      block.transactions.length,
      JSON.stringify(block)
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
    logTransaction(block.transactions, 0, resolve, reject);
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
  let add = transaction.to ?  transaction.to.toLowerCase() : null
  let from = transaction.from
  if (
    add  === web3.fsn.consts.FSNCallAddress ||
    add  === web3.fsn.consts.TicketLogAddress || 
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

function logTransaction(transactions, index, resolve, reject) {
  if (transactions.length === index) {
    resolve(true);
    return;
  }
  if (!web3._isConnected) {
    reject(new Error("web3 not connected"));
    retturn;
  }

  return web3.eth
    .getTransaction(transactions[index])
    .then(transaction => {
      return web3.eth.getTransactionReceipt(transactions[index]).then(receipt => {
        return getTransactionLog(transaction).then(log => {
          console.log("transaction => ", receipt, transaction, log);
          return _pool.getConnection().then(conn => {
            // merge receipt and transaction
            //debugger
            transaction.topics =
              log && log.topics && log.topics.length > 0 ? log.topics : null;

            let query = "Insert into transactions Values(";
            let now = new Date();
            let fusionCommand;
            let logData = null;

            if ( receipt.logs.length ) {

              try {
                logData = JSON.stringify( JSON.parse(
                  web3.fsn.hex2a(receipt.logs[0].data) )
                );
              } catch ( e ) {
                logData = null
              }
            }

            if ( !logData && receipt.logs[0].data ) {
              try {
                  logData = JSON.stringify( { data : receipt.logs[0].data  })
              }
              catch (e) {
                logData = null
              }
            }

            transaction.to = transaction.to.toLowerCase()
            transaction.from = transaction.from.toLowerCase()

            if (transaction.topics) {
              let topic = parseInt(transaction.topics[0].substr(2));
              if (transaction.to === web3.fsn.consts.FSNCallAddress || transaction.from === web3.fsn.consts.FSNCallAddress) {
                  fusionCommand =
                    web3.fsn.consts.FSNCallAddress_Topic_To_Function[topic];
              } else if (
                transaction.to === web3.fsn.consts.TicketLogAddress || transaction.from === web3.fsn.consts.TicketLogAddress
              ) {
                  fusionCommand =
                    web3.fsn.consts.TicketLogAddress_Topic_To_Function[topic];
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
              now,
              now,
              transaction.from,
              transaction.to,
              fusionCommand,
              logData,
              JSON.stringify(transaction)
            ];

            query = queryAddTagsForInsert(query, params);

            return conn
              .query(query, params)
              .then(okPacket => {
                // if ( okPacket.affectedRows === 1 ) {
                index += 1;
                logTransaction(transactions, index, resolve, reject);
              })
              .catch(err => {
                if (err.code === "ER_DUP_ENTRY") {
                  // block was already written
                  // normal when we restart scan
                  return true;
                }
                console.log("transaction log error ", err);
                reject( err );
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

  return web3.eth
    .getBlock(lastBlock)
    .then(block => {
      if (block) {
        return logBlock(block).then(ret => {
          return logTransactions(block).then(ret => {
            console.log(lastBlock, block);
            return updateLastBlockProcessed().then( (ret)=> {
              lastBlock += 1;
              setTimeout(() => {
                resumeBlockScan();
              }, 10);
            })
          });
        });
      } else {
        // wait for block to update
        console.log("Waiting for new block..." + new Date());
        setTimeout(() => {
          resumeBlockScan();
        }, 15000);
      }
    })
    .catch(err => {
      console.log("error talking to server, try again ", err);
      setTimeout(() => {
        resumeBlockScan();
      }, 10000);
    });
}
