//
//  changeColorOnHover.js
//  examples/entityScripts
//
//  Created by Brad Hefta-Gaub on 11/1/14.
//  Copyright 2014 High Fidelity, Inc.
//
//  This is an example of an entity script which when assigned to a non-model entity like a box or sphere, will
//  change the color of the entity when you hover over it. This script uses the JavaScript prototype/class functionality
//  to construct an object that has methods for hoverEnterEntity and hoverLeaveEntity;
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {
 print('JBP TEST yoOOO')
    Script.include('underscore.js');
    var arr = [1, 2, 3, 4, 5]
    _.each(arr, function(v) {
        print('value is:' + v)
    })

    this.preloads = [];
    this.unloads = [];
    print('JBP TEST yoOOO')

    // Script.include("../../unpublishedScripts/DomainContent/CellScience/Scripts/moveRandomly.js");
    // this.preloads.push(this.preload);
    // this.unloads.push(this.unload);
    Script.include("../../unpublishedScripts/DomainContent/CellScience/Scripts/zoom.js");
        var z = new Zoom();
        // var m = new Move();

    this.preloads.push(z.preload);
    this.unloads.push(z.unload);
    print('JBP '+z.entered)
    print('JBP 2 '+ this.preloads[0])
   
    this.preload = function() {
        this.preloads.forEach(function(preload){
            preload.call()
        }) 
    }

    this.unload = function() {
        this.unloads.forEach(function(unload) {
            unload.call()
        })
    }

    print('JAMES: ' + JSON.stringify(this.preloads))
    print('PRELOAD:'+this.preload)

})()