/*jslint node: true */
"use strict";

var HID = require('node-hid');


var myDevice = {
    vendorId: 1241,
    productId: 41042,
    path: '\\\\?\\hid#vid_04d9&pid_a052#7&2a70756&0&0000#{4d1e55b2-f16f-11cf-88c-001111000030}',
    serialNumber: '1.40',
    manufacturer: 'Holtek',
    product: 'USB-zyTemp',
    release: 256,
    interface: -1
};

// var device = new HID.HID(vid,pid);
var hid = new HID.HID(myDevice.vendorId, myDevice.productId);

hid.on("data", function(data) {
    console.log(data);
});

hid.on("error", function(err) {
    console.log(data);
});


hid.gotData = function(err, data) {
    console.log('got data', data);

    this.read(this.gotData.bind(this));
};

hid.read(hid.gotData.bind(hid));