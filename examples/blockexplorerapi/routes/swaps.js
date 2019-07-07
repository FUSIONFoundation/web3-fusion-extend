var express = require("express");
var router = express.Router();

var { getConnection } = require("../dbapi/dbapi.js");

/* GET swaps listing. */
// http://localhost:3000/swaps/
//
/*** examples
 *
 *   http://localhost:3000/swaps/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae
 *   http://localhost:3000/swaps/all?page=0&size=2&sort=asc
 *
 */
router.get("/:swap", function(req, res, next) {
  let page = req.query.page || 0;
  let size = req.query.size || 1;
  let includeDeleted = req.query.includeDeleted || "false"

  let sort = req.query.sort === 'desc' ? 'desc' : 'asc'

  if ( includeDeleted.toLowerCase() === 'true' ) {
    includeDeleted = true
  } else {
    includeDeleted = false
  }

  page = parseInt(page);
  size = parseInt(size);

  if (size > 30 || size < 1 || isNaN(size)) {
    console.log("size ", size);
    size = 30;
  }

  if (isNaN(page)) {
    page = 0;
  }

  if (req.params.swap === "all") {
    let params = []
    let extra =""
    if ( req.query.address ) {
      extra +=  " and fromAddress = ? "
      params.push( req.query.address )
    }
    if ( req.query.fromAsset ) {
      extra += " and commandExtra2 = ? "
      params.push( req.query.fromAsset )
    }
    if ( req.query.toAsset ) {
        extra += " and commandExtra3 = ? "
        params.push( req.query.toAsset )
    }
     
   extra +=  includeDeleted ? "" :  ` and not exists (SELECT swap FROM deletedSwaps where swap=commandExtra) `

    getConnection().then(conn => {
      if ( req.query.target ) {
        let s = conn.escape(req.query.target)
        s= s.replace( "'" , "")
        s = s.replace("'", "")
        extra +=  ` and data like '%${s}%' `
      }

      params.push(    page * size )
      params.push(   size )

      conn
        .query(`SELECT * FROM transactions where fusionCommand = 'MakeSwapFunc' `
         + extra +
                 ` order by timeStamp ${sort}  limit ?,?`, params )
        .then(rows => {
          res.json(rows);
        })
        .finally(() => {
          conn.release();
        })
    });
  } else {
    getConnection().then(conn => {
      conn
        .query("select * from transactions where fusionCommand = 'MakeSwapFunc'  and commandExtra = ? ", [
          req.params.swap
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
