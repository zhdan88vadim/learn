var fs = require('fs');
var cheerio = require('cheerio')
var request = require('request');

//request = request.defaults({ jar: true });
//var request = request.defaults({ 'proxy': 'http://127.0.0.1:8888' });

const USERNAME = 'zhdan88vadim';
const PASSWORD = 'wsxWSXqaz!RT34vTD';
const USER_AGENT_STRING = 'Mozilla/5.0 (Windows NT 6.1)';

//  When user is login the cookies don't changes.

// !! Warning !! HTTP connections

const SITE_URL = 'http://podfm.ru';
const LOGIN_URL = SITE_URL + '/login/';
const UPLOAD_URL = 'http://' + USERNAME + '.podfm.ru/actionuploadpodfile/';
const PUBLISH_URL = 'http://' + USERNAME + '.podfm.ru/actionpodcastadd/';
const LOAD_URL = 'http://' + USERNAME + '.podfm.ru/';


function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getFileNamePodcast(cookies, url) {

    var loadArgs = {
        url: url,
        headers: {
            'User-Agent': USER_AGENT_STRING,
            'Cookie': cookies.join('; ')
        }
    }

    return new Promise((resolve, reject) => {
        request.get(loadArgs, (error, response, body) => {
            if (!error && response.statusCode === 200) {

                var $ = cheerio.load(body);
                var fileUrl = $('a.box_download').attr('href');

                resolve(fileUrl);
            } else {
                reject(response.statusCode + " through getFileNamePodcast()");
            }
        });
    });
}

function publish(cookies, fileId, data) {

    var date = new Date();

    var uploadArgs = {
        url: PUBLISH_URL,
        headers: {
            'User-Agent': USER_AGENT_STRING,
            'Cookie': cookies.join('; ')
        },
        formData: {
            'id': '',
            'todo': 'save',
            'file_id': fileId,
            'make_slide': 'off',
            'write_tags': 1,
            'day': date.getDate(),
            'month': date.getMonth() + 1,
            'year': date.getFullYear(),
            'hour': date.getHours(),
            'min': date.getMinutes(),
            'number': data.number,
            'name': data.name,
            'short_descr': data.short_descr,
            'body': data.body,
            'format': '',
            'text_descr': data.text_descr,
            'image': '',
            'image_alt': '',
            'lent_id': 62977,
            'cat_id': 2,
            'cat_id_2': 0,
            'cat_id_3': 0
        }
    }

    return new Promise((resolve, reject) => {

        request.post(uploadArgs, (error, response, body) => {

            if (!error) {
                var location = response.headers['location'];
                resolve(location);
            } else {
                reject(response.statusCode + " through publish()");
            }
        });
    });
}

function upload(cookies, localFileName) {

    var uploadArgs = {
        url: UPLOAD_URL,
        headers: {
            'User-Agent': USER_AGENT_STRING,
            'Content-Type': 'multipart/form-data',
            'Cookie': cookies.join('; ')
        },
        formData: {
            'todo': 'step1_upload',
            'pod_id': '',
            'file': fs.createReadStream(localFileName)
        }
    }

    return new Promise((resolve, reject) => {

        request.post(uploadArgs, (error, response, body) => {

            if (!error) {
                var location = response.headers['location'];
                var fileId = getParameterByName('file_id', location);

                if (!fileId) {
                    reject('upload error');
                }
                resolve(fileId);
            } else {
                reject(response.statusCode + " through upload()");
            }
        });
    });
};


function login(username, password) {
    var cookies = null;

    return new Promise((resolve, reject) => {

        request.get(SITE_URL,
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    cookies = response.headers['set-cookie'];

                    var loginArgs = {
                        url: LOGIN_URL,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Cookie': cookies.join('; ')
                        },
                        form: {
                            'a_todo': 'login_check',
                            'login': username,
                            'password': password,
                            'todo': 'login'
                        }
                    };

                    request.post(loginArgs,
                        (error, response, body) => {
                            if (!error) {
                                if (response.headers['location'] === '/loginform/') {
                                    reject('login error');
                                }

                                //cookies[0] = response.headers['set-cookie'][0];
                                //resolve(cookies);

                                resolve(response.headers['set-cookie']);
                            } else {
                                reject(response.statusCode + " through login()");
                            }
                        });
                } else {
                    reject(response.statusCode + " through login()");
                }
            });
    });
}



