/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/
Window.alert("This is an alert box");

var confirmed = Window.confirm("This is a confirmation dialog")
Window.alert("Your response was: " + confirmed);

var prompt = Window.prompt("This is a prompt dialog", "This is the default text");
Window.alert("Your response was: " + prompt);
