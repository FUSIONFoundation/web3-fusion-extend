var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fusion API v2' });
});

var counter = 0;
router.get('/heartbeat', function(req, res, next) {
  res.send(  "counter => " + counter++  )
});

router.get('/version', function(req, res, next) {
  res.json(  { version : "2.0.0"} )
});


module.exports = router;