var localFileName = __dirname + '/Sound.mp3';

var podcastPublishData = {
    'number': 'my user number',
    'name': 'my user name',
    'short_descr': 'my user short description',
    'body': 'my user body',
    'text_descr': 'my user text descr',
}

// https://nodejs.org/api/fs.html#fs_fs_access_path_mode_callback



fs.access(localFileName, fs.constants.R_OK, function(err) {

    if (err) {
        if (err.code === "ENOENT") {
            console.error('sound file is not exists');
            return;
        } else {
            throw err;
        }
    }


    // my code

    login(USERNAME, PASSWORD)
        .then(cookies => {

            upload(cookies, localFileName).then(fileId => publish(cookies, fileId, podcastPublishData).then(podcastPage => {

                console.log('podcast page: ' + podcastPage);

                getFileNamePodcast(cookies, podcastPage).then(mp3FileUrl => {
                    console.log('File successful uploaded.');
                    console.log('mp3FileUrl: ' + mp3FileUrl);
                }).catch(err => {
                    console.error(err);
                });
            }));
        })
        .catch(err => {
            console.error(err);
        });

});














// original source for upload file to PodFm service
// https://github.com/zhdan88vadim/PodFM.ru/blob/master/podfm.py


// parsing html
// http://stackoverflow.com/questions/7977945/html-parser-on-node-js


// upload
// https://github.com/request/request#multipartform-data-multipart-form-uploads
// http://stackoverflow.com/questions/19818918/nodejs-sending-uploading-a-local-file-to-a-remote-server
// http://stackoverflow.com/questions/25344879/uploading-file-using-post-request-in-node-js


// https://github.com/request/request#multipartform-data-multipart-form-uploads

// custom_file: {
//     value: fs.createReadStream(__dirname + '/Sound.mp3'),
//     filename: 'Sound.mp3',
//     //contentType: '' 
// }


// ---



// Content-Disposition: form-data; name="id"	
// Content-Disposition: form-data; name="todo"	save
// Content-Disposition: form-data; name="file_id"	496150
// Content-Disposition: form-data; name="make_slide"	off
// Content-Disposition: form-data; name="write_tags"	1
// Content-Disposition: form-data; name="day"	17
// Content-Disposition: form-data; name="month"	11
// Content-Disposition: form-data; name="year"	2016
// Content-Disposition: form-data; name="hour"	14
// Content-Disposition: form-data; name="min"	44
// Content-Disposition: form-data; name="number"	this is my text
// Content-Disposition: form-data; name="name"	this is my text
// Content-Disposition: form-data; name="short_descr"	this is my text
// Content-Disposition: form-data; name="body"	this is my text
// Content-Disposition: form-data; name="format"	1
// Content-Disposition: form-data; name="text_descr"	
// Content-Disposition: form-data; name="image"; filename=""
// Content-Type: application/octet-stream	
// Content-Disposition: form-data; name="image_alt"	
// Content-Disposition: form-data; name="lent_id"	62977
// Content-Disposition: form-data; name="cat_id"	2
// Content-Disposition: form-data; name="cat_id_2"	0
// Content-Disposition: form-data; name="cat_id_3"	0





// ------------------------




//     ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="id"


// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="todo"

// save
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="file_id"

// 496150
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="make_slide"

// off
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="write_tags"

// 1
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="day"

// 17
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="month"

// 11
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="year"

// 2016
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="hour"

// 14
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="min"

// 44
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="number"

// this is my text
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="name"

// this is my text
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="short_descr"

// this is my text
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="body"

// this is my text
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="format"

// 1
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="text_descr"


// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="image"; filename=""
// Content-Type: application/octet-stream


// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="image_alt"


// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="lent_id"

// 62977
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="cat_id"

// 2
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="cat_id_2"

// 0
// ------WebKitFormBoundary82glj9pNVBLwlrG3
// Content-Disposition: form-data; name="cat_id_3"

// 0
// ------WebKitFormBoundary82glj9pNVBLwlrG3--