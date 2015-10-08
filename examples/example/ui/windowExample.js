/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/
var width = 0,
    height = 0;

function onUpdate(dt) {
    if (width != Window.innerWidth || height != Window.innerHeight) {
        width = Window.innerWidth;
        height = Window.innerHeight;
        print("New window dimensions: " + width + ", " + height);
    }
}

Script.update.connect(onUpdate);
