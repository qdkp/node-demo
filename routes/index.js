var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'hello, world !'});
});

router.get('/user', function(req, res, next) {
  res.send('slack');
});

module.exports = router;
