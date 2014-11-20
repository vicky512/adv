var express = require('express');
var router = express.Router();

router.get('/unmatchedRecords/:name/:date', function(req, res) {
  var db = req.db;
  var sourceName = req.params.name;
  var sourceDate = req.params.date;
  db.collection('unmatchedLog').find({'sourceFileName':sourceName, 'sourceGeneratedDate':sourceDate}).toArray(function(err, items){
  	res.json(items);
  });
});

router.post('/addUnmatchedRecords', function(req, res){
	var db = req.db;
	db.collection('unmatchedLog').insert(req.body, function(err, result){
		res.send(
			(err === null) ? {msg:''} : {msg: err}
		);
	});
});

router.delete('/deleteUnmatchedRecords/:id', function(req, res){
	var db = req.db;
	var unmatchedItemToDelete = req.params.id;
	db.collection('unmatchedLog').removeById(unmatchedItemToDelete, function(err, result){
		res.send((result === 1)? {msg:''}:{msg:err});
	});
});



module.exports = router;
