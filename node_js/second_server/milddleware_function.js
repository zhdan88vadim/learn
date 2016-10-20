var myLoger = function(req, res, next) {
    console.log('LOGGED');
    next();
}

module.exports = myLoger;