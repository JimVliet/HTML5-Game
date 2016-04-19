/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>

module Pathfinding
{
    export function setupNodes(layer: Phaser.Plugin.Tiled.Tilelayer): Array<Array<number>>
    {
        var layerWidth = layer.size['x'],
            layerHeight = layer.size['y'],
            tiles = layer.tileIds, coordsOutput: Array<Array<number>> = [],
            xCoord, yCoord, nodeOptions: Array<boolean>;

        //Nodeoptions indexes:
        //02
        //13

        for(var index = 0; index < tiles.length; index++)
        {
            if(tiles[index] != 0) {
                xCoord = index % layerWidth;
                yCoord = Math.floor(index / layerWidth);
                nodeOptions = [true, true, true, true];

                //This check won't work well if the map is 1 tile wide or 1 tile tall
                if (xCoord == 0) {
                    nodeOptions[0] = false;
                    nodeOptions[1] = false;
                }
                else if (xCoord == layerWidth - 1) {
                    nodeOptions[2] = false;
                    nodeOptions[3] = false;
                }
                if (yCoord == 0) {
                    nodeOptions[0] = false;
                    nodeOptions[2] = false;
                }
                else if (yCoord == layerHeight - 1) {
                    nodeOptions[1] = false;
                    nodeOptions[3] = false;
                }

                //Check nodes adjacent to the tile
                if ((nodeOptions[0] || nodeOptions[1]) && tiles[index - 1] != 0) {
                    nodeOptions[0] = false;
                    nodeOptions[1] = false;
                }
                if ((nodeOptions[2] || nodeOptions[3]) && tiles[index + 1] != 0) {
                    nodeOptions[2] = false;
                    nodeOptions[3] = false;
                }
                if ((nodeOptions[0] || nodeOptions[2]) && tiles[index - layerWidth] != 0) {
                    nodeOptions[0] = false;
                    nodeOptions[2] = false;
                }
                if ((nodeOptions[1] || nodeOptions[3]) && tiles[index + layerWidth] != 0) {
                    nodeOptions[1] = false;
                    nodeOptions[3] = false;
                }

                if(nodeOptions[0] && tiles[index - layerWidth -1] == 0)
                {
                    coordsOutput.push([xCoord -1, yCoord -1]);
                }
                if(nodeOptions[1] && tiles[index + layerWidth -1] == 0)
                {
                    coordsOutput.push([xCoord -1, yCoord +1]);
                }
                if(nodeOptions[2] && tiles[index - layerWidth +1] == 0)
                {
                    coordsOutput.push([xCoord +1, yCoord -1]);
                }
                if(nodeOptions[2] && tiles[index + layerWidth +1] == 0)
                {
                    coordsOutput.push([xCoord +1, yCoord +1]);
                }

            }
        }
        return coordsOutput;
    }
}