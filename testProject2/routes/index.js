var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});


router.get('/summary', function(req, res) {
  res.sendfile('views/testPage.html');
});


module.exports = router;
