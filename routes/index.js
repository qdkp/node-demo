var express = require('express');
var path = require('path');
var router = express.Router();
var Markdown = require('../lib/markdown');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'hello, world !'});
});

router.get('/doc/*', function(req, res, next) {
  if (req.params[0].length === 0) {
    req.params[0] = 'index.md';
  }

  var markdown = new Markdown(req.params[0], {
    'root': path.join(path.dirname(__dirname), 'docs')
  });

  res.render('docs', { markdown: markdown.render() });
});

module.exports = router;
