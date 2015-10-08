/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/
//
//  hitEffect.js
//  examples
//
//  Created by Eric Levin on July 20, 2015
//  Copyright 2015 High Fidelity, Inc.
//
//  An example of how to toggle a screen-space hit effect using the Scene global object.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

var hitEffectEnabled = false;

toggleHitEffect();

function toggleHitEffect() {
    Script.setTimeout(function() {
      hitEffectEnabled = !hitEffectEnabled;
      Scene.setEngineDisplayHitEffect(hitEffectEnabled);    
       toggleHitEffect();
    }, 1000);
}





