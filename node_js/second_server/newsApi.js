var exports = module.exports = {};
var News = require('./models/news');

exports.init = function(app) {

    app.get('/api/news/test', function(req, res) {
        res.json({ message: 'my test message', status: 200 });
    });

    app.post('/api/news', function(req, res) {
        var news = new News();
        news.name = req.body.name;
        news.type = req.body.type;
        news.pages = req.body.pages;


        news.save(function(err) {
            if (err)
                res.send(err);

            res.json({
                message: 'News added to the db',
                data: news
            });
        });
    });

    app.get('/api/news', function(req, res) {
        News.find(function(err, news) {
            if (err)
                res.send(err);
            res.json(news);
        });
    });

    app.get('/api/news/:news_id', function(req, res) {
        News.findById(req.params.news_id, function(err, news) {

            if (err)
                res.send(err);
            res.json(news);

        });
    });

    app.put('/api/news/:news_id', function(req, res) {
        News.findById(req.params.news_id, function(err, news) {
            if (err)
                res.send(err);

            news.name = req.body.name;

            news.save(function() {
                if (err)
                    res.send(err);

                res.json(news);
            });


        });
    });

    app.delete('/api/news/:news_id', function(req, res) {
        News.findByIdAndRemove(req.params.news_id, function() {
            if (err)
                res.send(err);
            res.json({ message: 'News has been removed from the list' });
        });
    });

}