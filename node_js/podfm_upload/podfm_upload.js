// https://github.com/zhdan88vadim/PodFM.ru/blob/master/podfm.py


var fs = require('fs');
//var FormData = require('form-data');

var request = require('request');
request = request.defaults({ jar: true });

const USERNAME = 'zhdan88vadim';
const PASSWORD = 'wsxWSXqaz'; //!RT34vTD
const LOGIN_URL = 'https://podfm.ru/login/';
const UPLOAD_URL = 'https://' + USERNAME + '.podfm.ru/add/';

var userCookie = null;

/*

    def upload(self,  audioFile):
        """Uploads audio file to PodFM server. May take time. On success, returns PodFile ID, file identifier needed for publishing."""
        assert self.cookies
        
        # POST multipart/form-data form with audio file
        url = 'http://%s.podfm.ru/actionuploadpodfile/' % self.username
        formFields = {
            'todo': 'step1_upload', 
            'pod_id': '', 
            }
        files = {
            'file':  ('podcast.mp3', audioFile, 'audio/mp3')
            }            
        r = requests.post(url, cookies = self.cookies,  headers = self.headers,  files = files,  data = formFields)
        assert r.status_code == 200
        self.cookies.update(requests.utils.dict_from_cookiejar(r.cookies))
        
        # Now parse the uploaded file identifier
        assert '?file_id=' in r.url
        s = r.url[r.url.rindex('/'):]
        s = ''.join(c for c in s if c.isdigit())
        if not s:
            raise Exception('Unknown podfile ID -- cannot publish. Upload done...')
        return int(s)

*/



function upload(userCookie) {

    // https://github.com/request/request#multipartform-data-multipart-form-uploads

    // var uploadArgs = {
    //     url: UPLOAD_URL,
    //     headers: {
    //         'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)',
    //         //'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    //         'Cookie': userCookie.join(';')
    //     },
    //     form: {
    //         'todo': 'step1_upload',
    //         'pod_id': '',
    //         'files': {
    //         }
    //     }

    // var form = new FormData();

    // form.append('todo', 'step1_upload');
    // form.append('pod_id', '');
    // form.append('file', fs.createReadStream('D://Shtapa_-_До_Ре_Ми_South_D_Sound.mp3'));

    var uploadArgs = {
        url: UPLOAD_URL,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)',
            'Cookie': userCookie.join(';')
        },
        formData: {
            'todo': 'step1_upload',
            'pod_id': '',
            'file': fs.createReadStream(__dirname + '/Sound.mp3')
        }
    }

    request.post(uploadArgs, (error, response, body) => {
        console.log(response);
    });

};

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

login(USERNAME, PASSWORD)
    .then(cookies => upload(cookies))
    .catch(err => {
        console.error(err);
    });