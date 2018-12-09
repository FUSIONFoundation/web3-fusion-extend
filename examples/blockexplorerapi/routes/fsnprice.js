var express = require("express");
var router = express.Router();

var { getConnection } = require("../dbapi/dbapi.js");

/* GET fsnprice listing. */
// http://localhost:3000/fsnprice/
//
/*** examples
 *
 *   http://localhost:3000/fsnprice/?page=0&size=2&sort=asc
 *
 */
router.get("/", function(req, res, next) {
  let page = req.query.page || 0;
  let size = req.query.size || 1;

  let sort = req.query.sort === 'asc' ? 'asc' : 'desc'

  page = parseInt(page);
  size = parseInt(size);

  if (size > 100 || size < 1 || isNaN(size)) {
    console.log("size ", size);
    size = 100;
  }

  if (isNaN(page)) {
    page = 0;
  }


getConnection().then(conn => {
    conn
    .query(`SELECT * FROM priceWatch order by last_updated ${sort}  limit ?,?`, [
        page * size,
        size
    ])
    .then(rows => {
        res.json(rows);
    })
    .finally(() => {
        conn.release();
    });
});
});

module.exports = router;
