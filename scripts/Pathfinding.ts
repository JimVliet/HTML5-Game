/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>

module Pathfinding
{
    export class Pathfinding
    {
        nodeList: Array<Node>;

        constructor(public game: Phaser.Game, public map: Phaser.Plugin.Tiled.Tilemap, public layer: Phaser.Plugin.Tiled.Tilelayer)
        {

        }

        setupNodes(): Array<Node>
        {
            var layerWidth = this.layer.size['x'],
                layerHeight = this.layer.size['y'],
                tiles = this.layer.tileIds, coordsOutput: Array<Node> = [],
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
                        coordsOutput.push(new Node(xCoord * this.map.tileWidth, yCoord * this.map.tileHeight));
                    }
                    if(nodeOptions[1] && tiles[index + layerWidth -1] == 0)
                    {
                        coordsOutput.push(new Node(xCoord * this.map.tileWidth, (yCoord +1) * this.map.tileHeight));
                    }
                    if(nodeOptions[2] && tiles[index - layerWidth +1] == 0)
                    {
                        coordsOutput.push(new Node((xCoord +1) * this.map.tileWidth, yCoord * this.map.tileHeight));
                    }
                    if(nodeOptions[3] && tiles[index + layerWidth +1] == 0)
                    {
                        coordsOutput.push(new Node((xCoord +1) * this.map.tileWidth, (yCoord +1) * this.map.tileHeight));
                    }
                }
            }
            this.nodeList = coordsOutput;
            return coordsOutput;
        }

        drawNodes()
        {
            var graphics = this.game.add.graphics(0,0);

            graphics.lineStyle(0);
            graphics.beginFill(0xFFFFFF);
            for(var i = 0; i < this.nodeList.length; i++)
            {
                graphics.drawCircle(this.nodeList[i].x, this.nodeList[i].y, 3);
            }
            graphics.endFill();
        }
    }

    export class Node
    {
        constructor(public x: number, public y: number)
        {

        }
    }
}