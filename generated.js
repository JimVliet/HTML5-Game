var Collision;
(function (Collision) {
    var ColTileProps = (function () {
        function ColTileProps() {
            this.leftX = 0;
            this.upperY = 0;
            this.rightX = 15;
            this.lowerY = 15;
        }
        ColTileProps.prototype.collideXAxis = function (x) {
            return x >= this.leftX && x <= this.rightX;
        };
        ColTileProps.prototype.collideYAxis = function (y) {
            return y >= this.upperY && y <= this.lowerY;
        };
        return ColTileProps;
    })();
    Collision.ColTileProps = ColTileProps;
    function getPropMap(tiles, width, firstGid) {
        var map = [], y, x;
        for (var i = 0; i < tiles.length; i++) {
            y = Math.floor(i / width);
            x = i % width;
            if (map[y] == null)
                map[y] = [];
            map[y][x] = getTileCollisionProperties(tiles[i] - firstGid);
        }
        return map;
    }
    Collision.getPropMap = getPropMap;
    function getTileCollisionProperties(tileIndex) {
        if (tileIndex < 0 || tileIndex >= 65)
            return null;
        var props = new ColTileProps();
        if (tileIndex < 25) {
            props.leftX = tileIndex % 5;
            props.upperY = Math.floor(tileIndex / 5);
            props.rightX = 15 - (tileIndex % 5);
            props.lowerY = 15 - (Math.floor(tileIndex / 5));
        }
        else if (tileIndex < 35)
            props.lowerY -= tileIndex - 24;
        else if (tileIndex < 45)
            props.upperY = tileIndex - 34;
        else if (tileIndex < 55)
            props.rightX -= tileIndex - 44;
        else if (tileIndex < 65)
            props.leftX = tileIndex - 54;
        return props;
    }
    Collision.getTileCollisionProperties = getTileCollisionProperties;
    function tileCornerWaypoint(x, y, map, deltaX, deltaY) {
        var tileProps = map[y][x], xDif = 16 - deltaX, yDif = 16 - deltaY, minX = x == 0, maxX = x == map[0].length - 1, minY = y == 0, maxY = y == map.length - 1, topLeft = minX || minY ? null : map[y - 1][x - 1], top = minY ? null : map[y - 1][x], topRight = maxX || minY ? null : map[y - 1][x + 1], left = minX ? null : map[y][x - 1], right = maxX ? null : map[y][x + 1], bottomLeft = minX || maxY ? null : map[y + 1][x - 1], bottom = maxY ? null : map[y + 1][x], bottomRight = maxX || maxY ? null : map[y + 1][x + 1];
        if (tileProps == null)
            return [false, false, false, false];
        var outputCorners = [!minX && !minY, !maxX && !minY, !maxX && !maxY, !minX && !maxY];
        if (top != null && top.lowerY - tileProps.upperY >= yDif) {
            if (tileProps.leftX == top.leftX || top.collideXAxis(tileProps.leftX - 1))
                outputCorners[0] = false;
            if (tileProps.rightX == top.rightX || top.collideXAxis(tileProps.rightX + 1))
                outputCorners[1] = false;
        }
        if (right != null && tileProps.rightX - right.leftX >= xDif) {
            if (tileProps.upperY == right.upperY || right.collideYAxis(tileProps.upperY - 1))
                outputCorners[1] = false;
            if (tileProps.lowerY == right.lowerY || right.collideYAxis(tileProps.lowerY + 1))
                outputCorners[2] = false;
        }
        if (bottom != null && tileProps.lowerY - bottom.upperY >= yDif) {
            if (tileProps.leftX == bottom.leftX || bottom.collideXAxis(tileProps.leftX - 1))
                outputCorners[3] = false;
            if (tileProps.rightX == bottom.rightX || bottom.collideXAxis(tileProps.rightX + 1))
                outputCorners[2] = false;
        }
        if (left != null && left.rightX - tileProps.leftX >= xDif) {
            if (tileProps.upperY == left.upperY || left.collideYAxis(tileProps.upperY - 1))
                outputCorners[0] = false;
            if (tileProps.lowerY == left.lowerY || left.collideYAxis(tileProps.lowerY + 1))
                outputCorners[3] = false;
        }
        if (topLeft != null && topLeft.rightX - tileProps.leftX >= xDif && topLeft.lowerY - tileProps.upperY >= yDif)
            outputCorners[0] = false;
        if (topRight != null && tileProps.rightX - topRight.leftX >= xDif && topRight.lowerY - tileProps.upperY >= yDif)
            outputCorners[1] = false;
        if (bottomRight != null && tileProps.rightX - bottomRight.leftX >= xDif && tileProps.lowerY - bottomRight.upperY >= yDif)
            outputCorners[2] = false;
        if (bottomLeft != null && bottomLeft.rightX - tileProps.leftX >= xDif && tileProps.lowerY - bottomLeft.upperY >= yDif)
            outputCorners[3] = false;
        return outputCorners;
    }
    Collision.tileCornerWaypoint = tileCornerWaypoint;
})(Collision || (Collision = {}));
var UtilFunctions;
(function (UtilFunctions) {
    function setupPlayerKeys(game) {
        var keyLib = {};
        keyLib['w'] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyLib['a'] = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyLib['s'] = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyLib['d'] = game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyLib['space'] = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        return keyLib;
    }
    UtilFunctions.setupPlayerKeys = setupPlayerKeys;
    function loadGameLevel(game, levelToLoad) {
        game.state.add('TiledMapLoader', new GameStates.TiledMapLoader(game, levelToLoad), true);
    }
    UtilFunctions.loadGameLevel = loadGameLevel;
    function sign(testNumb) {
        if (testNumb < 0)
            return -1;
        if (testNumb > 0)
            return 1;
        return 0;
    }
    UtilFunctions.sign = sign;
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    UtilFunctions.getRandomInt = getRandomInt;
})(UtilFunctions || (UtilFunctions = {}));
var Manager;
(function (Manager) {
    (function (AnimType) {
        AnimType[AnimType["LEFT"] = 0] = "LEFT";
        AnimType[AnimType["RIGHT"] = 1] = "RIGHT";
        AnimType[AnimType["IDLE"] = 2] = "IDLE";
        AnimType[AnimType["UPDOWN"] = 3] = "UPDOWN";
        AnimType[AnimType["ATTACK"] = 4] = "ATTACK";
        AnimType[AnimType["NONE"] = 5] = "NONE";
    })(Manager.AnimType || (Manager.AnimType = {}));
    var AnimType = Manager.AnimType;
    var AnimManager = (function () {
        function AnimManager(GameObject, options) {
            if (options === void 0) { options = { 'Attack': [30, 31, 32, 33, 34, 35, 36, 37, 38, 39] }; }
            this.gameObject = GameObject;
            this.gameObject.smoothed = false;
            this.gameObject.animations.add('Idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 5, true);
            this.gameObject.animations.add('Walk', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29], 10, true);
            this.gameObject.animations.add('Attack', options['Attack'], 50, false).onComplete.add(this.attackDone, this);
            this.gameObject.animations.add('Die', [40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 10, false);
            this.gameObject.animations.play('Idle');
            this.current = AnimType.IDLE;
            this.attackSignal = new Phaser.Signal();
        }
        AnimManager.prototype.attack = function (animSpeed) {
            if (animSpeed < 0)
                this.gameObject.animations.play('Attack');
            else
                this.gameObject.animations.play('Attack', animSpeed, false);
            this.current = AnimType.ATTACK;
        };
        AnimManager.prototype.attackDone = function () {
            this.current = AnimType.NONE;
            this.attackSignal.dispatch();
        };
        AnimManager.prototype.updateAnimation = function (type) {
            if (this.current == AnimType.ATTACK)
                return;
            if (this.current == AnimType.NONE) {
                switch (type) {
                    case AnimType.LEFT:
                        this.gameObject.scale.x = -1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.LEFT;
                        return;
                    case AnimType.RIGHT:
                        this.gameObject.scale.x = 1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.RIGHT;
                        return;
                    case AnimType.UPDOWN:
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.UPDOWN;
                        return;
                    default:
                        this.gameObject.animations.play('Idle');
                        this.current = AnimType.IDLE;
                        return;
                }
            }
            switch (type) {
                case AnimType.LEFT:
                    if (this.current != AnimType.LEFT) {
                        this.gameObject.scale.x = -1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.LEFT;
                    }
                    return;
                case AnimType.RIGHT:
                    if (this.current != AnimType.RIGHT) {
                        this.gameObject.scale.x = 1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.RIGHT;
                    }
                    return;
                case AnimType.UPDOWN:
                    if (this.current != AnimType.UPDOWN) {
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.UPDOWN;
                    }
                    return;
                default:
                    if (this.current != AnimType.IDLE) {
                        this.gameObject.animations.play('Idle');
                        this.current = AnimType.IDLE;
                    }
                    return;
            }
        };
        return AnimManager;
    })();
    Manager.AnimManager = AnimManager;
})(Manager || (Manager = {}));
var GameObjects;
(function (GameObjects) {
    (function (GameObjectType) {
        GameObjectType[GameObjectType["PLAYER"] = 0] = "PLAYER";
        GameObjectType[GameObjectType["SKELETON"] = 1] = "SKELETON";
    })(GameObjects.GameObjectType || (GameObjects.GameObjectType = {}));
    var GameObjectType = GameObjects.GameObjectType;
})(GameObjects || (GameObjects = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameStates;
(function (GameStates) {
    var TiledMapLoader = (function (_super) {
        __extends(TiledMapLoader, _super);
        function TiledMapLoader(game, state) {
            _super.call(this);
            this.game = game;
            this.mapName = state.mapName;
            this.mapURL = state.mapURL;
            this.StateToStart = state;
            this.mapCacheKey = Phaser.Plugin.Tiled.utils.cacheKey(this.mapName, 'tiledmap');
        }
        TiledMapLoader.prototype.preload = function () {
            this.snek = this.game.add.sprite(this.game.width / 2, this.game.height / 2, "Snek", 11);
            this.snek.anchor.set(0.5);
            this.snek.scale.set(11);
            this.snek.animations.add("Load", [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], 15, true);
            this.snek.animations.play("Load");
            if (gameVar.songManager == null) {
                SongManager.SongManager.load(this.game);
            }
            this.game.camera.scale.setTo(1, 1);
            this.game.load.tiledmap(this.mapCacheKey, this.StateToStart.mapURL, null, Phaser.Tilemap.TILED_JSON);
            this.StateToStart.customPreload();
            this.game.load.onFileComplete.add(this.fileCompleted, this);
        };
        TiledMapLoader.prototype.create = function () {
            if (gameVar.songManager == null)
                gameVar.songManager = new SongManager.SongManager(this.game);
            this.game.state.add(this.StateToStart.mapName, this.StateToStart, false);
            this.game.state.start(this.StateToStart.mapName, true, false);
        };
        TiledMapLoader.prototype.fileCompleted = function (progress, cacheKey) {
            if (cacheKey == this.mapCacheKey) {
                var cacheKeyFunc = Phaser.Plugin.Tiled.utils.cacheKey;
                var tileSets = this.game.cache.getTilemapData(this.mapCacheKey).data.tilesets;
                for (var n = 0; n < tileSets.length; n++) {
                    var currentSet = tileSets[n];
                    this.game.load.image(cacheKeyFunc(cacheKey.slice(0, -9), 'tileset', currentSet.name), 'maps/' + currentSet.image);
                }
            }
        };
        TiledMapLoader.prototype.shutdown = function () {
            this.game.load.onFileComplete.remove(this.fileCompleted, this);
            this.game.state.remove('TiledMapLoader');
            this.snek.destroy(true);
        };
        return TiledMapLoader;
    })(Phaser.State);
    GameStates.TiledMapLoader = TiledMapLoader;
})(GameStates || (GameStates = {}));
var SongManager;
(function (SongManager_1) {
    var SongManager = (function () {
        function SongManager(game) {
            this.game = game;
            this.currentSongNumb = 1;
            this.playList = [];
            this.playList[0] = game.add.audio('Pershdal-Dung', 0.3, false);
            this.playList[0].play().onStop.add(this.next, this);
            this.playList[1] = game.add.audio('Vines', 0.45, false);
            this.playList[2] = game.add.audio('The-Final-Choice', 0.3, false);
            this.playList[3] = game.add.audio('An-Alternate-Demonsion', 0.3, false);
            this.playList[4] = game.add.audio('I-Have-a-Bone-to-Pick-with-You', 0.3, false);
        }
        SongManager.prototype.next = function () {
            this.playList[this.currentSongNumb].play().onStop.add(this.next, this);
            this.currentSongNumb = (this.currentSongNumb + 1) % this.playList.length;
        };
        SongManager.load = function (game) {
            game.load.audio('Pershdal-Dung', 'sounds/mp3/Pershdal Dungeons.mp3');
            game.load.audio('Vines', 'sounds/mp3/HollywoodVines.mp3');
            game.load.audio('The-Final-Choice', 'sounds/mp3/The Final Choice.mp3');
            game.load.audio('An-Alternate-Demonsion', 'sounds/mp3/An Alternate Demonsion.mp3');
            game.load.audio('I-Have-a-Bone-to-Pick-with-You', 'sounds/mp3/I Have a Bone to Pick with You.mp3');
        };
        return SongManager;
    })();
    SongManager_1.SongManager = SongManager;
})(SongManager || (SongManager = {}));
var DataStructures;
(function (DataStructures) {
    var Queue = (function () {
        function Queue() {
            this.head = null;
        }
        Queue.prototype.add = function (item) {
            var newNode = new Node(item);
            if (this.head == null) {
                this.head = newNode;
                this.tail = newNode;
                return;
            }
            this.tail.next = newNode;
            this.tail = newNode;
        };
        Queue.prototype.addMultiple = function (itemArray) {
            for (var index in itemArray) {
                this.add(itemArray[index]);
            }
        };
        Queue.prototype.pop = function () {
            if (this.head == null)
                return null;
            var tempHead = this.head;
            this.head = this.head.next;
            if (this.head == null)
                this.tail = null;
            return tempHead.element;
        };
        Queue.prototype.size = function () {
            if (this.head == null) {
                return 0;
            }
            var currentNode = this.head, counter = 1;
            while (currentNode.next != null) {
                currentNode = currentNode.next;
                counter++;
            }
            return counter;
        };
        Queue.prototype.isEmpty = function () {
            return this.head == null;
        };
        return Queue;
    })();
    DataStructures.Queue = Queue;
    var Node = (function () {
        function Node(item) {
            this.element = item;
            this.next = null;
        }
        return Node;
    })();
    DataStructures.Node = Node;
})(DataStructures || (DataStructures = {}));
var Pathfinding;
(function (Pathfinding_1) {
    var Queue = DataStructures.Queue;
    var Pathfinding = (function () {
        function Pathfinding(game, map, layer, parent) {
            this.game = game;
            this.map = map;
            this.layer = layer;
            this.parent = parent;
            this.nodeIDCounter = 0;
            this.graphics = this.game.add.graphics(0, 0);
            this.stepRate = 4;
            this.blocks = [];
        }
        Pathfinding.prototype.setupPathfinding = function (x, y) {
            for (var i = 0; i < this.layer.bodies.length; i++) {
                var block = Collision.CollisionBlock.createFromBody(this.layer.bodies[i]);
                if (block != null) {
                    this.blocks.push(block);
                }
            }
            this.setupNodes(2, 2);
            this.stepRate = 1;
            this.setupConnections(0, 0);
            this.stepRate = 4;
            this.removeUnnecessaryNodes(x, y);
        };
        Pathfinding.prototype.setupNodes = function (deltaX, deltaY) {
            var layerWidth = this.layer.size['x'], tiles = this.layer.tileIds, coordsOutput = [], map = Collision.getPropMap(tiles, layerWidth, this.parent.getGidOfTileset("Collision").firstgid), xCoord, yCoord, nodeOptions, newNode, curBlock;
            for (var index = 0; index < tiles.length; index++) {
                if (tiles[index] != 0) {
                    xCoord = index % layerWidth;
                    yCoord = Math.floor(index / layerWidth);
                    nodeOptions = Collision.tileCornerWaypoint(xCoord, yCoord, map, deltaX, deltaY);
                    curBlock = null;
                    for (var i = 0; i < this.blocks.length; i++) {
                        if (this.blocks[i].AABB(xCoord * 16, yCoord * 16, xCoord * 16 + 15, yCoord * 16 + 15))
                            curBlock = this.blocks[i];
                    }
                    if (curBlock == null)
                        throw new Error("woops this place shouldn't exist");
                    if (nodeOptions[0]) {
                        newNode = new Node((xCoord * 16) + map[yCoord][xCoord].leftX - deltaX, (yCoord * 16) + map[yCoord][xCoord].upperY - deltaY, this, curBlock, 0);
                        coordsOutput.push(newNode);
                        curBlock.nodes[0] = newNode;
                    }
                    if (nodeOptions[1]) {
                        newNode = new Node((xCoord * 16) + map[yCoord][xCoord].rightX + deltaX, (yCoord * 16) + map[yCoord][xCoord].upperY - deltaY, this, curBlock, 1);
                        coordsOutput.push(newNode);
                        curBlock.nodes[1] = newNode;
                    }
                    if (nodeOptions[2]) {
                        newNode = new Node((xCoord * 16) + map[yCoord][xCoord].rightX + deltaX, (yCoord * 16) + map[yCoord][xCoord].lowerY + deltaY, this, curBlock, 2);
                        coordsOutput.push(newNode);
                        curBlock.nodes[2] = newNode;
                    }
                    if (nodeOptions[3]) {
                        newNode = new Node((xCoord * 16) + map[yCoord][xCoord].leftX - deltaX, (yCoord * 16) + map[yCoord][xCoord].lowerY + deltaY, this, curBlock, 3);
                        coordsOutput.push(newNode);
                        curBlock.nodes[3] = newNode;
                    }
                }
            }
            this.nodeList = coordsOutput;
        };
        Pathfinding.prototype.setupConnections = function (deltaX, deltaY) {
            for (var i = 0; i < this.nodeList.length; i++) {
                for (var j = i + 1; j < this.nodeList.length; j++) {
                    if (!this.raycastLine(new Phaser.Line(this.nodeList[i].x, this.nodeList[i].y, this.nodeList[j].x, this.nodeList[j].y), deltaX, deltaY)) {
                        this.nodeList[i].connectTo(this.nodeList[j]);
                    }
                }
            }
        };
        Pathfinding.prototype.drawNodes = function (graphics) {
            graphics.lineStyle(0);
            graphics.beginFill(0xAB482C, 0.8);
            for (var i = 0; i < this.nodeList.length; i++) {
                graphics.drawCircle(this.nodeList[i].x, this.nodeList[i].y, 3);
            }
            graphics.endFill();
        };
        Pathfinding.prototype.removeNode = function (node) {
            for (var index = 0; index < this.nodeList.length; index++) {
                if (node.nodeID == this.nodeList[index].nodeID) {
                    this.nodeList.splice(index, 1);
                    node.disconnectAll();
                    return true;
                }
            }
            return false;
        };
        Pathfinding.prototype.removeMultipleNodes = function (list) {
            for (var index = 0; index < list.length; index++) {
                this.removeNode(list[index]);
            }
        };
        Pathfinding.prototype.removeUnnecessaryNodes = function (x, y) {
            var startingNode = null;
            for (var startNodeIndex = 0; startNodeIndex < this.nodeList.length; startNodeIndex++) {
                if (!this.raycastLine(new Phaser.Line(x, y, this.nodeList[startNodeIndex].x, this.nodeList[startNodeIndex].y), 0, 0)) {
                    startingNode = this.nodeList[startNodeIndex];
                    break;
                }
            }
            if (startingNode == null)
                return;
            var visitedNodes = {}, nodeQueue = new Queue(), currentNode;
            nodeQueue.add(startingNode);
            while (!nodeQueue.isEmpty()) {
                currentNode = nodeQueue.pop();
                for (var index = 0; index < currentNode.connections.length; index++) {
                    if (!(currentNode.connections[index].nodeID in visitedNodes)) {
                        nodeQueue.add(currentNode.connections[index]);
                    }
                }
                visitedNodes[currentNode.nodeID] = true;
            }
            var nodesToRemove = [];
            for (var nodeIndex = 0; nodeIndex < this.nodeList.length; nodeIndex++) {
                if (!(this.nodeList[nodeIndex].nodeID in visitedNodes)) {
                    nodesToRemove.push(this.nodeList[nodeIndex]);
                }
            }
            this.removeMultipleNodes(nodesToRemove);
        };
        Pathfinding.prototype.drawConnections = function (graphics) {
            var usedConnections = {}, currentNode;
            graphics.beginFill();
            graphics.lineStyle(0.3, 0xFF00FF, 1);
            for (var i = 0; i < this.nodeList.length; i++) {
                for (var j = 0; j < this.nodeList[i].connections.length; j++) {
                    currentNode = this.nodeList[i].connections[j];
                    if (!(currentNode.nodeID in usedConnections)) {
                        graphics.moveTo(this.nodeList[i].x, this.nodeList[i].y);
                        graphics.lineTo(currentNode.x, currentNode.y);
                    }
                }
                usedConnections[this.nodeList[i].nodeID] = true;
            }
            graphics.endFill();
        };
        Pathfinding.prototype.raycastLine = function (line, deltaX, deltaY) {
            var currentBody, coords = [];
            line.coordinatesOnLine(4, coords);
            for (var i = 0; i < this.blocks.length; i++) {
                currentBody = this.blocks[i];
                var minX = currentBody.minX - deltaX, maxX = currentBody.maxX + deltaX, minY = currentBody.minY - deltaY, maxY = currentBody.maxY + deltaY;
                if (!(Math.max(line.start.x, line.end.x) < minX || maxX < Math.min(line.start.x, line.end.x)
                    || Math.max(line.start.y, line.end.y) < minY || maxY < Math.min(line.start.y, line.end.y))) {
                    for (var coordIndex = 0; coordIndex < coords.length; coordIndex++) {
                        if (Pathfinding.containsPoint([minX, minY, maxX, maxY], coords[coordIndex][0], coords[coordIndex][1]))
                            return true;
                    }
                }
            }
            return false;
        };
        Pathfinding.prototype.debugVisibleNodes = function (x, y, graphics) {
            graphics.beginFill();
            graphics.lineStyle(0.3, 0x287994);
            var line = new Phaser.Line();
            for (var i = 0; i < this.nodeList.length; i++) {
                line.start.setTo(this.nodeList[i].x, this.nodeList[i].y);
                line.end.setTo(x, y);
                if (!this.raycastLine(line, 0, 0)) {
                    graphics.moveTo(this.nodeList[i].x, this.nodeList[i].y);
                    graphics.lineTo(x, y);
                }
            }
            graphics.endFill();
        };
        Pathfinding.containsPoint = function (rectangle, x, y) {
            return !(x < rectangle[0] || y < rectangle[1] || x > rectangle[2] || y > rectangle[3]);
        };
        return Pathfinding;
    })();
    Pathfinding_1.Pathfinding = Pathfinding;
    var Node = (function () {
        function Node(x, y, pathFinder, block, direction) {
            this.x = x;
            this.y = y;
            this.connections = [];
            this.nodeID = pathFinder.nodeIDCounter;
            pathFinder.nodeIDCounter++;
            this.block = block;
            this.direction = direction;
        }
        Node.prototype.connectTo = function (node) {
            this.connections.push(node);
            node.connections.push(this);
        };
        Node.prototype.disconnect = function (node) {
            for (var index = 0; index < this.connections.length; index++) {
                if (this.connections[index].nodeID == node.nodeID) {
                    this.connections.splice(index, 1);
                    return;
                }
            }
        };
        Node.prototype.disconnectAll = function () {
            for (var i = 0; i < this.connections.length; i++) {
                this.connections[i].disconnect(this);
            }
        };
        return Node;
    })();
    Pathfinding_1.Node = Node;
})(Pathfinding || (Pathfinding = {}));
var Entities;
(function (Entities) {
    var GameObjectType = GameObjects.GameObjectType;
    var AnimManager = Manager.AnimManager;
    var AnimType = Manager.AnimType;
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, currentLevel, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.objectType = GameObjectType.PLAYER;
            this.currentLevel = currentLevel;
            this.baseMoveSpeed = 55;
            this.moveSpeedMod = 1;
            this.canAttack = true;
            this.attackDelay = 800;
            this.keyListener = UtilFunctions.setupPlayerKeys(this.game);
            this.game.physics.p2.enable(this);
            this.anchor.setTo(0.5, 0.5);
            this.body.clearShapes();
            this.body.fixedRotation = true;
            this.body.addRectangle(14, 5, 0, 16, 0);
            this.hitBox = this.body.addRectangle(14, 30, 0, 0, 0);
            this.hitBox.sensor = true;
            this.body.mass *= 20;
            this.AnimManager = new AnimManager(this, { 'Attack': [30, 31, 32, 33, 34, 35, 35, 34, 33, 32, 31] });
            this.AnimManager.attackSignal.add(function () {
                this.moveSpeedMod += 0.6;
            }, this);
        }
        Player.prototype.update = function () {
            this.updateMoveSpeed();
            this.updateMovementControl();
        };
        Player.prototype.updateMoveSpeed = function () {
            this.moveSpeed = this.baseMoveSpeed * this.moveSpeedMod;
        };
        Player.prototype.updateMovementControl = function () {
            this.body.setZeroVelocity();
            var ang = 0;
            if (this.keyListener['s'].isDown) {
                ang -= 3;
            }
            if (this.keyListener['w'].isDown) {
                ang += 3;
            }
            if (this.keyListener['d'].isDown) {
                ang += 1;
            }
            if (this.keyListener['a'].isDown) {
                ang -= 1;
            }
            var diagSpeed = this.moveSpeed * 0.7071, anim = AnimType.IDLE;
            switch (ang) {
                case 4:
                    anim = AnimType.RIGHT;
                    this.body.moveRight(diagSpeed);
                    this.body.moveUp(diagSpeed);
                    break;
                case 1:
                    anim = AnimType.RIGHT;
                    this.body.moveRight(this.moveSpeed);
                    break;
                case -2:
                    anim = AnimType.RIGHT;
                    this.body.moveRight(diagSpeed);
                    this.body.moveDown(diagSpeed);
                    break;
                case -3:
                    anim = AnimType.UPDOWN;
                    this.body.moveDown(this.moveSpeed);
                    break;
                case -4:
                    anim = AnimType.LEFT;
                    this.body.moveLeft(diagSpeed);
                    this.body.moveDown(diagSpeed);
                    break;
                case -1:
                    anim = AnimType.LEFT;
                    this.body.moveLeft(this.moveSpeed);
                    break;
                case 2:
                    anim = AnimType.LEFT;
                    this.body.moveLeft(diagSpeed);
                    this.body.moveUp(diagSpeed);
                    break;
                case 3:
                    anim = AnimType.UPDOWN;
                    this.body.moveUp(this.moveSpeed);
                    break;
            }
            if (this.keyListener['space'].isDown && this.canAttack) {
                return this.attack();
            }
            this.AnimManager.updateAnimation(anim);
        };
        Player.prototype.attack = function () {
            this.AnimManager.attack(-1);
            var timer = this.game.time.add(new Phaser.Timer(this.game, true));
            timer.add(this.attackDelay, function () {
                this.canAttack = true;
            }, this);
            timer.start();
            this.canAttack = false;
            this.moveSpeedMod -= 0.6;
        };
        return Player;
    })(Phaser.Sprite);
    Entities.Player = Player;
})(Entities || (Entities = {}));
var Collision;
(function (Collision) {
    var CollisionManager = (function () {
        function CollisionManager(parent, map, layer) {
            this.parent = parent;
            this.map = map;
            this.layer = layer;
            this.game = parent.game;
            this.startPos = [0, 0];
        }
        CollisionManager.prototype.start = function (debug) {
            this.setupSolidLayer(debug);
            this.triggerSetup(debug);
        };
        CollisionManager.prototype.startPathfinding = function (debug) {
            this.pathFinding = new Pathfinding.Pathfinding(this.game, this.map, this.layer, this);
            this.pathFinding.setupPathfinding(this.parent.player.x, this.parent.player.y + 16);
            if (debug) {
                this.pathFinding.drawNodes(this.pathFinding.graphics);
                this.pathFinding.drawConnections(this.pathFinding.graphics);
            }
        };
        CollisionManager.prototype.setupSolidLayer = function (debug) {
            if (this.layer == null)
                return;
            this.layer.visible = false;
            var layerTiles = this.layer.tileIds, layerlength = layerTiles.length, mapWidth = this.layer.size['x'], mapHeight = this.layer.size['y'], solidTileset = this.getGidOfTileset("Collision"), usedTiles = {}, x, y;
            if (solidTileset == null)
                return console.log('There is no collision tileset');
            var solidFirstGid = solidTileset.firstgid, solidLastGid = solidTileset.lastgid, propsMap = Collision.getPropMap(layerTiles, mapWidth, solidFirstGid);
            for (var index = 0; index < layerlength; index++) {
                if (layerTiles[index] == solidFirstGid && !(index in usedTiles)) {
                    x = index % mapWidth;
                    y = Math.floor(index / mapWidth);
                    var curY = y, maxWidth = mapWidth - 1, curBestRect = [1, x, y, x, y];
                    while (curY < mapHeight && layerTiles[curY * mapWidth + x] == solidFirstGid && !(curY * mapWidth + x in usedTiles)) {
                        var curX = x, curYIndex = curY * mapWidth, surface;
                        while (curX < maxWidth && layerTiles[curYIndex + curX + 1] == solidFirstGid && !(curYIndex + curX + 1 in usedTiles)) {
                            curX++;
                        }
                        maxWidth = curX;
                        surface = (curX - x + 1) * (curY - y + 1);
                        if (surface > curBestRect[0]) {
                            curBestRect = [surface, x, y, curX, curY];
                        }
                        curY++;
                    }
                    var xPixel = curBestRect[1] * this.map.tileWidth, yPixel = curBestRect[2] * this.map.tileHeight, xEndPixel = (curBestRect[3] + 1) * this.map.tileWidth, yEndPixel = (curBestRect[4] + 1) * this.map.tileHeight, body = this.game.physics.p2.createBody(xPixel, yPixel, 0, false);
                    body.addPolygon({}, [[0, 0], [xEndPixel - xPixel, 0], [xEndPixel - xPixel, yEndPixel - yPixel], [0, yEndPixel - yPixel]]);
                    body.debug = debug;
                    this.game.physics.p2.addBody(body);
                    this.layer.bodies.push(body);
                    for (var usedY = y; usedY <= curBestRect[4]; usedY++) {
                        var yIndex = mapWidth * usedY;
                        for (var usedX = x; usedX <= curBestRect[3]; usedX++) {
                            usedTiles[yIndex + usedX] = null;
                        }
                    }
                }
                else if (layerTiles[index] >= solidFirstGid && layerTiles[index] <= solidLastGid && !(index in usedTiles)) {
                    x = index % mapWidth;
                    y = Math.floor(index / mapWidth);
                    this.customBody(debug, x, y, propsMap);
                }
            }
        };
        CollisionManager.prototype.customBody = function (debug, x, y, propMap) {
            var xPixel = x * this.map.tileWidth, yPixel = y * this.map.tileHeight, props = propMap[y][x], body = this.game.physics.p2.createBody(xPixel + props.leftX, yPixel + props.upperY, 0, false);
            body.addPolygon({}, [[0, 0], [props.rightX - props.leftX, 0],
                [props.rightX - props.leftX, props.lowerY - props.upperY], [0, props.lowerY - props.upperY]]);
            body.debug = debug;
            this.game.physics.p2.addBody(body);
            this.layer.bodies.push(body);
        };
        CollisionManager.prototype.getGidOfTileset = function (name) {
            for (var tilesetId = 0; tilesetId < this.map.tilesets.length; tilesetId++) {
                if (this.map.tilesets[tilesetId].name == name) {
                    return this.map.tilesets[tilesetId];
                }
            }
            return null;
        };
        CollisionManager.prototype.triggerSetup = function (debug) {
            var tLayer = this.map.getTilelayer("Trigger");
            if (tLayer == null)
                return;
            tLayer.visible = false;
            var tiles = tLayer.tileIds, layerlength = tiles.length, mapWidth = tLayer.size['x'], tTileSet = this.getGidOfTileset("Trigger"), curID, x, y;
            if (tTileSet == null)
                return;
            var fGid = tTileSet.firstgid, lGid = tTileSet.lastgid;
            for (var i = 0; i < layerlength; i++) {
                if (tiles[i] < fGid && tiles[i] > lGid)
                    continue;
                curID = tiles[i] - fGid;
                x = i % mapWidth;
                y = Math.floor(i / mapWidth);
                switch (curID) {
                    case 0:
                        var nextLevelBody = this.game.physics.p2.createBody(x * this.map.tileWidth, y * this.map.tileHeight, 0, false);
                        nextLevelBody.addPolygon({}, [[0, 0], [this.map.tileWidth - 1, 0],
                            [this.map.tileWidth - 1, this.map.tileHeight - 1], [0, this.map.tileHeight - 1]]);
                        nextLevelBody.onBeginContact.add(this.parent.nextLevel, this.parent);
                        nextLevelBody.debug = debug;
                        this.game.physics.p2.addBody(nextLevelBody);
                        tLayer.bodies.push(nextLevelBody);
                        break;
                    case 1:
                        this.startPos = [x * this.map.tileWidth + 8, y * this.map.tileHeight - 15];
                        break;
                    case 5:
                        var skeleton = new Entities.Skeleton(this.game, x * 16 + 8, y * 16 - 4, this.parent, "Skeleton", 0);
                        this.map.getTilelayer("Player").add(skeleton);
                        this.parent.mobs.push(skeleton);
                        break;
                }
            }
        };
        return CollisionManager;
    })();
    Collision.CollisionManager = CollisionManager;
})(Collision || (Collision = {}));
var GameLevels;
(function (GameLevels) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level(game, map) {
            _super.call(this);
            this.game = game;
            this.mapName = map;
            this.mapURL = 'maps/' + map + '.json';
            this.mobs = [];
        }
        Level.prototype.customPreload = function () {
            this.game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
            this.game.load.spritesheet('Skeleton', 'images/dungeon/skeleton.png', 32, 32);
        };
        Level.prototype.create = function () {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.map = this.game.add.tiledmap(this.mapName);
            this.game.time.advancedTiming = true;
            this.colManager = new Collision.CollisionManager(this, this.map, this.map.getTilelayer('Solid'));
            this.colManager.start(false);
            this.player = new Entities.Player(this.game, this.colManager.startPos[0], this.colManager.startPos[1], this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(Math.max(1.5, 6 - (Math.round(3840 / this.game.width) / 2)));
            this.graphics = this.game.add.graphics(0, 0);
            this.colManager.startPathfinding(false);
        };
        Level.prototype.update = function () {
            this.map.getTilelayer("Player").sort("y", Phaser.Group.SORT_ASCENDING);
        };
        Level.prototype.nextLevel = function (body, bodyB, collidedShape, contactShape) {
            if (!contactShape.sensor && body.data.id == this.player.body.data.id) {
                var nextLvl = MyGame.Game.getNextLevel(this.mapName);
                if (nextLvl == null)
                    return;
                UtilFunctions.loadGameLevel(this.game, new Level(this.game, nextLvl));
            }
        };
        Level.prototype.render = function () {
            this.graphics.clear();
            this.graphics.beginFill();
            this.graphics.lineStyle(0.3, 0xFF00FF, 1);
            for (var i = 0; i < this.mobs.length; i++) {
                if (this.mobs[i].path[0] == null)
                    continue;
                this.graphics.moveTo(this.mobs[i].x, this.mobs[i].y + 16);
                this.graphics.lineTo(this.mobs[i].path[0].x, this.mobs[i].path[0].y);
            }
            this.graphics.endFill();
        };
        return Level;
    })(Phaser.State);
    GameLevels.Level = Level;
})(GameLevels || (GameLevels = {}));
var gameVar;
var MyGame;
(function (MyGame) {
    var Game = (function () {
        function Game(width, height) {
            this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create }, false, false);
            this.songManager = null;
        }
        Game.prototype.preload = function () {
            this.game.add.plugin(new Phaser.Plugin.Tiled(this.game, this.game.stage));
            this.game.add.plugin(new Phaser.Plugin.Debug(this.game, this.game.stage));
            this.game.load.spritesheet("Snek", "images/dungeon/Snaksprite.png", 32, 32);
        };
        Game.prototype.create = function () {
            UtilFunctions.loadGameLevel(this.game, new GameLevels.Level(this.game, Game.getNextLevel("Start")));
        };
        Game.getNextLevel = function (name) {
            var levelList = ["Level1", "Level2", "Level3", "Level4", "Level5", "Level6", "LevelEnd"];
            if (name == "Start")
                return levelList[0];
            for (var i = 0; i < levelList.length - 1; i++) {
                if (levelList[i] == name)
                    return levelList[i + 1];
            }
            return null;
        };
        return Game;
    })();
    MyGame.Game = Game;
})(MyGame || (MyGame = {}));
window.onload = function () {
    var winW = window.innerWidth;
    var winH = window.innerHeight;
    var widthAspectRatio = 16;
    var heightAspectRatio = 9;
    var aspectMultiplier = Math.min(winW / widthAspectRatio, winH / heightAspectRatio);
    gameVar = new MyGame.Game(aspectMultiplier * widthAspectRatio, aspectMultiplier * heightAspectRatio);
};
var Collision;
(function (Collision) {
    var CollisionBlock = (function () {
        function CollisionBlock(minX, maxX, minY, maxY, x, y) {
            this.minX = minX;
            this.maxX = maxX;
            this.minY = minY;
            this.maxY = maxY;
            this.x = x;
            this.y = y;
            this.nodes = [];
        }
        CollisionBlock.prototype.AABB = function (xMin, yMin, xMax, yMax) {
            return !(xMax < this.minX || yMax < this.minY || xMin > this.maxX || yMin > this.maxY);
        };
        CollisionBlock.createFromBody = function (childBody) {
            if (childBody.data.concavePath == null)
                return null;
            var halfWidth = childBody.data.concavePath[0][0] / 0.05, halfHeight = childBody.data.concavePath[0][1] / 0.05;
            return new CollisionBlock(childBody.x - halfWidth, childBody.x + halfWidth, childBody.y - halfHeight, childBody.y + halfHeight, childBody.x, childBody.y);
        };
        return CollisionBlock;
    })();
    Collision.CollisionBlock = CollisionBlock;
})(Collision || (Collision = {}));
var UtilFunctions;
(function (UtilFunctions) {
    var Coords = (function () {
        function Coords(x, y) {
            this.x = x;
            this.y = y;
        }
        return Coords;
    })();
    UtilFunctions.Coords = Coords;
})(UtilFunctions || (UtilFunctions = {}));
var Entities;
(function (Entities) {
    var GameObjectType = GameObjects.GameObjectType;
    var AnimManager = Manager.AnimManager;
    var AnimType = Manager.AnimType;
    var Skeleton = (function (_super) {
        __extends(Skeleton, _super);
        function Skeleton(game, x, y, currentLevel, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.objectType = GameObjectType.SKELETON;
            this.currentLevel = currentLevel;
            this.baseMoveSpeed = 40;
            this.moveSpeedMod = 1;
            this.canAttack = true;
            this.attackDelay = 800;
            this.path = [];
            this.isRoaming = false;
            this.game.physics.p2.enable(this);
            this.anchor.setTo(0.5, 0.5);
            this.body.clearShapes();
            this.body.mass *= 5;
            this.body.fixedRotation = true;
            this.body.addRectangle(14, 5, 0, 16, 0);
            this.hitBox = this.body.addRectangle(14, 30, 0, 0, 0);
            this.hitBox.sensor = true;
            this.AnimManager = new AnimManager(this, { 'Attack': [30, 31, 32, 33, 34, 35, 38, 39] });
            this.AnimManager.attackSignal.add(function () {
                this.moveSpeedMod += 0.6;
            }, this);
        }
        Skeleton.prototype.update = function () {
            this.body.setZeroVelocity();
            this.updateMoveSpeed();
            this.updateAI(this.currentLevel.colManager.pathFinding);
            if (this.path[0] != null) {
                this.followPath();
                var deltaX = this.x - this.path[0].x, deltaY = (this.y + 16) - this.path[0].y;
                if (deltaX * deltaX + deltaY * deltaY < 300) {
                    if (this.canAttack) {
                        this.AnimManager.updateAnimation(AnimType.ATTACK);
                        this.attack();
                    }
                }
            }
            else {
                this.AnimManager.updateAnimation(AnimType.IDLE);
            }
        };
        Skeleton.prototype.followPath = function () {
            var angleBetween = Math.atan2(this.path[0].x - this.x, this.path[0].y - (this.y + 16)), deltaY = Math.cos(angleBetween), deltaX = Math.sin(angleBetween);
            this.body.moveRight(deltaX * this.moveSpeed);
            this.body.moveDown(deltaY * this.moveSpeed);
            if (deltaX > 0)
                this.AnimManager.updateAnimation(AnimType.RIGHT);
            else if (deltaX < 0)
                this.AnimManager.updateAnimation(AnimType.LEFT);
            else {
                if (deltaY == 0)
                    this.AnimManager.updateAnimation(AnimType.IDLE);
                else
                    this.AnimManager.updateAnimation(AnimType.UPDOWN);
            }
        };
        Skeleton.prototype.updateMoveSpeed = function () {
            this.moveSpeed = this.baseMoveSpeed * this.moveSpeedMod;
        };
        Skeleton.prototype.attack = function () {
            this.AnimManager.attack(20);
            var timer = this.game.time.add(new Phaser.Timer(this.game, true));
            timer.add(this.attackDelay, function () {
                this.canAttack = true;
            }, this);
            timer.start();
            this.canAttack = false;
            this.moveSpeedMod -= 0.6;
        };
        Skeleton.prototype.updateAI = function (pathFinding) {
            var line = new Phaser.Line(this.x, this.y + 16, this.currentLevel.player.x, this.currentLevel.player.y + 16);
            if (!pathFinding.raycastLine(line, 6.5, 2)) {
                this.path = [new UtilFunctions.Coords(this.currentLevel.player.x, this.currentLevel.player.y + 16)];
            }
            else {
                this.path = [];
            }
        };
        return Skeleton;
    })(Phaser.Sprite);
    Entities.Skeleton = Skeleton;
})(Entities || (Entities = {}));
//# sourceMappingURL=generated.js.map