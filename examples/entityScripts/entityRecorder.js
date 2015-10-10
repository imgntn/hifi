//
//  entityRecorder
//
//  This script records the properties of the entity it is attached to.  It sends in batches, which can be tuned to fit your reesolution / perofrmance requirements.
//  Created by James B. Pollack @imgntn on 10/10/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {

    var ENDPOINT_URL = "";

    var BATCH_SIZE = 30;

    var RECORD_EVERY = 1000; // 1 seconds

    var _this;

    var batch = [];

    var recorderInterval;

    function Recorder() {
        _this = this;
        return;
    }

    Recorder.prototype = {
        init: function() {
            var batchCount = 0;

            recorderInterval = Script.setInterval(function() {

                if (batchCount === BATCH_SIZE) {
                    sendBatchToEndpoint(batch);
                    batchCount = 0;
                }
                batch.push(_this.getProperties());
                batchCount++;
            }, RECORD_EVERY);

        },
        preload: function() {
            this.entityID = entityID;
        },
        getProperties: function() {
            return {
                entityID: this.entityID,
                properties: Entities.getEntityProperties(this.entityID)
            }
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
        Entities.deletingEntity.disconnect(deleteInterval);
    }

    Entities.deletingEntity.connect(deleteInterval);

    return new Recorder();
});