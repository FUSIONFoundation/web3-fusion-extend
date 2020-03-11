var express = require("express");
var router = express.Router();

var {getConnection} = require("../dbapi/dbapi.js");


router.get("/minerForTicket/:ticketId", function (req, res, next) {
    let ticketId = req.params.ticketId
    getConnection().then(conn => {
        conn
            .query(`SELECT * FROM tickets where commandExtra = ?`, [ticketId])
            .then(rows => {
                if (rows.length === 1) {
                    res.json({
                        miner: rows[0].fromAddress,
                        purchaseBlock: rows[0].height,
                        purchaseTimeStamp: rows[0].timeStamp
                    })
                } else {
                    return res.json(rows)
                }
            })
            .finally(() => {
                conn.release();
            });
    });
    return
})

/* GET transactions listing. */
// http://localhost:3000/blocks/30?sort=asc&page=200&size=50&field=timestamp
// {"sort":"asc","page":"200","size":"50","field":"timestamp"}{"block":"30"}
/*** examples
 *
 *   http://localhost:3000/transactions/latest
 *   http://localhost:3000/transactions/0x346aab726aa05808698ec9aba5da4e4c4574863e87951b5107d3fdabc290bbaa
 *   http://localhost:3000/transactions/all?sort=asc&page=2&size=10&field=height
 *   fields can be:  [ timestamp, hash , type, block , asset ]
 *
 *
 * https://localhost:3000/transactions/all?sort=desc&page=0&size=20&field=height&returnTickets=onlytickets
 *
 */
router.get("/:hash", function (req, res, next) {
    let allowedFields = {
        timestamp: true,
        hash: true,
        type: true,
        block: true,
        height: true,
        asset: true
    };
    let hash = req.params.hash;
    let page = req.query.page || 0;
    let size = req.query.size || 100;
    let returnTickets = req.query.returnTickets || 'all'
    let field = allowedFields[req.query.field] ? req.query.field : 'height'
    let sort = req.query.sort === 'desc' ? 'desc' : 'asc'
    let index = parseInt(req.query.index || -1)

    page = parseInt(page)
    size = parseInt(size)

    if (size > 100 || size < 1 || isNaN(size)) {
        console.log("size ", size)
        size = 100
    }

    if (isNaN(page)) {
        page = 0
    }

    let tickreturns
    let tickreturnsAll

    switch (returnTickets.toLowerCase()) {
        default:
        case 'all':
            tickreturns = `SELECT * FROM transactions
                WHERE fromAddress = '${req.query.address}'
                OR toAddress = '${req.query.address}'
                OR commandExtra3 = '${req.query.address}'`;
            tickreturnsAll = `SELECT * FROM transactions`
            break
        case 'onlytickets':
            tickreturns = `SELECT * FROM tickets WHERE fromAddress = '${req.query.address}'`;
            tickreturnsAll = `SELECT * FROM tickets`
            break
        case 'notickets':
            tickreturns = `SELECT * FROM conTx
                WHERE (fusionCommand IS NOT NULL OR (fusionCommand IS NULL AND data IS NULL))
                AND (toAddress = '${req.query.address}'
                OR fromAddress = '${req.query.address}'
                OR commandExtra3 = '${req.query.address}')`;
            tickreturnsAll = `SELECT * FROM conTx
                WHERE (fusionCommand IS NOT NULL OR (fusionCommand IS NULL AND data IS NULL))`
                break
    }

    if (isNaN(index)) {
        index = -1
    }

    if (field === 'block') {
        field = 'height'
    }

    if (field === 'type') {
        field = 'fusionCommand'
    }

    if (field === 'timestamp') {
        //field = `timestamp  ${sort}, recCreated`
        field = `timestamp `
    }

    if (field === 'height') {
        //field = `height  ${sort}, recCreated`
        field = `height `
    }

    if (hash === 'ts') {
        let tsA = req.query.ts ? req.query.ts.split("-") : []
        getConnection().then(conn => {
            conn
                .query(`SELECT * FROM transactions where hash in (?)`, [tsA])
                .then(rows => {
                    res.json(rows)
                })
                .finally(() => {
                    conn.release();
                });
        });
        return
    }

    if (hash === "all") {
        if (req.query.address) {
            console.log(tickreturns)
            getConnection().then(conn => {
                conn
                    .query(`${tickreturns} order by ${field} ${sort} limit ?,?`, [(index >= 0 ? index : page * size), size])
                    .then(rows => {
                        res.json(rows)
                    })
                    .finally(() => {
                        conn.release();
                    });
            });
        } else {
            console.log(tickreturnsAll)
            getConnection().then(conn => {
                conn
                    .query(`${tickreturnsAll} order by ${field} ${sort} limit ?,?`, [(index >= 0 ? index : page * size), size])
                    .then(rows => {
                        res.json(rows)
                    })
                    .finally(() => {
                        conn.release();
                    });
            });
        }
    } else if (hash === 'latest') {
        if (req.query.address) {
            getConnection().then(conn => {
                conn
                    .query(`${tickreturns} order by height, recCreated desc limit 1`)
                    .then(rows => {
                        res.json(rows)
                    })
                    .finally(() => {
                        conn.release();
                    });
            });
        } else {
            getConnection().then(conn => {
                conn
                    .query(`${tickreturnsAll} order by height, recCreated desc limit 1`)
                    .then(rows => {
                        res.json(rows)
                    })
                    .finally(() => {
                        conn.release();
                    });
            });
        }
    } else {
        // else get one block
        getConnection().then(conn => {
            conn
                .query(`SELECT * FROM transactions WHERE hash = '${hash}'`)
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
