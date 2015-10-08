/*global MyAvatar, Entities, AnimationCache, SoundCache, Scene, Camera, Overlays, HMD, AvatarList, AvatarManager, Controller, UndoStack, Window, Account, GlobalServices, Script, ScriptDiscoveryService, LODManager, Menu, Vec3, Quat, AudioDevice, Audio, Paths, Clipboard, Settings, XMLHttpRequest, EventBridge, WebWindow,*/

LODManager.LODIncreased.connect(function() {
    print("LOD has been increased. You can now see " 
            + LODManager.getLODFeedbackText() 
            + ", fps:" + LODManager.getFPSAverage()
            + ", fast fps:" + LODManager.getFastFPSAverage()
        );
});

LODManager.LODDecreased.connect(function() {
    print("LOD has been decreased. You can now see " 
            + LODManager.getLODFeedbackText() 
            + ", fps:" + LODManager.getFPSAverage()
            + ", fast fps:" + LODManager.getFastFPSAverage()
        );
});