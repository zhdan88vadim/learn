var fs = require('fs');


var logStream = fs.createWriteStream('result_file.txt', { 'flags': 'a', autoClose: true });



function readLines(input, func, endCallback) {
    var remaining = '';

    input.on('data', function(data) {
        remaining += data;
        var index = remaining.indexOf('\n');
        while (index > -1) {
            var line = remaining.substring(0, index);
            remaining = remaining.substring(index + 1);
            func(line);
            index = remaining.indexOf('\n');
        }
    });

    input.on('end', function() {
        if (remaining.length > 0) {
            func(remaining);
        }
        endCallback();
    });
}

function extractFilePath(data) {
    //var re = /LH1OnDemand.WebApp.Participant\\(.*)\(/ig;
    var re = /LH1OnDemand.WebApp.Participant\\(.*)\(\d+\)/i;

    var found = re.exec(data);
    if (found)
        return found[1];
    else
        return null;
}

function include(arr, obj) {
    return (arr.indexOf(obj) != -1);
}


var arrGood = [];
var arrNotInclude = [];


function funcGoodFiles(data) {
    if (data !== '\r')
        arrGood.push(data);
    else
        console.log('skip read:' + data);
}


var good_files = fs.createReadStream('good_files.txt');
readLines(good_files, funcGoodFiles, endCallbackGoodFiles);



function func(data) {

    var found = extractFilePath(data);

    if (found) {
        //console.log(found);

        var isInclude = include(arrGood, found + '\r');

        if (isInclude) {
            console.log('isInclude: ' + found);
        } else {

            if (!include(arrNotInclude, found)) {
                arrNotInclude.push(found);
                console.log('NOT Include: ' + found);
                logStream.write(found + '\r\n');
            }

        }

        //
    } else {
        if (data !== '\r')
            console.log('not match: ' + data);
    }
}

var endCallback = function() {
    logStream.end();
}


function endCallbackGoodFiles() {
    console.log('end-Callback-GoodFiles');

    var input = fs.createReadStream('lines.txt');
    readLines(input, func, endCallback);
}