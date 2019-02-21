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
    .query(`Begin;
           SELECT * FROM priceWatch order by last_updated ${sort}  limit ?,?;
           Select "TotalTransactions", transactionCount from info where _id ="INFO_ID";
           Select "TotalAddresses", count(*) from currentBalance;
           Select "TotalAssets", count(*) from transactions where fusioncommand='GenAssetFunc';
           select "LastBlock", MAX(height) from blocks;
           SELECT * FROM blocks order by timestamp desc  limit 0,2;
           Commit;`
           , [
        page * size,
        size
    ])
    .then(rows => {
        if ( rows.length === 8 ) {
            return res.json( {
                priceInfo : JSON.parse( JSON.stringify( rows[1][0] ) ) ,
                totalTransactions :  JSON.parse( JSON.stringify( rows[2][0]['transactionCount'])),
                totalAddresses :  JSON.parse( JSON.stringify( rows[3][0]['count(*)'])),
                totalAssets :  JSON.parse( JSON.stringify( rows[4][0]['count(*)'])),
                maxBlock :  JSON.parse( JSON.stringify( rows[5][0]['MAX(height)'] )),
                lastTwoBlocks :  JSON.parse( JSON.stringify( rows[6] )) 
             } )
        }
        res.json(rows);
    })
    .finally(() => {
        conn.release();
    });
});
});

module.exports = router;
