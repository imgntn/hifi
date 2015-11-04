//  convnetEntityExample.js
//
//  Created by James B. Pollack on  11/3/2015
//  Copyright 2015 High Fidelity, Inc.
//
//  This is an entity script that will train a shared neural network.
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// I think there's a lot of interesting potential for training / using these kinds of networks inside of High Fidelity. Distributed training of networks (on entities?) could be really cool.  For docs, see  -- https://github.com/karpathy/convnetjs 

// need to adapt its img_to_vol function since we don't have access to a canvas -- maybe there are some qt image functions we can hook into.

// need to get a distributed entity example actually working.


(function() {
    var CONVNETJS_URL = Script.resolvePath('convnet.js');

    Script.include(CONVNETJS_URL);
    Script.include('utils.js');

    var convnetjs = loadConvnetjs();

    var _this;

    NetWorker = function() {
        _this = this;
    };

    NetWorker.prototype = {
        net: null,
        trainer: null,
        preload: function(entityID) {
            this.entityID = entityID;
            this.getNet();
            Script.update.connect(this.trainNet);
        },
        unload: function() {
            Script.update.disconnect(this.trainNet);
            this.saveNet();

        },
        getNet: function() {
            var properties = Entities.getProperties(this.entityID, 'userData');
            var userData = JSON.parse(properties.userData);
            if (userData.hasOwnProperty('hifiConvnetKey')) {
                var unparsedNet = userData.hifiConvnetKey.net;
                this.loadNet(unparsedNet);
            }
        },
        loadNet: function(str) {
            // later, to recreate the network:
            var json = JSON.parse(str); // creates json object out of a string
            this.net = new convnetjs.Net(); // create an empty network
            this.net.fromJSON(json); // load all parameters from JSON
            this.loadTrainer();
        },
        loadTrainer: function() {
            this.trainer = new convnetjs.SGDTrainer(this.net, {
                learning_rate: 0.01,
                l2_decay: 0.001
            });
        },
        trainNet: function() {
            //TODO:  get some interesting data every step!!!
            var data = [0.3, -0.5];
            var x = new convnetjs.Vol(data);
            _this.trainer.train(x, 0);
        },
        saveNet: function(net) {
            //TODO: how do you make sure nets join successfully?
            var saveNet = this.net.toJSON();
            var str = JSON.stringify(saveNet);

            //maybe userData is not the best place to store this.  i haven't really tested how big they get yet.
            setEntityCustomData(this.entityID, "hifiConvnetKey", {
                net: str
            })
        }

    };

    return new NetWorker();
});