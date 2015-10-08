/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/
//
//  dialTone.js
//  examples
//
//  Created by Stephen Birarda on 06/08/15.
//  Added disconnect HRS 6/11/15.
//  Copyright 2015 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// setup the local sound we're going to use
var connectSound = SoundCache.getSound("file:///" + Paths.resources + "sounds/hello.wav");
var disconnectSound = SoundCache.getSound("file:///" + Paths.resources + "sounds/goodbye.wav");
var micMutedSound = SoundCache.getSound("file:///" + Paths.resources + "sounds/goodbye.wav");

// setup the options needed for that sound
var soundOptions = {
    localOnly: true
};

// play the sound locally once we get the first audio packet from a mixer
Audio.receivedFirstPacket.connect(function(){
    Audio.playSound(connectSound, soundOptions);
});

Audio.disconnected.connect(function(){
    Audio.playSound(disconnectSound, soundOptions);
});

AudioDevice.muteToggled.connect(function () {
    if (AudioDevice.getMuted()) {
        Audio.playSound(micMutedSound, soundOptions);
    }
});
