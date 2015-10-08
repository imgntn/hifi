/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/
var entities = Entities.findEntities(MyAvatar.position, 10000);
var URL = "https://s3.amazonaws.com/hifi-public/models/props/chess/";

for(var i in entities) {
  if (Entities.getEntityProperties(entities[i]).modelURL.slice(0, URL.length) === URL) {
    Entities.deleteEntity(entities[i]);
  }
} 