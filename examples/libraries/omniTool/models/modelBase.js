/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/

ModelBase = function() {
    this.length = 0.2;
} 

ModelBase.prototype.setVisible = function(visible) {
    this.visible = visible;
}

ModelBase.prototype.setLength = function(length) {
    this.length = length;
}

ModelBase.prototype.setTransform = function(transform) {
    this.rotation = transform.rotation;
    this.position = transform.position;
    this.tipVector = Vec3.multiplyQbyV(this.rotation, { x: 0, y: this.length, z: 0 });
    this.tipPosition = Vec3.sum(this.position, this.tipVector);
}

ModelBase.prototype.setTipColors = function(color1, color2) {
}

ModelBase.prototype.onCleanup = function() {
}
