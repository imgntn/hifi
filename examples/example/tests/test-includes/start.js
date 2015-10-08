/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/
// start.js:
var a, b;
print('initially: a:' + a + ' b:' + b);
Script.include(['a.js', '../test-includes/a.js', 'b.js', 'a.js']);
print('finally a:' + a + ' b:' + b);
