var fs = require('fs');
//var request = require('superagent');


var logStream = fs.createWriteStream('result_file.json', { 'flags': 'a', autoClose: true });
var finalResultStream = fs.createWriteStream('final_result_file.json', { 'flags': 'a', autoClose: true });
var allMp3Stream = fs.createWriteStream('allmp3_result_file.json', { 'flags': 'a', autoClose: true });

var allPodfmWithoutMP3Stream = fs.createWriteStream('allPodfmWithoutMP3Urlsresult_file.json', { 'flags': 'a', autoClose: true });


let cheerio = require('cheerio');
let getUrls = require('get-urls');
var articles = require('./jos_content_test.json');
var _ = require('lodash');


var articlesResult = require('./result_file.json');
var users = require('./users_normalize.json');
//var sections = require('./jos_sections.json');



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

function normalizeData(data) {

    data.User.forEach(function(user, i, arr) {
        delete user.old_id;
    });

    return data;
}

var resultObj = {
    PostCategory: [{
        "title": "Проповеди",
        "name": "sermons",
        "__ref": "sermons"
    }, {
        "title": "Материалы",
        "name": "materials",
        "__ref": "materials"
    }, {
        "title": "Свидетельства",
        "name": "testimonies",
        "__ref": "testimonies"
    }, {
        "title": "Новости",
        "name": "news",
        "__ref": "news"
    }, {
        "title": "Служения",
        "name": "service",
        "__ref": "service"
    }, {
        showOnPage: false,
        "title": "Добро пожаловать",
        "name": "welcome",
        "__ref": "welcome"
    }],

    Tag: [{
        name: 'Исцеление',
        __ref: 'iscelenie'
    }, {
        name: 'Работа',
        __ref: 'rabota'
    }, {
        name: 'Деньги',
        __ref: 'dengi'
    }, {
        name: 'Семья',
        __ref: 'semya'
    }, {
        name: 'Служение',
        __ref: 'sluzhenie'
    }, {
        name: 'Работа над собой',
        __ref: 'rabota_nad_soboi'
    }, {
        name: 'Призвание',
        __ref: 'prizvanie'
    }, {
        name: 'Борьба',
        __ref: 'borba'
    }, {
        name: 'Здоровье',
        __ref: 'zdorovie'
    }, {
        name: 'Упорство',
        __ref: 'uporstvo'
    }, {
        name: 'Любовь',
        __ref: 'lubovi'
    }, {
        name: 'Молитва',
        __ref: 'molitva'
    }],
    User: [{
        showOnPage: false,
        'name.full': 'admin@admin.com',
        email: 'admin@admin.com',
        password: 'admin',
        isAdmin: false,
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
        newUser['name.full'] = user.name.trim();
        newUser.__ref = safeName;
        newUser.password = '1qaz!QAZ__2wsx@WSX' + safeName;
        newUser.isAdmin = false;
        newUser.email = safeName.replace('_', '') + '@' + safeName.replace('_', '') + '.com';
        newUser.photo = {
            filename: safeName + '.jpg',
            size: 10500,
            mimetype: 'image/jpeg'
        };

        resultObj.User.push(newUser);
    });

    function getCategoryRevById(id) {

        // "sectionid": 10 = 12  "Свидетельства"
        // "sectionid": 11 = 1 "Библия "
        // "sectionid": 12 = 4  "Бюллетень"
        // "sectionid": 14 = 6 "Служения",
        // "sectionid": 15 = 80 "Новости",
        // "sectionid": 16 = 274 "Проповедь"
        // "sectionid": 18 = 1    "Прайс",

        var ref = null;

        switch (id) {
            case 10:
                ref = 'testimonies';
                break;
            case 12:
                ref = 'welcome';
                break;
            case 14:
                ref = 'service';
                break;
            case 15:
                ref = 'news';
                break;
            case 16:
                ref = 'sermons';
                break;
        }

        return ref;
    }

    var allMp3Urls = [];
    var allPodfmWithoutMP3Urls = [];

    articlesResult.forEach(function(post, i, arr) {

        var newPost = {};
        newPost.name = post.title;
        newPost.state = 'published';
        newPost.author = getRefById(resultObj.User, post.created_by);
        newPost.publishedDate = post.created;
        newPost['content.brief'] = post.introtext;
        newPost['content.extended'] = post.fulltext;
        newPost.hits = post.hits || 0;
        //newPost.categories = [];
        newPost.categories = getCategoryRevById(post.sectionid);
        newPost.tags = [];

        newPost.urlsPodfm = post.urls.podfm;
        newPost.urls = post.urls.mp3;

        allMp3Urls = allMp3Urls.concat(post.urls.mp3);

        if (post.urls.mp3.length !== post.urls.podfm.length) {
            allPodfmWithoutMP3Urls = allPodfmWithoutMP3Urls.concat(post.urls.podfm);
        }
        if (newPost.categories) {
            resultObj.Post.push(newPost);
        }
    });

    // console.log(resultObj);

    normalizeData(resultObj);

    //finalResultStream.write(JSON.stringify(resultObj));
    //finalResultStream.end();

    //allMp3Stream.write(JSON.stringify(allMp3Urls));
    //allMp3Stream.end();


    allPodfmWithoutMP3Stream.write(JSON.stringify(allPodfmWithoutMP3Urls));
    allPodfmWithoutMP3Stream.end();
}


