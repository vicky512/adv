
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.testPage = function(req, res) {
	res.sendfile('views/testPage.html');
}