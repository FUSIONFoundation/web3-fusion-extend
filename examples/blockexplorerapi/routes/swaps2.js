var express = require("express");
var router = express.Router();

var { getConnection } = require("../dbapi/dbapi.js");

/* GET swaps listing. */
// http://localhost:3000/swaps/
//
/*** examples
 *
 *   http://localhost:3000/swaps2/0xbbd28ab973a7be78af3d8a3c3f1097c87fc020b2bd9270aa292518e8a93c32ae
 *   http://localhost:3000/swaps2/all?page=0&size=2&sort=asc
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
      if ( extra.length > 0 ) {
        extra += " and "
      } else {
        extra = " where "
      }
      extra +=  " fromAddress = ? "
      params.push( req.query.address )
    }
    if ( req.query.fromAsset ) {
      if ( extra.length > 0 ) {
        extra += " and "
      } else {
        extra = " where "
      }
      extra += "  fromAsset = ? "
      params.push( req.query.fromAsset )
    }
    if ( req.query.toAsset ) {
        if ( extra.length > 0 ) {
          extra += " and "
        } else {
          extra = " where "
        }
        extra += "  toAsset = ? "
        params.push( req.query.toAsset )
    }

    getConnection().then(conn => {
      if ( req.query.target ) {
        let s = conn.escape(req.query.target)
        s= s.replace( "'" , "")
        s = s.replace("'", "")
        if ( extra.length > 0 ) {
          extra += " and "
        } else {
          extra = " where "
        }
        extra +=  ` data like '%${s}%' `
      }

      params.push(   page * size )
      params.push(   size )

      let returnData = {};

      conn
        .query(`SELECT * FROM swaps `
         + extra +
                 ` order by recCreated ${sort}  limit ?,?`, params )
        .then(rows => {
          returnData = rows;
        })
        .finally(() => {
          // conn.release();
        })
        conn
            .query(`SELECT COUNT(*) FROM swaps `
                + extra +
                ` order by recCreated ${sort}  limit ?,?`, params )
            .then(rows => {
                returnData[size] = rows;
                res.json(returnData)
            })
            .finally(() => {
                conn.release();
            })
    });
  } else {
    getConnection().then(conn => {
      conn
        .query("select * from swaps where swapID = ? ", [
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
