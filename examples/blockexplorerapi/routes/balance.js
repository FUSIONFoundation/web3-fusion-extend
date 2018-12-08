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
router.get("/:account", function(req, res, next) {
  let page = req.query.page || 0;
  let size = req.query.size || 1;
  let sort = req.query.sort === 'desc' ? 'desc' : 'asc'

  page = parseInt(page);
  size = parseInt(size);

  if (size > 100 || size < 1 || isNaN(size)) {
    console.log("size ", size);
    size = 100;
  }

  if (isNaN(page)) {
    page = 0;
  }

  if (req.params.account === "all") {
    getConnection().then(conn => {
      conn
        .query(`SELECT * FROM fusionblockdb.currentBalance order by _id ${sort} limit ?,?`, [
          page * size,
          size
        ])
        .then(rows => {
          res.send(rows);
        })
        .finally(() => {
          conn.release();
        });
    });
  } else {
    getConnection().then(conn => {
      conn
        .query("select * from currentBalance where _id = ?", [
          req.params.account
        ])
        .then(rows => {
          res.send(rows);
        })
        .finally(() => {
          conn.release();
        });
    });
  }
});

module.exports = router;
