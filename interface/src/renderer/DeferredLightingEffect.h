//
//  DeferredLightingEffect.h
//  interface/src/renderer
//
//  Created by Andrzej Kapolka on 9/11/14.
//  Copyright 2014 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

#ifndef hifi_DeferredLightingEffect_h
#define hifi_DeferredLightingEffect_h

#include <QVector>

#include "ProgramObject.h"

class PostLightingRenderable;

/// Handles deferred lighting for the bits that require it (voxels, metavoxels...)
class DeferredLightingEffect {
public:
    
    void init();

    /// Returns a reference to a simple program suitable for rendering static
    /// untextured geometry (such as that generated by glutSolidSphere, etc.)
    ProgramObject& getSimpleProgram() { return _simpleProgram; }

    /// Sets up the state necessary to render static untextured geometry with the simple program.
    void bindSimpleProgram();
    
    /// Tears down the state necessary to render static untextured geometry with the simple program.
    void releaseSimpleProgram();

    //// Renders a solid sphere with the simple program.
    void renderSolidSphere(float radius, int slices, int stacks);

    //// Renders a wireframe sphere with the simple program.
    void renderWireSphere(float radius, int slices, int stacks);
    
    //// Renders a solid cube with the simple program.
    void renderSolidCube(float size);

    //// Renders a wireframe cube with the simple program.
    void renderWireCube(float size);
    
    /// Adds an object to render after performing the deferred lighting for the current frame (e.g., a translucent object).
    void addPostLightingRenderable(PostLightingRenderable* renderable) { _postLightingRenderables.append(renderable); }
    
    void prepare();
    void render();

private:

    class LightLocations {
    public:
        int shadowDistances;
        int shadowScale;
        int nearLocation;
        int depthScale;
        int depthTexCoordOffset;
        int depthTexCoordScale;
    };
    
    static void loadLightProgram(const char* name, ProgramObject& program, LightLocations& locations);
   
    ProgramObject _simpleProgram;
    int _glowIntensityLocation;
    
    ProgramObject _directionalLight;
    LightLocations _directionalLightLocations;
    ProgramObject _directionalLightShadowMap;
    LightLocations _directionalLightShadowMapLocations;
    ProgramObject _directionalLightCascadedShadowMap;
    LightLocations _directionalLightCascadedShadowMapLocations;
    
    QVector<PostLightingRenderable*> _postLightingRenderables;
};

/// Simple interface for objects that require something to be rendered after deferred lighting.
class PostLightingRenderable {
public:
    virtual void renderPostLighting() = 0;
};

#endif // hifi_DeferredLightingEffect_h
