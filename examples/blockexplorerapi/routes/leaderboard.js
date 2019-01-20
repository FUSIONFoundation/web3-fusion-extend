var express = require("express");
var router = express.Router();

var { getConnection } = require("../dbapi/dbapi.js");

/* http://host/leaderboard
*/
router.get("/", function(req, res, next) {
  getConnection().then(conn => {
    conn
      .query(
        `Begin;
    SELECT count(miner), miner
    FROM blocks where FROM_UNIXTIME(timeStamp) >= DATE_SUB(NOW(),INTERVAL 1 YEAR)
    GROUP BY miner
    ORDER BY count(miner) desc limit 10;
    
    SELECT count(miner), miner
    FROM blocks where  YEAR(FROM_UNIXTIME(timeStamp)) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH)
    AND MONTH(FROM_UNIXTIME(timeStamp)) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH)
    GROUP BY miner
    ORDER BY count(miner) desc limit 10;
    
    SELECT count(miner), miner
    FROM blocks where  YEAR(FROM_UNIXTIME(timeStamp)) = YEAR(CURRENT_DATE()) AND 
          MONTH(FROM_UNIXTIME(timeStamp)) = MONTH(CURRENT_DATE())
    GROUP BY miner
    ORDER BY count(miner) desc limit 10;
           Commit;`,
      )
      .then(rows => {
        if (rows.length === 5) {
          //debugger
          return res.json({
            lastYear: JSON.parse(JSON.stringify(rows[1])),
            lastMonth: JSON.parse(JSON.stringify(rows[2])),
            thisMonth: JSON.parse(JSON.stringify(rows[3])),
          });
        }
        res.json(rows);
      })
      .finally(() => {
        conn.release();
      });
  });
});

module.exports = router;