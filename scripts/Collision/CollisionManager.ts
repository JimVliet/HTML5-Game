/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../GameObjects.ts"/>
/// <reference path="Pathfinding.ts"/>
/// <reference path="CollisionTiles.ts"/>

module Collision
{
    import Level = GameLevels.Level;
    export class CollisionManager
    {
        game: Phaser.Game;
        pathFinding: Pathfinding.Pathfinding;
        startPos: [number, number];

        constructor(public parent: Level, public map: Phaser.Plugin.Tiled.Tilemap, public layer: Phaser.Plugin.Tiled.Tilelayer)
        {
            this.game = parent.game;
            this.startPos = [0, 0];
        }

        start(debug: boolean)
        {
            this.setupSolidLayer(debug);
            this.triggerSetup(debug);
        }

        startPathfinding(debug: boolean)
        {
            this.pathFinding = new Pathfinding.Pathfinding(this.game, this.map, this.layer, this);
            this.pathFinding.setupPathfinding(this.parent.player.x, this.parent.player.y + 16);

            if(debug)
            {
                this.pathFinding.drawNodes(this.pathFinding.graphics);
                this.pathFinding.drawConnections(this.pathFinding.graphics);
            }
        }

        setupSolidLayer(debug: boolean)
        {
            if(this.layer == null)
                return;

            this.layer.visible = false;

            //Declare variables
            var layerTiles = this.layer.tileIds,
                layerlength = layerTiles.length,
                mapWidth = this.layer.size['x'],
                mapHeight = this.layer.size['y'],
                solidTileset = this.getGidOfTileset("Collision"),
                usedTiles = {},
                x, y;

            //Check if the solidID is valid
            if(solidTileset == null) return console.log('There is no collision tileset');
            var solidFirstGid = solidTileset.firstgid,
                solidLastGid = solidTileset.lastgid,
                propsMap: Array<Array<ColTileProps>> = Collision.getPropMap(layerTiles, mapWidth, solidFirstGid);

            //Area and the x,y coords and the current x,y coords
            type bestRect = [number, number, number, number, number];

            for (var index = 0; index < layerlength; index++)
            {
                //Check if the tileID is the first tile in the solidTileSet
                if(layerTiles[index] == solidFirstGid && !(index in usedTiles))
                {
                    x = index % mapWidth;
                    y = Math.floor(index / mapWidth);

                    var curY = y,
                        maxWidth = mapWidth - 1,
                        curBestRect: bestRect = [1, x, y, x, y];

                    while(curY < mapHeight && layerTiles[curY*mapWidth + x] == solidFirstGid && !(curY*mapWidth + x in usedTiles))
                    {
                        var curX = x,
                            curYIndex = curY * mapWidth,
                            surface;

                        //Check if the tile isn't outside the map and if it's a wall and if it isn't already used
                        while(curX < maxWidth && layerTiles[curYIndex + curX + 1] == solidFirstGid && !(curYIndex+curX+1 in usedTiles))
                        {
                            curX++;
                        }
                        maxWidth = curX;
                        surface = (curX - x + 1) * (curY - y + 1);
                        if(surface > curBestRect[0])
                        {
                            curBestRect = [surface, x, y, curX, curY];
                        }
                        curY++;
                    }

                    var xPixel = curBestRect[1] * this.map.tileWidth,
                        yPixel = curBestRect[2] * this.map.tileHeight,
                        xEndPixel = (curBestRect[3]+1) * this.map.tileWidth,
                        yEndPixel = (curBestRect[4]+1) * this.map.tileHeight,
                        body = this.game.physics.p2.createBody(xPixel, yPixel, 0, false);

                    body.addPolygon({}, [[0, 0], [xEndPixel-xPixel, 0], [xEndPixel-xPixel,yEndPixel-yPixel], [0, yEndPixel-yPixel]]);
                    //body.addRectangle(xEndPixel - xPixel, yEndPixel - yPixel, (xEndPixel - xPixel)/2, (yEndPixel - yPixel)/2, 0);
                    body.debug = debug;
                    this.game.physics.p2.addBody(body);
                    this.layer.bodies.push(body);

                    //Update usedTiles list
                    for(var usedY = y; usedY <= curBestRect[4]; usedY++)
                    {
                        var yIndex = mapWidth * usedY;
                        for(var usedX = x; usedX <= curBestRect[3]; usedX++)
                        {
                            usedTiles[yIndex+usedX] = null;
                        }
                    }
                }
                else if (layerTiles[index] >= solidFirstGid && layerTiles[index] <= solidLastGid && !(index in usedTiles))
                {
                    x = index % mapWidth;
                    y = Math.floor(index / mapWidth);
                    this.customBody(debug, x, y, propsMap);
                }
            }
        }

        customBody(debug: boolean, x: number, y: number, propMap:Array<Array<ColTileProps>>)
        {
            var xPixel = x * this.map.tileWidth,
                yPixel = y * this.map.tileHeight,
                props = propMap[y][x],
                body = this.game.physics.p2.createBody(xPixel + props.leftX, yPixel + props.upperY, 0, false);


            body.addPolygon({}, [[0,0], [props.rightX-props.leftX, 0],
                [props.rightX-props.leftX, props.lowerY-props.upperY], [0, props.lowerY-props.upperY]]);
            body.debug = debug;
            this.game.physics.p2.addBody(body);
            this.layer.bodies.push(body);
        }

        getGidOfTileset(name: string): Phaser.Plugin.Tiled.Tileset
        {
            for(var tilesetId = 0; tilesetId < this.map.tilesets.length; tilesetId++)
            {
                if(this.map.tilesets[tilesetId].name == name)
                {
                    return this.map.tilesets[tilesetId];
                }
            }
            return null;
        }

        triggerSetup(debug: boolean)
        {
            var tLayer = this.map.getTilelayer("Trigger");
            if(tLayer == null)
                return;

            tLayer.visible = false;
            var tiles = tLayer.tileIds,
                layerlength = tiles.length,
                mapWidth = tLayer.size['x'],
                tTileSet = this.getGidOfTileset("Trigger"),
                curID, x, y;

            if(tTileSet == null)
                return;
            var fGid = tTileSet.firstgid,
                lGid = tTileSet.lastgid;


            for (var i = 0; i < layerlength; i++)
            {
                if(tiles[i] < fGid && tiles[i] > lGid)
                    continue;
                curID = tiles[i] - fGid;
                x = i % mapWidth;
                y = Math.floor(i / mapWidth);
                switch(curID)
                {
                    case 0:
                        var nextLevelBody = this.game.physics.p2.createBody(x*this.map.tileWidth, y*this.map.tileHeight, 0, false);
                        nextLevelBody.addPolygon({}, [[0,0], [this.map.tileWidth-1, 0],
                            [this.map.tileWidth-1, this.map.tileHeight-1], [0, this.map.tileHeight-1]]);
                        nextLevelBody.onBeginContact.add(this.parent.nextLevel, this.parent);
                        nextLevelBody.debug = debug;
                        this.game.physics.p2.addBody(nextLevelBody);
                        tLayer.bodies.push(nextLevelBody);
                        break;
                    case 1:
                        this.startPos = [x*this.map.tileWidth +8, y*this.map.tileHeight-15];
                        break;
                    case 5:
                        var skeleton = new Entities.Skeleton(this.game, x*16 +8, y*16 -4, this.parent, "Skeleton", 0);
                        this.map.getTilelayer("Player").add(skeleton);
                        this.parent.mobs.push(skeleton);
                        break;
                }
            }
        }
    }
}