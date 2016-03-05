 var MAPPING_NAME = "com.highfidelity.testing.reticleWithHandRotation";
 var mapping = Controller.newMapping(MAPPING_NAME);

 var viveActivatorBaseString = 'Controller.Hardware.Vive';
 var viveActivatorStrings = [
     'LY',
     'LX',
     'RY',
     'RX',
     'LeftHand',
     'RightHand',
     'LeftPrimaryThumb',
     'LeftSecondaryThumb',
     'RightPrimaryThumb',
     'RightSecondaryThumb',
     'RS',
     'RT'
     'RB'
     'LS',
     'LT',
     'LB',
 ];

 if (Controller.Hardware.Vive !== undefined) {
     createMappingsForAllViveActicators();
     mapping.enable();
 }

 function createMappingsForAllViveActicators() {
     viveActivatorStrings.forEach(function(activator) {
         var finalActivatorString = viveActivatorBaseString + activator;
         mapping.from(finalActivatorString).peek().to(function(value) {

             //if there are already visualizations, delete them because we're moving
             if (visualizations.length !== 0) {
                 destroyVisualizations();
             }

             //always update the pose so we have the latest
             if (activator === "leftHand" || "rightHand") {
                 getControllersInSpace(activator, pose);
             }

             //if there isn't a timer to create the visualizations, make one
             if (visualizationTimeout === null) {
                 setVisualizationTimeout();
             } else {
                 // if there is a timeout already, clear it 
                 Script.clearTimeout(visualizationTimeout);
                 setVisualizationTimeout();;
             }



         });
     })
 }


 var VISUALIZATION_TIMEOUT_LENGTH = 3000;
 var visualizationTimeout;

 function setVisualizationTimeout() {
     visualizationTimeout = Script.setTimeout(function() {
         createVisualizations();
     }, VISUALIZATION_TIMEOUT_LENGTH);
 }
 var visualizations = [];

 //TODO - get models and dimensions
 var VIVE_PRE_CONTROLLER_MODEL_URL = '';
 var VIVE_PRE_CONTROLLER_DIMENSIONS = {
     x: 0,
     y: 0,
     z: 0
 }

 var rightPosition = null;
 var leftPostion = null;
 var rightRotation = null;
 var leftRotation = null;

 function getControllersInSpace(activator, pose) {
     if (activator === 'RightHand') {
         rightPosition = pose.position;
         rightRotation = pose.rotation;
     }
     if (activator === 'LeftHand') {
         leftPosition = pose.position;
         leftRotation = pose.rotation;
     }

 }

 function createVisualizations() {
     if (visualizations.length !== 0) {
         return;
     }
     var right = createSingleVisualization(rightPosition, rightRotation);
     var left = createSingleVisualization(leftPostion, leftRotation);
 }

 function createSingleVisualization(position, rotation) {
     var visualizationProperties = {
         type: 'Model',
         modelURL: VIVE_PRE_CONTROLLER_MODEL_URL,
         dimensions: VIVE_PRE_CONTROLLER_DIMENSIONS,
         position: position,
         rotation: rotation
     };

     visualizations.push(Entities.addEntitiy(visualizationProperties));
 }


 function destroyVisualizations() {
     visualizations.forEach(function(viz) {
         Entities.deleteEntity(viz);
     })
     visualizations = [];
 }


 function cleanup() {
     destroyVisualizations();
     if (visualizationTimeout !== null) {
         Script.clearTimeout(visualizationTimeout);
     }

 }

 Script.scriptEnding.connect(cleanup);