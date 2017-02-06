var fs = require('fs');

var logStream = fs.createWriteStream('result_file.json' + new Date().toISOString(), { 'flags': 'a', autoClose: true });
var finalResultStream = fs.createWriteStream('final_result_file.json' + new Date().toISOString(), { 'flags': 'a', autoClose: true });


let cheerio = require('cheerio');
let getUrls = require('get-urls');
var articles = require('./jos_content_test.json');
var _ = require('lodash');


var articlesResult = require('./result_file.json');
var users = require('./users_normalize.json');


function prepareContent(contentString, delimiter0, delimiter1) {
    var temp_fulltext = '';

    cheerio(contentString).nextAll().each(function(i, value) {
        var content = cheerio(value).text().trim();
        if (content) {
            temp_fulltext += '<p>' + content + '</p>';
        }
    });

    return temp_fulltext;
}

function prepareIntroText(contentString) {
    return cheerio.load(contentString).text();
}

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


// ------------------------------------------


function StartFirstStep() {
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
}


// ------------------------------------


//Транслитерация кириллицы в URL
function urlRusLat(str) {
    str = str.toLowerCase(); // все в нижний регистр
    var cyr2latChars = new Array(
        ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'], ['ё', 'yo'], ['ж', 'zh'], ['з', 'z'], ['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'], ['м', 'm'], ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'], ['с', 's'], ['т', 't'], ['у', 'u'], ['ф', 'f'], ['х', 'h'], ['ц', 'c'], ['ч', 'ch'], ['ш', 'sh'], ['щ', 'shch'], ['ъ', ''], ['ы', 'y'], ['ь', ''], ['э', 'e'], ['ю', 'yu'], ['я', 'ya'],

        ['А', 'A'], ['Б', 'B'], ['В', 'V'], ['Г', 'G'], ['Д', 'D'], ['Е', 'E'], ['Ё', 'YO'], ['Ж', 'ZH'], ['З', 'Z'], ['И', 'I'], ['Й', 'Y'], ['К', 'K'], ['Л', 'L'], ['М', 'M'], ['Н', 'N'], ['О', 'O'], ['П', 'P'], ['Р', 'R'], ['С', 'S'], ['Т', 'T'], ['У', 'U'], ['Ф', 'F'], ['Х', 'H'], ['Ц', 'C'], ['Ч', 'CH'], ['Ш', 'SH'], ['Щ', 'SHCH'], ['Ъ', ''], ['Ы', 'Y'], ['Ь', ''], ['Э', 'E'], ['Ю', 'YU'], ['Я', 'YA'],

        ['a', 'a'], ['b', 'b'], ['c', 'c'], ['d', 'd'], ['e', 'e'], ['f', 'f'], ['g', 'g'], ['h', 'h'], ['i', 'i'], ['j', 'j'], ['k', 'k'], ['l', 'l'], ['m', 'm'], ['n', 'n'], ['o', 'o'], ['p', 'p'], ['q', 'q'], ['r', 'r'], ['s', 's'], ['t', 't'], ['u', 'u'], ['v', 'v'], ['w', 'w'], ['x', 'x'], ['y', 'y'], ['z', 'z'],

        ['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D'], ['E', 'E'], ['F', 'F'], ['G', 'G'], ['H', 'H'], ['I', 'I'], ['J', 'J'], ['K', 'K'], ['L', 'L'], ['M', 'M'], ['N', 'N'], ['O', 'O'], ['P', 'P'], ['Q', 'Q'], ['R', 'R'], ['S', 'S'], ['T', 'T'], ['U', 'U'], ['V', 'V'], ['W', 'W'], ['X', 'X'], ['Y', 'Y'], ['Z', 'Z'],

        [' ', '_'], ['0', '0'], ['1', '1'], ['2', '2'], ['3', '3'], ['4', '4'], ['5', '5'], ['6', '6'], ['7', '7'], ['8', '8'], ['9', '9'], ['-', '-']

    );

    var newStr = new String();

    for (var i = 0; i < str.length; i++) {

        ch = str.charAt(i);
        var newCh = '';

        for (var j = 0; j < cyr2latChars.length; j++) {
            if (ch == cyr2latChars[j][0]) {
                newCh = cyr2latChars[j][1];

            }
        }
        // Если найдено совпадение, то добавляется соответствие, если нет - пустая строка
        newStr += newCh;

    }
    // Удаляем повторяющие знаки - Именно на них заменяются пробелы.
    // Так же удаляем символы перевода строки, но это наверное уже лишнее
    return newStr.replace(/[_]{2,}/gim, '_').replace(/\n/gim, '');
}

function getRefById(arr, userId) {
    var item = _.find(arr, { old_id: userId });
    return item.__ref;
}

var resultObj = {
    User: [{
        'name.full': 'admin@admin.com',
        email: 'admin@admin.com',
        password: 'admin',
        isAdmin: true,
        photo: {
            filename: 'user_admin.jpg',
            size: 10622,
            mimetype: 'image/jpeg'
        },
        __ref: 'adminuser'
    }],
    Post: []
};


function StartSecondStep() {

    users.forEach(function(user, i, arr) {
        var safeName = urlRusLat(user.name.trim());

        var newUser = {};
        newUser.old_id = user.id;
        newUser['name.full'] = safeName;
        newUser.__ref = safeName;
        newUser.password = '1qaz!QAZ__2wsx@WSX';
        newUser.isAdmin = false;
        newUser.photo = {
            filename: safeName + '.jpg',
            size: 10500,
            mimetype: 'image/jpeg'
        };

        resultObj.User.push(newUser);
    });

    articlesResult.forEach(function(post, i, arr) {

        var newPost = {};
        newPost.name = post.title;
        newPost.state = 'published';
        newPost.author = getRefById(resultObj.User, post.created_by);
        newPost.publishedDate = post.created;
        newPost['content.brief'] = post.introtext;
        newPost['content.extended'] = post.fulltext;
        newPost.categories = [];
        newPost.tags = [];

        resultObj.Post.push(newPost);
    });

    // console.log(resultObj);

    finalResultStream.write(JSON.stringify(resultObj));
    finalResultStream.end();
}


StartSecondStep();









// var url = getUrls('<param name=\"flashvars\" value=\"xmlurl=http://churchlw.podfm.ru/my/95/data.xml\" />');
// console.log(JSON.stringify(url));
// setTimeout(function() {
//     logStream.write(url);
//     logStream.end();
// }, 0)
// return;