// StartSecondStep();




















var podfmUrls = ["http://churchlw.podfm.ru/my/2/data.xml", "http://churchlw.podfm.ru/my/3/data.xml", "http://churchlw.podfm.ru/my/4/data.xml", "http://churchlw.podfm.ru/my/1/data.xml", "http://churchlw.podfm.ru/my/5/data.xml", "http://churchlw.podfm.ru/my/6/data.xml", "http://churchlw.podfm.ru/my/7/data.xml", "http://churchlw.podfm.ru/my/8/data.xml", "http://churchlw.podfm.ru/my/9/data.xml", "http://churchlw.podfm.ru/my/10/data.xml", "http://churchlw.podfm.ru/my/12/data.xml", "http://churchlw.podfm.ru/my/13/data.xml", "http://churchlw.podfm.ru/my/14/data.xml", "http://churchlw.podfm.ru/my/15/data.xml", "http://churchlw.podfm.ru/my/16/data.xml", "http://churchlw.podfm.ru/my/17/data.xml", "http://churchlw.podfm.ru/my/18/data.xml", "http://churchlw.podfm.ru/my/19/data.xml", "http://churchlw.podfm.ru/my/20/data.xml", "http://churchlw.podfm.ru/my/21/data.xml", "http://churchlw.podfm.ru/my/22/data.xml", "http://churchlw.podfm.ru/my/24/data.xml", "http://churchlw.podfm.ru/my/25/data.xml", "http://churchlw.podfm.ru/my/26/data.xml", "http://churchlw.podfm.ru/my/27/data.xml", "http://churchlw.podfm.ru/my/28/data.xml", "http://churchlw.podfm.ru/my/29/data.xml", "http://churchlw.podfm.ru/my/30/data.xml", "http://churchlw.podfm.ru/my/31/data.xml", "http://churchlw.podfm.ru/my/32/data.xml", "http://churchlw.podfm.ru/my/33/data.xml", "http://churchlw.podfm.ru/my/34/data.xml", "http://churchlw.podfm.ru/my/35/data.xml", "http://churchlw.podfm.ru/my/36/data.xml", "http://churchlw.podfm.ru/my/38/data.xml", "http://churchlw.podfm.ru/my/37/data.xml", "http://churchlw.podfm.ru/my/39/data.xml", "http://churchlw.podfm.ru/my/40/data.xml", "http://churchlw.podfm.ru/my/41/data.xml", "http://churchlw.podfm.ru/my/42/data.xml", "http://churchlw.podfm.ru/my/43/data.xml", "http://churchlw.podfm.ru/my/44/data.xml", "http://churchlw.podfm.ru/my/45/data.xml", "http://churchlw.podfm.ru/my/46/data.xml", "http://churchlw.podfm.ru/my/47/data.xml", "http://churchlw.podfm.ru/my/48/data.xml", "http://churchlw.podfm.ru/my/49/data.xml", "http://churchlw.podfm.ru/my/50/data.xml", "http://churchlw.podfm.ru/my/51/data.xml", "http://churchlw.podfm.ru/my/52/data.xml", "http://churchlw.podfm.ru/my/53/data.xml", "http://churchlw.podfm.ru/my/55/data.xml", "http://churchlw.podfm.ru/my/56/data.xml", "http://churchlw.podfm.ru/my/57/data.xml", "http://churchlw.podfm.ru/my/58/data.xml", "http://churchlw.podfm.ru/my/59/data.xml", "http://churchlw.podfm.ru/my/60/data.xml", "http://churchlw.podfm.ru/my/61/data.xml", "http://churchlw.podfm.ru/my/62/data.xml", "http://churchlw.podfm.ru/my/63/data.xml", "http://churchlw.podfm.ru/my/64/data.xml", "http://churchlw.podfm.ru/my/65/data.xml", "http://churchlw.podfm.ru/my/66/data.xml", "http://churchlw.podfm.ru/my/67/data.xml", "http://churchlw.podfm.ru/my/68/data.xml", "http://churchlw.podfm.ru/my/69/data.xml", "http://churchlw.podfm.ru/my/70/data.xml", "http://churchlw.podfm.ru/my/71/data.xml", "http://churchlw.podfm.ru/my/72/data.xml", "http://churchlw.podfm.ru/my/73/data.xml", "http://churchlw.podfm.ru/my/74/data.xml", "http://churchlw.podfm.ru/my/75/data.xml", "http://churchlw.podfm.ru/my/76/data.xml", "http://churchlw.podfm.ru/my/77/data.xml", "http://churchlw.podfm.ru/my/78/data.xml", "http://churchlw.podfm.ru/my/79/data.xml", "http://churchlw.podfm.ru/my/80/data.xml", "http://churchlw.podfm.ru/my/81/data.xml", "http://churchlw.podfm.ru/my/82/data.xml", "http://churchlw.podfm.ru/my/83/data.xml", "http://churchlw.podfm.ru/my/84/data.xml", "http://churchlw.podfm.ru/my/85/data.xml", "http://churchlw.podfm.ru/my/86/data.xml", "http://churchlw.podfm.ru/my/87/data.xml", "http://churchlw.podfm.ru/my/88/data.xml", "http://churchlw.podfm.ru/my/89/data.xml", "http://churchlw.podfm.ru/my/91/data.xml", "http://churchlw.podfm.ru/my/92/data.xml", "http://churchlw.podfm.ru/my/93/data.xml", "http://churchlw.podfm.ru/my/94/data.xml", "http://churchlw.podfm.ru/my/95/data.xml", "http://churchlw.podfm.ru/my/96/data.xml", "http://churchlw.podfm.ru/my/97/data.xml", "http://churchlw.podfm.ru/my/98/data.xml", "http://churchlw.podfm.ru/my/99/data.xml", "http://churchlw.podfm.ru/my/100/data.xml", "http://churchlw.podfm.ru/my/101/data.xml", "http://churchlw.podfm.ru/my/102/data.xml", "http://churchlw.podfm.ru/my/103/data.xml", "http://churchlw.podfm.ru/my/104/data.xml", "http://churchlw.podfm.ru/my/105/data.xml", "http://churchlw.podfm.ru/my/106/data.xml", "http://churchlw.podfm.ru/my/107/data.xml", "http://churchlw.podfm.ru/my/108/data.xml", "http://churchlw.podfm.ru/my/110/data.xml", "http://churchlw.podfm.ru/my/109/data.xml", "http://churchlw.podfm.ru/my/111/data.xml", "http://churchlw.podfm.ru/my/112/data.xml", "http://churchlw.podfm.ru/my/113/data.xml", "http://churchlw.podfm.ru/my/114/data.xml", "http://churchlw.podfm.ru/my/115/data.xml", "http://churchlw.podfm.ru/my/116/data.xml", "http://churchlw.podfm.ru/my/117/data.xml", "http://churchlw.podfm.ru/my/118/data.xml", "http://churchlw.podfm.ru/my/119/data.xml", "http://churchlw.podfm.ru/my/120/data.xml", "http://churchlw.podfm.ru/my/121/data.xml", "http://churchlw.podfm.ru/my/122/data.xml", "http://churchlw.podfm.ru/my/123/data.xml", "http://churchlw.podfm.ru/my/126/data.xml", "http://churchlw.podfm.ru/my/124/data.xml", "http://churchlw.podfm.ru/my/128/data.xml", "http://churchlw.podfm.ru/my/127/data.xml", "http://churchlw.podfm.ru/my/129/data.xml", "http://churchlw.podfm.ru/my/130/data.xml", "http://churchlw.podfm.ru/my/131/data.xml", "http://churchlw.podfm.ru/my/132/data.xml", "http://churchlw.podfm.ru/my/133/data.xml", "http://churchlw.podfm.ru/my/134/data.xml", "http://churchlw.podfm.ru/my/135/data.xml", "http://churchlw.podfm.ru/my/136/data.xml", "http://churchlw.podfm.ru/my/137/data.xml", "http://churchlw.podfm.ru/my/138/data.xml", "http://churchlw.podfm.ru/my/139/data.xml", "http://churchlw.podfm.ru/my/140/data.xml", "http://churchlw.podfm.ru/my/142/data.xml", "http://churchlw.podfm.ru/my/143/data.xml", "http://churchlw.podfm.ru/my/144/data.xml", "http://churchlw.podfm.ru/my/145/data.xml", "http://churchlw.podfm.ru/my/146/data.xml", "http://churchlw.podfm.ru/my/147/data.xml", "http://churchlw.podfm.ru/my/228/data.xml", "http://churchlw.podfm.ru/my/229/data.xml", "http://churchlw.podfm.ru/my/230/data.xml", "http://churchlw.podfm.ru/my/230/data.xml"]


