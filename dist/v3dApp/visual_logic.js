/**
 * Generated by Verge3D Puzzles v.3.1.1
 * Mon Jul 27 2020 23:13:25 GMT-0400 (Eastern Daylight Time)
 * Prefer not editing this file as your changes may get overridden once Puzzles are saved.
 * Check out https://www.soft8soft.com/docs/manual/en/introduction/Using-JavaScript.html
 * for the information on how to add your own JavaScript to Verge3D apps.
 */

'use strict';

(function() {

// global variables/constants used by puzzles' functions
var _pGlob = {};

_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.objClickCallbacks = [];
_pGlob.pickedObject = '';
_pGlob.objHoverCallbacks = [];
_pGlob.hoveredObject = '';
_pGlob.objMovementInfos = {};
_pGlob.objDragOverCallbacks = [];
_pGlob.objDragOverInfoByBlock = {}
_pGlob.dragMoveOrigins = {};
_pGlob.dragScaleOrigins = {};
_pGlob.mediaElements = {};
_pGlob.loadedFiles = {};
_pGlob.loadedFile = '';
_pGlob.animMixerCallbacks = [];
_pGlob.arHitPoint = new v3d.Vector3(0, 0, 0);
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.animateParamUpdate = null;
_pGlob.openedFile = '';
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.gamepadIndex = 0;

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();
_pGlob.intervals = {};

_pGlob.wooProductInfo = {};

var _pPhysics = {};

_pPhysics.tickCallbacks = [];
_pPhysics.syncList = [];

// internal info
_pPhysics.collisionData = [];

// goes to collision callback
_pPhysics.collisionInfo = {
    objectA: '',
    objectB: '',
    distance: 0,
    positionOnA: [0, 0, 0],
    positionOnB: [0, 0, 0],
    normalOnB: [0, 0, 0]
};

var PL = v3d.PL = v3d.PL || {};

// a more readable alias for PL (stands for "Puzzle Logic")
v3d.puzzles = PL;

PL.procedures = PL.procedures || {};

PL.execInitPuzzles = function(options) {
    // always null, should not be available in "init" puzzles
    var appInstance = null;

    var _initGlob = {};
    _initGlob.percentage = 0;
    _initGlob.output = {
        initOptions: {
            fadeAnnotations: true,
            useBkgTransp: false,
            preserveDrawBuf: false,
            useCompAssets: false,
            useFullscreen: true,
            useCustomPreloader: false,
            preloaderStartCb: function() {},
            preloaderProgressCb: function() {},
            preloaderEndCb: function() {},
        }
    }

    // provide the container's id to puzzles that need access to the container
    _initGlob.container = options !== undefined && 'container' in options
            ? options.container : "";

    

    
    return _initGlob.output;
}

PL.init = function(appInstance, initOptions) {
initOptions = initOptions || {};

if ('fadeAnnotations' in initOptions) {
    _pGlob.fadeAnnotations = initOptions.fadeAnnotations;
}



// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return (obj.type !== "AmbientLight" && obj.name !== ""
            && !(obj.isMesh && obj.isMaterialGeneratedMesh));
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects on the scene
function getAllObjectNames() {
    var objNameList = [];
    appInstance.scene.traverse(function(obj) {
        if (notIgnoredObj(obj))
            objNameList.push(obj.name)
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// retrieve all objects which belong to the group
function getObjectNamesByGroupName(targetGroupName) {
    var objNameList = [];
    appInstance.scene.traverse(function(obj){
        if (notIgnoredObj(obj)) {
            var groupNames = obj.groupNames;
            if (!groupNames)
                return;
            for (var i = 0; i < groupNames.length; i++) {
                var groupName = groupNames[i];
                if (groupName == targetGroupName) {
                    objNameList.push(obj.name);
                }
            }
        }
    });
    return objNameList;
}


// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc;
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}





/**
 * Retrieve coordinate system from the loaded scene
 */
function getCoordSystem() {
    var scene = appInstance.scene;

    if (scene && "v3d" in scene.userData && "coordSystem" in scene.userData.v3d) {
        return scene.userData.v3d.coordSystem;
    } else {
        // COMPAT: <2.17, consider replacing to 'Y_UP_RIGHT' for scenes with unknown origin
        return 'Z_UP_RIGHT';
    }
}


/**
 * Transform coordinates from one space to another
 * Can be used with Vector3 or Euler.
 */
function coordsTransform(coords, from, to, noSignChange) {

    if (from == to)
        return coords;

    var y = coords.y, z = coords.z;

    if (from == 'Z_UP_RIGHT' && to == 'Y_UP_RIGHT') {
        coords.y = z;
        coords.z = noSignChange ? y : -y;
    } else if (from == 'Y_UP_RIGHT' && to == 'Z_UP_RIGHT') {
        coords.y = noSignChange ? z : -z;
        coords.z = y;
    } else {
        console.error('coordsTransform: Unsupported coordinate space');
    }

    return coords;
}


/**
 * Verge3D euler rotation to Blender/Max shortest.
 * 1) Convert from intrinsic rotation (v3d) to extrinsic XYZ (Blender/Max default
 *    order) via reversion: XYZ -> ZYX
 * 2) swizzle ZYX->YZX
 * 3) choose the shortest rotation to resemble Blender's behavior
 */
var eulerV3DToBlenderShortest = function() {

    var eulerTmp = new v3d.Euler();
    var eulerTmp2 = new v3d.Euler();
    var vec3Tmp = new v3d.Vector3();

    return function(euler, dest) {

        var eulerBlender = eulerTmp.copy(euler).reorder('YZX');
        var eulerBlenderAlt = eulerTmp2.copy(eulerBlender).makeAlternative();

        var len = eulerBlender.toVector3(vec3Tmp).lengthSq();
        var lenAlt = eulerBlenderAlt.toVector3(vec3Tmp).lengthSq();

        dest.copy(len < lenAlt ? eulerBlender : eulerBlenderAlt);
        return coordsTransform(dest, 'Y_UP_RIGHT', 'Z_UP_RIGHT');
    }

}();




// applyObjLocalTransform puzzle
function applyObjLocalTransform(objNames, mode, x, y, z) {

    objNames = retrieveObjectNames(objNames);
    if (!objNames) return;

    var defValue = mode == "scale" ? 1 : 0;
    if (typeof x != "number") x = defValue;
    if (typeof y != "number") y = defValue;
    if (typeof z != "number") z = defValue;

    var coords = coordsTransform(_pGlob.vec3Tmp.set(x, y, z), getCoordSystem(), 'Y_UP_RIGHT', mode == 'scale');

    for (var i = 0; i < objNames.length; i++) {
        var objName = objNames[i];
        if (!objName) continue;

        var obj = getObjectByName(objName);
        if (!obj) continue;

        // don't transform values for cameras, their local space happens
        // to be the same as for Blender/Max cameras, bcz their different
        // rest orientation balances difference in coordinate systems
        var useTransformed = !obj.isCamera;
        var xVal = useTransformed ? coords.x : x;
        var yVal = useTransformed ? coords.y : y;
        var zVal = useTransformed ? coords.z : z;

        switch (mode) {
        case "position":
            if (_pGlob.xrSessionAcquired && obj.isCamera) {
                v3d.WebXRUtils.translateVRCamera(obj, _pGlob.AXIS_X, xVal);
                v3d.WebXRUtils.translateVRCamera(obj, _pGlob.AXIS_Y, yVal);
                v3d.WebXRUtils.translateVRCamera(obj, _pGlob.AXIS_Z, zVal);
            } else {
                obj.translateX(xVal);
                obj.translateY(yVal);
                obj.translateZ(zVal);
            }
            break;
        case "rotation":
            if (_pGlob.xrSessionAcquired && obj.isCamera) {
                v3d.WebXRUtils.rotateVRCamera(obj, _pGlob.AXIS_X, v3d.Math.degToRad(xVal));
                v3d.WebXRUtils.rotateVRCamera(obj, _pGlob.AXIS_Y, v3d.Math.degToRad(yVal));
                v3d.WebXRUtils.rotateVRCamera(obj, _pGlob.AXIS_Z, v3d.Math.degToRad(zVal));
            } else {
                obj.rotateX(v3d.Math.degToRad(xVal));
                obj.rotateY(v3d.Math.degToRad(yVal));
                obj.rotateZ(v3d.Math.degToRad(zVal));
            }
            break;
        case "scale":
            obj.scale.x *= xVal;
            obj.scale.y *= yVal;
            obj.scale.z *= zVal;
            break;
        }

        obj.updateMatrixWorld(true);
    }
}



// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);
    if (eventType == "mousedown") {
        var touchEventName = mouseDownUseTouchStart ? "touchstart" : "touchend";
        elem.addEventListener(touchEventName, pickListener);
    }

    var raycaster = new v3d.Raycaster();
    function pickListener(event) {
        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.camera);
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        if (intersects.length > 0) {
            var obj = intersects[0].object;
            callback(obj, event);
        } else {
            callback(null, event);
        }
    }
}

// utility function used by the whenDraggedOver puzzles
function fireObjectPickingCallbacks(objName, source, index, cbParam) {
    for (var i = 0; i < source.length; i++) {
        var cb = source[i];
        if (objectsIncludeObj([cb[0]], objName)) {
            cb[index](cbParam);
        }
    }
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// whenClicked puzzle
initObjectPicking(function(obj) {

    // save the object for the pickedObject block
    _pGlob.pickedObject = obj ? getPickedObjectName(obj) : '';

    _pGlob.objClickCallbacks.forEach(function(el) {
        var isPicked = obj && objectsIncludeObj(el.objNames, getPickedObjectName(obj));
        el.callbacks[isPicked ? 0 : 1]();
    });
}, 'mousedown');



// whenClicked puzzle
function registerOnClick(objNames, cbDo, cbIfMissedDo) {
    objNames = retrieveObjectNames(objNames) || [];
    var objNamesFiltered = objNames.filter(function(name) {
        return name;
    });
    _pGlob.objClickCallbacks.push({
        objNames: objNamesFiltered,
        callbacks: [cbDo, cbIfMissedDo]
    });
}



registerOnClick('Cube', function() {
  applyObjLocalTransform('Cube', 'rotation', 315, 105, 30);
}, function() {});



} // end of PL.init function

})(); // end of closure

/* ================================ end of code ============================= */
