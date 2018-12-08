var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Fusion API' });
});

var counter = 0;
router.get('/heartbeat', function(req, res, next) {
  res.send(  "counter => " + counter++  )
});

module.exports = router;
