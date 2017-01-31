var fs = require('fs');
var logStream = fs.createWriteStream('result_file.txt', { 'flags': 'a', autoClose: true });
let cheerio = require('cheerio');
let getUrls = require('get-urls');
var articles = require('./jos_content_test.json');


function prepareContent(contentString, delimiter0, delimiter1) {
    var temp_fulltext = '';

    //var fulltextContents = $('<div/>').html(contentString).contents();
    //var $ = cheerio.load(contentString);

    cheerio(contentString).nextAll().each(function(i, value) {
        var content = cheerio(value).text().trim();
        //var content = value.textContent.trim();

        if (content) {
            temp_fulltext += '<p>' + content + '</p>';
        }
    });

    return temp_fulltext;
}

function prepareIntroText(contentString) {
    return cheerio.load(contentString).text();

    //return $('<div/>').html(contentString).text();
}


// var url = getUrls('<param name=\"flashvars\" value=\"xmlurl=http://churchlw.podfm.ru/my/95/data.xml\" />');
// console.log(JSON.stringify(url));
// setTimeout(function() {
//     logStream.write(url);
//     logStream.end();
// }, 0)
// return;



function filterUrl(urls) {

    var result = {};
    result.podfm = [];
    result.mp3 = [];

    Array.from(urls).forEach(function(link, i, arr) {
        var fixMp3Url = link.replace('.mp3%27);', '.mp3');
        var podfmIndex = fixMp3Url.indexOf('churchlw.podfm.ru');
        if (podfmIndex > 0) {

            if (fixMp3Url.indexOf('data.xml') > 0) {
                result.podfm.push(fixMp3Url);
            } else {
                result.mp3.push(fixMp3Url);
            }
        }
    });

    return result;
}

var articleArray = [];

articles.forEach(function(article, i, arr) {
    var newArticle = {};

    newArticle.id = article.id;
    newArticle.title = article.title;
    newArticle.alias = article.alias;
    newArticle.sectionid = article.sectionid;
    newArticle.hits = article.hits;

    newArticle.created = article.created;
    newArticle.created_by = article.created_by;
    newArticle.ordering = article.ordering;
    newArticle.catid = article.catid;
    newArticle.urls = filterUrl(getUrls(article.fulltext));


    var introtext = prepareIntroText(article.introtext);
    var fulltext = prepareContent(article.fulltext);


    newArticle.introtext = introtext;
    newArticle.fulltext = '<p>' + introtext + '</p>' + fulltext;

    articleArray.push(newArticle);

});



console.log(articleArray.length);


logStream.write(JSON.stringify(articleArray));
logStream.end();