var podfmDetail = [];

const async = require('async');
const request = require('request');
const parseString = require('xml2js').parseString;

function httpGet(url, callback) {
    const options = {
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    };

    console.log('run');

    request(options,
        function(err, res, body) {
            if (err) return callback(err, body);

            parseString(body, function(err, result) {

                if (!err && result.file) {
                    var item = {};
                    item.originalUrl = url;
                    item.data = result.file.$;
                    podfmDetail.push(item);
                } else {
                    console.log('An error occuard!', url, body, result);
                }

                callback(err, body);
            });
        }
    );
}

//podfmUrls.slice(1, 3)



async.mapSeries(podfmUrls, httpGet, function(err, res) {
    if (err) return console.log(err);

    console.log(JSON.stringify(podfmDetail));

});




// <file pod="http://churchlw.podfm.ru/my/79/" url="http://churchlw.podfm.ru/my/79/file/podfm_churchlw_my_79.mp3?action=listen&" download_url="http://churchlw.podfm.ru/my/79/file/podfm_churchlw_my_79.mp3&" bitrate="56" duration="3612768" size="25290528" downloads="31" strParams="15,50per,99per"></file>





// var url = getUrls('<param name=\"flashvars\" value=\"xmlurl=http://churchlw.podfm.ru/my/95/data.xml\" />');
// console.log(JSON.stringify(url));
// setTimeout(function() {
//     logStream.write(url);
//     logStream.end();
// }, 0)
// return;