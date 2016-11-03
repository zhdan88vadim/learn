// https://github.com/zhdan88vadim/PodFM.ru/blob/master/podfm.py

var request = require('request');
request = request.defaults({ jar: true });

const USERNAME = 'zhdan88vadim';
const PASSWORD = '!RT34vTDwsxWSXqaz'; //
var LOGIN_URL = 'https://podfm.ru/login/';
var UPLOAD_URL = 'https://zhdan88vadim.podfm.ru/add/';

var userCookie = null;

function upload(userCookie) {

    var uploadArgs = {
        url: UPLOAD_URL,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)',
            //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': userCookie.join(';')
        },
        //form: {}
    };

    request.get(uploadArgs, (error, response, body) => {
        console.log(response);
    });
}

function login(username, password) {
    var userCookies = null;

    return new Promise((resolve, reject) => {

        request.get('http://podfm.ru/',
            (error, response, body) => {
                if (!error && response.statusCode === 200) {
                    userCookies = response.headers['set-cookie'];

                    var loginArgs = {
                        url: LOGIN_URL,
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)',
                            'Content-Type': 'application/x-www-form-urlencoded',
                            'Cookie': userCookies.join(';')
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

var userCookie = login(USERNAME, PASSWORD);