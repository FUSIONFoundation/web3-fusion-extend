var express = require("express");
var router = express.Router();

var { getConnection } = require("../dbapi/dbapi.js");

/* GET balance listing. */
// http://localhost:3000/balance/
//
/*** examples
 *
 *   http://localhost:3000/balances/0x91db50f5c36ae7616009d4e94462dca4d4c7e833
 *   http://localhost:3000/balances/all?page=0&size=2&sort=desc
 *
 */
router.get("/:hash", function(req, res, next) {
  let allowedFields = {
    san: true,
    assetsHeld: true,
    numberOfTransactions: true,
    fsnBalance: true,
    ticketsWon: true,
    rewardEarn: true,
    address: true
  };
  let hash = req.params.hash;
  let page = req.query.page || 0;
  let size = req.query.size || 100;
  let field = allowedFields[req.query.field] ? req.query.field : "address";
  let sort = req.query.sort === "desc" ? "desc" : "asc";
  let index = parseInt(req.query.index || -1);

  if (field === "address") {
    field = "_id";
  }

  page = parseInt(page);
  size = parseInt(size);

  if (size > 100 || size < 1 || isNaN(size)) {
    console.log("size ", size);
    size = 100;
  }

  if (isNaN(page)) {
    page = 0;
  }

  if (isNaN(index)) {
    index = -1;
  }

  if (hash === "ts") {
    let tsA = req.query.ts ? req.query.ts.split("-") : [];
    for (let i = 0; i < tsA.length; i++) {
      tsA[i] = tsA[i].toLowerCase();
    }
    getConnection().then(conn => {
      conn
        .query(`SELECT * FROM currentBalance where _id in (?)`, [tsA])
        .then(rows => {
          res.json(rows);
        })
        .finally(() => {
          conn.release();
        });
    });
    return;
  }

  if (hash === "all") {
    let str = `SELECT * FROM currentBalance order by ${field} ${sort}, _id ${sort} limit ?,?`;
    getConnection().then(conn => {
      conn
        .query(str, [index >= 0 ? index : page * size, size])
        .then(rows => {
          res.json(rows);
        })
        .finally(() => {
          conn.release();
        });
    });
  } else if (hash === "latest") {
    getConnection().then(conn => {
      conn
        .query("SELECT * FROM currentBalance order by recCreated desc limit 1")
        .then(rows => {
          res.json(rows);
        })
        .finally(() => {
          conn.release();
        });
    });
  } else {
    // else get one block
    hash = hash.toLowerCase();
    getConnection().then(conn => {
      conn
        .query("select * from currentBalance where _id = ? or san = ?", [
          hash,
          hash
        ])
        .then(rows => {
          res.json(rows);
        })
        .finally(() => {
          conn.release();
        });
    });
  }
});

module.exports = router;
