/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>

module functionFile
{
    import Polygon = Phaser.Polygon;
    export function setupWASDKeys(game: Phaser.Game)
    {
        var keyLib = {};
        keyLib['w'] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyLib['a'] = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyLib['s'] = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyLib['d'] = game.input.keyboard.addKey(Phaser.Keyboard.D);
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
            usedTiles = {},
            x, y;

        //Area and the x,y coords and the current x,y coords
        type bestRect = [number, number, number, number, number];

        for (var index = 0; index < layerlength; index++)
        {
            if(layerTiles[index] != 0 && !(index in usedTiles))
            {
                x = index % mapWidth;
                y = Math.floor(index / mapWidth);

                var curY = y,
                    maxWidth = mapWidth - 1,
                    curBestRect: bestRect = [1, x, y, x, y];

                while(curY < mapHeight && layerTiles[curY*mapWidth + x] && !(curY*mapWidth + x in usedTiles))
                {
                    var curX = x,
                        curYIndex = curY * mapWidth,
                        surface;

                    //Check if the tile isn't outside the map and if it's a wall and if it isn't already used
                    while(curX+1 <= maxWidth && layerTiles[curYIndex + curX + 1] != 0 && !(curYIndex+curX+1 in usedTiles))
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

                body.addRectangle(xEndPixel - xPixel, yEndPixel - yPixel, (xEndPixel - xPixel)/2, (yEndPixel - yPixel)/2, 0);
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
        }
    }

    export function turnIntoPolygons(rectArray: Array<Array<number>>, tileWidth: number, tileHeight: number)
    {
        var polygonList: Array<Phaser.Polygon> = [];
        for(var i = 0; i < rectArray.length; i++)
        {
            var x = rectArray[i][1] * tileWidth,
                y = rectArray[i][2] * tileHeight,
                xEnd = (rectArray[i][3]+1) * tileWidth,
                yEnd = (rectArray[i][4]+1) * tileHeight;

            var poly = new Polygon(new Phaser.Point(x,y), new Phaser.Point(xEnd,y), new Phaser.Point(xEnd,yEnd), new Phaser.Point(x,yEnd));
            polygonList.push(poly);
        }

        return polygonList;
    }

}