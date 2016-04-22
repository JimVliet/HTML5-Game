/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>

module functionFile
{
    import Polygon = Phaser.Polygon;
    export function setupPlayerKeys(game: Phaser.Game): {[name: string]: Phaser.Key}
    {
        var keyLib: {[name: string]: Phaser.Key} = {};
        keyLib['w'] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyLib['a'] = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyLib['s'] = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyLib['d'] = game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyLib['space'] = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        return keyLib;
    }

    export function setupSolidLayer(game: Phaser.Game, layer: Phaser.Plugin.Tiled.Tilelayer, map: Phaser.Plugin.Tiled.Tilemap, debug: boolean)
    {
        layer.visible = false;

        //Declare variables
        var layerTiles = layer.tileIds,
            layerlength = layerTiles.length,
            mapWidth = layer.size['x'],
            mapHeight = layer.size['y'],
            solidTileset = functionFile.getGidOfSolidTileset(map),
            usedTiles = {},
            x, y;

        //Check if the solidID is valid
        if(solidTileset == null) return console.log('There is no collision tileset');
        var solidFirstGid = solidTileset.firstgid,
            solidLastGid = solidTileset.lastgid;

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

                var xPixel = curBestRect[1] * map.tileWidth,
                    yPixel = curBestRect[2] * map.tileHeight,
                    xEndPixel = (curBestRect[3]+1) * map.tileWidth,
                    yEndPixel = (curBestRect[4]+1) * map.tileHeight,
                    body = game.physics.p2.createBody(xPixel, yPixel, 0, false);

                body.addRectangle(xEndPixel - xPixel +0.2, yEndPixel - yPixel +0.2, (xEndPixel - xPixel)/2, (yEndPixel - yPixel)/2, 0);
                body.debug = debug;
                game.physics.p2.addBody(body);
                layer.bodies.push(body);

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
                createCustomBody(game, layer, map, debug, layerTiles[index] - solidFirstGid, index);
            }
        }
    }

    export function createCustomBody(game: Phaser.Game, layer: Phaser.Plugin.Tiled.Tilelayer, map: Phaser.Plugin.Tiled.Tilemap,
                                     debug: boolean, tileIndex: number, index: number)
    {
        var mapWidth = layer.size['x'],
            mapHeight = layer.size['y'],
            x = (index % mapWidth) * map.tileWidth,
            y = Math.floor(index / mapWidth) * map.tileHeight,
            tileSetX = tileIndex % 5,
            tileSetY = Math.floor(tileIndex / 5),
            body;
        if(tileIndex < 25)
        {
            body = game.physics.p2.createBody(x + tileSetX, y + tileSetY, 0, false);
            body.addRectangle(map.tileWidth - (tileSetX*2), map.tileHeight - (tileSetY*2), (map.tileWidth - (tileSetX*2))/2,
                (map.tileHeight - (tileSetY*2))/2, 0);
            body.debug = debug;
        }
        else if(tileIndex < 35)
        {
            body = game.physics.p2.createBody(x, y, 0, false);
            var bodyHeight = map.tileHeight - tileIndex + 24;
            body.addRectangle(map.tileWidth, bodyHeight, map.tileWidth/2, bodyHeight/2, 0);
        }
        else if(tileIndex < 45)
        {
            var bodyHeightOffset = tileIndex - 34;
            body = game.physics.p2.createBody(x, y + bodyHeightOffset, 0, false);
            body.addRectangle(map.tileWidth, map.tileHeight - bodyHeightOffset, map.tileWidth/2,
                (map.tileHeight - bodyHeightOffset)/2, 0);
        }
        else if(tileIndex < 55)
        {
            var bodyWidthOffset = tileIndex - 44;
            body = game.physics.p2.createBody(x, y, 0, false);
            body.addRectangle(map.tileWidth - bodyWidthOffset, map.tileHeight, (map.tileWidth - bodyWidthOffset)/2,
                map.tileHeight/2, 0);
        }
        else if (tileIndex < 65)
        {
            var bodyWidthOffset = tileIndex - 54;
            body = game.physics.p2.createBody(x + bodyWidthOffset, y, 0, false);
            body.addRectangle(map.tileWidth - bodyWidthOffset, map.tileHeight, (map.tileWidth - bodyWidthOffset)/2,
                map.tileHeight/2, 0);
        }
        else
        {
            return console.log('This is some weird shit, this should never happen. It\'s probably because this tileset is not valid');
        }
        body.debug = debug;
        game.physics.p2.addBody(body);
        layer.bodies.push(body);
    }

    export function getGidOfSolidTileset(map: Phaser.Plugin.Tiled.Tilemap): Phaser.Plugin.Tiled.Tileset
    {
        for(var tilesetId = 0; tilesetId < map.tilesets.length; tilesetId++)
        {
            if(map.tilesets[tilesetId].name == "Collision")
            {
                return map.tilesets[tilesetId];
            }
        }
        return null;
    }

    export function loadGameLevel(game: Phaser.Game, levelToLoad: GameStates.GameLevel & Phaser.State)
    {
        game.state.add('TiledMapLoader', new GameStates.TiledMapLoader(game, levelToLoad), true);
    }
}