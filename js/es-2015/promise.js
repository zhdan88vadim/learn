'use strict'

var promise = new Promise(function(resolve, reject) {

});

// promis.then(onFulfilled, onRejected)

//-----------

// promis.then(null, onRejected)

// Для того, чтобы поставить обработчик только на ошибку, 
// вместо .then(null, onRejected) можно написать .catch(onRejected) – это то же самое.

let timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("my result");
        //reject(new Error('Time is out'));
    }, 2000);
});

timeoutPromise.then(result => {
    console.log('timeoutPromise: Fulfilled ' + result);

}, error => {
    console.log('timeoutPromise: Reject ' + error.message);
});

// You can add as many handlers at the same promis

timeoutPromise.then(resolve => {
    console.log('This text from second promise');
});


//-----------

function urlHandler(url) {
    return url + ' : completed';
}

let urls = ['/aricles/promise/user.json', '/articles/promise/guest.json', 1, 2, 3, 4, 5];

console.log('function: map', urls.map(urlHandler));

Promise.all(urls.map(urlHandler))
    .then(results => {
        console.log(results);
    });


//----------- Load array sequentially -----------

let chain = Promise.resolve();

let results = [];

urls.forEach(function(url) {
    chain = chain
        .then(() => urlHandler(url))
        .then((result) => {
            results.push(result);
        });
}, this);

chain.then(() => {
    console.log(results);
});

//-----------