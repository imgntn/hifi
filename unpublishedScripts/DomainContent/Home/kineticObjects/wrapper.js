print('KINETIC INCLUDING WRAPPER')

var BOOKS_URL = 'atp:/kineticObjects/books.json';
var UPPER_BOOKSHELF_URL = 'atp:/kineticObjects/upperBookShelf.json';
var LOWER_BOOKSHELF_URL = 'atp:/kineticObjects/lowerBookShelf.json';
var RIGHT_DESK_DRAWER_URL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Home/kineticObjects/rightDeskDrawer.json' + "?" + Math.random();
var LEFT_DESK_DRAWER_URL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Home/kineticObjects/leftDeskDrawer.json' + "?" + Math.random();
var CHAIR_URL = 'atp:/kineticObjects/chair.json';
var FRUIT_BOWL_URL = 'atp:/kineticObjects/fruit.json';
var LIVING_ROOM_LAMP_URL = 'atp:/kineticObjects/deskLamp.json';
var TRASHCAN_URL = 'atp:/kineticObjects/trashcan.json'; 
var BLOCKS_URL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Home/kineticObjects/blocks.json' + "?" + Math.random();
var PLAYA_POSTER_URL = 'atp:/kineticObjects/postersPlaya.json';
var CELL_POSTER_URL = 'atp:/kineticObjects/postersCell.json';

FruitBowl = function(spawnLocation, spawnRotation) {
    print('CREATE FRUIT BOWL')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(FRUIT_BOWL_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;

}


LivingRoomLamp = function(spawnLocation, spawnRotation) {
    print('CREATE LIVING ROOM LAMP')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(LIVING_ROOM_LAMP_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

UpperBookShelf = function(spawnLocation, spawnRotation) {
    print('CREATE UPPER SHELF')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(UPPER_BOOKSHELF_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}


LowerBookShelf = function(spawnLocation, spawnRotation) {
    print('CREATE LOWER SHELF')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(LOWER_BOOKSHELF_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}



Chair = function(spawnLocation, spawnRotation) {
    print('CREATE CHAIR')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(CHAIR_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

Trashcan = function(spawnLocation, spawnRotation) {
    print('CREATE TRASHCAN')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(TRASHCAN_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;

}

Books = function(spawnLocation, spawnRotation) {
    print('CREATE BOOKS')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(BOOKS_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

Blocks = function(spawnLocation, spawnRotation) {
    print('CREATE BLOCKS')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(BLOCKS_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;

}

PosterCell = function(spawnLocation, spawnRotation) {
    print('CREATE CELL POSTER')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(CELL_POSTER_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

PosterPlaya = function(spawnLocation, spawnRotation) {
    print('CREATE PLAYA POSTER')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(PLAYA_POSTER_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}