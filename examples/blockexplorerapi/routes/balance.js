var express = require("express");
var router = express.Router();

var { getConnection } = require("../dbapi/dbapi.js");

/* GET users listing. */
// http://localhost:3000/balance/
// {"sort":"asc","page":"200","size":"50","field":"timestamp"}{"block":"30"}
/*** examples
 * 
 *   http://localhost:3000/blocks/latest
 *   http://localhost:3000/blocks/300
 *
 *   http://localhost:3000/blocks/all?sort=asc&page=2&size=10&field=height
 * 
 *   fields can be:  [ timestamp, hash , numberOfTransactions, height ]
 * 
 */
router.get("/:account", function(req, res, next) {

    // else get one block
    getConnection().then(conn => {
      conn
        .query("select * from currentBalance where _id = ?", [req.params.account])
        .then(rows => {
          res.send(rows)
        })
        .finally(() => {
          conn.release();
        });
    });
})

module.exports = router;
