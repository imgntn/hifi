//
//  avatarRecorder.js
//
//  This script records the properties of your avatar.  It sends in batches, which can be tuned to fit your reesolution / perofrmance requirements.
//  Created by James B. Pollack @imgntn on 10/10/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var ENDPOINT_URL = "";

var BATCH_SIZE = 30;

var batch = [];

var RECORD_EVERY = 1000; // 1 seconds
var batchCount = 0;

var recorderInterval = Script.setInterval(function() {

    if (batchCount === BATCH_SIZE) {
        sendBatchToEndpoint(batch);
        batchCount = 0;
    }
    batch.push(getAvatarData());
    batchCount++;
}, RECORD_EVERY);


function getAvatarData() {
    return {
        avatarData: MyAvatar,
    }
}

function sendBatchToEndpoint(batch) {
    // print('SEND BATCH TO ENDPOINT');
    var req = new XMLHttpRequest();
    req.open("POST", ENDPOINT_URL, false);
    req.send(JSON.stringify(batch));
    batch = [];
}

function deleteInterval() {
    Script.clearInterval(recorderInterval);
}

Script.scriptEnding.connect(deleteInterval)