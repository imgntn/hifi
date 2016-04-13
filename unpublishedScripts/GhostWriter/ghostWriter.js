GhostWriter = function() {}

GhostWriter.prototype = {
    options:{
        
    },
    write:function(){

    },
    breakLine:function(){

    },
    clear:function(){

    },

    //not really necessary for v1
    rotateLetters:function()(){},
    rotateWords:function()(){},
    rotateWhole:function(){},
    growLetters:function(){},
    growWords:function(){},
    growWhole:function(){},
    shrinkLetters:function(){},
    shrinkWords:function(){},
    shrinkWhole:function(){},
    moveTo:function(){},
}

function hasLowerCase(str) {
    return (/[a-z]/.test(str));
}

function hasUpperCase(str) {
    return (/[A-Z]/.test(str));
}

function hasDigit(str) {
    return (/\d/.test(str));
}

function hasSymbol(str) {
    return (/[^a-zA-Z0-9]/g.test(str))
}

function splitStringIntoCharacters(str) {
    return str.split('')
}

function getCharacterType(character) {
    if (hasUpperCase(character) === true) {
        return 'upperCase'
    }
    if (hasLowerCase(character) === true) {
        return 'lowerCase'
    }
    if (hasDigit(character) === true) {
        return 'digit'
    }
    if (hasSymbol(character) === true) {
        return 'symbol'
    }
}

function getModelForCharacter(character) {
    var url;
    var type = getCharacterType(character);

    if (type !== 'symbol') {
        url = characterType + "/" + character + ".fbx";
    } else {
        url = characterType + "/" + getFileNameForSymbol(symbol) + ".fbx";
    }
    return url;
}

function getFileNameForSymbol(symbol) {
    return symbolMapping[symbol];
}

var symbolMapping = {
    '`': 'accent',
    '~': 'tilde',
    '!': 'exclamation',
    '@': 'at'
}

//to use 
// var writer = new GhostWriter();
// var options = {}
// options.text = "What a way it is"
// options.position = vec3
// options.rotation = quat
// options.direction = vec3 or string (front,back,left,right,up,down)
// options.texture = url
// options.letterSize = 
// options.letterSpacing =
// writer.write(options)

// would be sweet if the letters did something when you looked at them.
// like played a sound
// or changed textures