// https://github.com/bda-research/node-crawler

var Crawler = require("crawler");

var c = new Crawler({
    rateLimit: 1000,
    maxConnections: 4,

    // This will be called for each crawled page
    callback: function(error, res, done) {
        if (error) {
            console.log(error);
        } else {
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server

            let dataItem = {};
            dataItem.title = null;
            dataItem.phones = [];
            dataItem.userURL = null;

            dataItem.title = $("title").text();
            dataItem.userURL = $($('a[href^="https://profile.onliner.by/user/"]')[0]).attr('href');

            $(".apartment-info__list_phones li").each(function(i, elem) {
                dataItem.phones.push($(this).text());
            });

            console.log(dataItem);

        }
        done();
    }
});


c.queue(['https://r.onliner.by/ak/apartments/209357', 'https://r.onliner.by/ak/apartments/233666']);



// // Queue a list of URLs
// c.queue(['http://www.google.com/','http://www.yahoo.com']);

// // Queue URLs with custom callbacks & parameters
// c.queue([{
//     uri: 'http://parishackers.org/',
//     jQuery: false,

//     // The global callback won't be called
//     callback: function (error, res, done) {
//         if(error){
//             console.log(error);
//         }else{
//             console.log('Grabbed', res.body.length, 'bytes');
//         }
//         done();
//     }
// }]);

// Queue some HTML code directly without grabbing (mostly for tests)
// c.queue([{
//     html: '<p>This is a <strong>test</strong></p>'
// }]);