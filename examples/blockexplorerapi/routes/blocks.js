var express = require("express");
var router = express.Router();

var { getConnection } = require("../dbapi/dbapi.js");

/* GET users listing. */
// http://localhost:3000/blocks/30?sort=asc&page=200&size=50&field=timestamp
// {"sort":"asc","page":"200","size":"50","field":"timestamp"}{"block":"30"}
router.get("/:block", function(req, res, next) {
  let allowedFields = {
    timestamp: true,
    hash: true,
    numberOfTransactions: true,
    block: true
  };
  let blockNumber = req.params.block;
  let page = req.query.page || 0;
  let size = req.query.size || 25;
  let field = allowedFields[req.query.field];

  if (blockNumber === "all") {
  } else {
    // else get one block
    getConnection().then(conn => {
      conn
        .query("select * from blocks where height = ?", [parseInt(blockNumber)])
        .then(rows => {
          console.log( blockNumber)
          console.log( rows )
          res.send(rows)
        })
        .finally(() => {
          conn.release();
        });
    });
  }
});

module.exports = router;
