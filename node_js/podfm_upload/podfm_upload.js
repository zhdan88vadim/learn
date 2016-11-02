// https://github.com/zhdan88vadim/PodFM.ru/blob/master/podfm.py

var request = require('request');

const USERNAME = 'zhdan88vadim';
const PASSWORD = '!RT34vTDwsxWSXqaz';

var loginUrl = 'https://podfm.ru/login/',
    loginArgs = {
        url: loginUrl,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        form: {
            'a_todo': 'login_check',
            'username': USERNAME,
            'password': encodeURI(PASSWORD),
            'remember': 'on',
            'todo': 'login'
        }
    }


request.post(loginArgs,
    (error, response, body) => {
        if (!error && response.statusCode === 200 || response.statusCode === 303) {
            console.log(response);
        } else {
            reject(response.statusCode + " through getToken()");
        }
    });