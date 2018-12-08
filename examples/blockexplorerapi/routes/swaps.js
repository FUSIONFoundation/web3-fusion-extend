var express = require("express");
var router = express.Router();

var { getConnection } = require("../dbapi/dbapi.js");

/* GET swaps listing. */
// http://localhost:3000/swaps/
//
/*** examples
 *
 *   http://localhost:3000/swaps/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae
 *   http://localhost:3000/swaps/all?page=0&size=2
 *
 */
router.get("/:swap", function(req, res, next) {
  let page = req.query.page || 0;
  let size = req.query.size || 1;

  page = parseInt(page);
  size = parseInt(size);

  if (size > 100 || size < 1 || isNaN(size)) {
    console.log("size ", size);
    size = 100;
  }

  if (isNaN(page)) {
    page = 0;
  }

  if (req.params.swap === "all") {
    getConnection().then(conn => {
      conn
        .query(`SELECT * FROM fusionblockdb.transactions where fusionCommand = 'MakeSwapFunc' order by timeStamp limit ?,?`, [
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
        .query("select * from transactions where fusionCommand = 'MakeSwapFunc' and commandExtra = ? ", [
          req.params.swap
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
