var express = require("express");
var router = express.Router();

var { getConnection } = require("../dbapi/dbapi.js");

/* GET blocks listing. */
// http://localhost:3000/blocks/30?sort=asc&page=200&size=50&field=timestamp
// {"sort":"asc","page":"200","size":"50","field":"timestamp"}{"block":"30"}
/*** examples
 * 
 *   http://localhost:3000/blocks/latest
 *   http://localhost:3000/blocks/300
 *   http://localhost:3000/blocks/range?to=10&from=100
 *
 *   http://localhost:3000/blocks/all?sort=asc&page=2&size=10&field=height&sort=desc
 * 
 *   fields can be:  [ timestamp, hash , numberOfTransactions, height ]
 * 
 */
router.get("/:block", function(req, res, next) {
  let allowedFields = {
    timestamp: true,
    hash: true,
    numberOfTransactions: true,
    height: true,
    miner : true,
  };
  let blockNumber = req.params.block;
  let page =  req.query.page || 0;
  let size = req.query.size || 1;
  let field = allowedFields[req.query.field] ? req.query.field : 'height'
  let sort = req.query.sort === 'desc' ? 'desc' : 'asc'
  let to =  parseInt( req.query.to || 0 )
  let from = parseInt( req.query.from || 20 )
  let index = parseInt( req.query.index || -1 )

  if ( isNaN(to ) ) {
    to = 0
  }

  if ( isNaN(from) ) {
    from = 20
  }

  if ( from - to > 50 ) {
    from = to + 50
  }

  if ( isNaN(index) ) {
    index = -1
  }

  page = parseInt( page )
  size = parseInt( size )

  if ( size > 100 || size < 1  || isNaN(size) ) {
    console.log( "size " , size )
    size = 100
  }

  if ( isNaN(page) ) {
    page = 0
  }

  if (blockNumber === "all") {
    getConnection().then(conn => {
      conn
        .query(`SELECT * FROM blocks order by ${field} ${sort}  limit ?,?` , [ (index >= 0 ? index : page*size), size ] )
        .then(rows => {
          res.json(rows)
        })
        .finally(() => {
          conn.release();
        });
    });
  } else if ( blockNumber === 'latest') {
    getConnection().then(conn => {
      conn
        .query("SELECT * FROM blocks order by height desc limit 1" )
        .then(rows => {
          res.json(rows)
        })
        .finally(() => {
          conn.release();
        });
    });
  } else  if (blockNumber === "range") {
    getConnection().then(conn => {
      conn
        .query(`SELECT * FROM blocks where height >= ? and height <= ? order by height` , [ to, from  ] )
        .then(rows => {
          res.json(rows)
        })
        .finally(() => {
          conn.release();
        });
    });
  } else {
    // else get one block
    getConnection().then(conn => {
      conn
        .query("select * from blocks where height = ? or hash=?", [parseInt(blockNumber),blockNumber])
        .then(rows => {
          res.json(rows)
        })
        .finally(() => {
          conn.release();
        });
    });
  }
});

module.exports = router;
