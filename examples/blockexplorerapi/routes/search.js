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
router.get("/:searchField", function(req, res, next) {
  if (!req.params.searchField) {
    res.json({});
    return;
  }

  // check if this is an address
  getConnection().then(conn => {
    return conn
      .query("SELECT * FROM currentBalance where _id = ? or _id = CONCAT('0x', ? )", [
        req.params.searchField, req.params.searchField
      ])
      .then(rows => {
        if (rows.length === 0) {
          return conn
            .query("SELECT * FROM transactions where hash = ? or hash  = CONCAT('0x', ? )", [
                req.params.searchField, req.params.searchField
            ])
            .then(rows => {
              if (rows.length === 0) {
                return conn
                .query("SELECT * FROM blocks where hash = ? or hash = CONCAT('0x', ? )or height = ?", [
                  req.params.searchField, req.params.searchField, req.params.searchField
                ])
                .then(rows => {

                  if (rows.length === 0) {
                    res.json({});
                    return;
                  } else {
                    res.json({ block: rows });
                  }
                });
              } else {
                res.json({ transaction: rows });
              }
            });
        } else {
          res.json({ address: rows });
        }
      })
      .finally(() => {
        conn.release();
      });
  });
});

module.exports = router;
