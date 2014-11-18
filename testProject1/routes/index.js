
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.testPage = function(req, res) {
	res.sendfile('views/testPage.html');
}

exports.displayUsers = function(req, res){
	// console.log('in displayUsers');
	var db = req.db;
	// console.log(db);
	var collection = db.get('usercollection');
	collection.find({},{}, function(e,docs){
		res.render('displayUsers', {
			'userlist' : docs
		});
	});

}

exports.addNewUser = function(req, res){

	var db = req.db;

	var userName = req.body.username;
	var userEmail = req.body.useremail;

	var collection = db.get('usercollection');

	collection.insert({'username':userName, 'useremail':userEmail},function(err, doc){
		if(err)
			res.send("There was a problem adding the user to the database");
		else
			res.location("display");
			res.redirect("display");
	});


}

exports.newUser = function(req, res){
	res.render('newUser', {title:'Add new user'});
}
