/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>

module Pathfinding
{
    export class Pathfinding
    {
        nodeList: Array<Node>;
        nodeIDCounter: number;

        constructor(public game: Phaser.Game, public map: Phaser.Plugin.Tiled.Tilemap, public layer: Phaser.Plugin.Tiled.Tilelayer)
        {
            this.nodeIDCounter = 0;
        }

        setupNodes()
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
                        coordsOutput.push(new Node(xCoord * this.map.tileWidth -1, yCoord * this.map.tileHeight -1, this));
                    }
                    if(nodeOptions[1] && tiles[index + layerWidth -1] == 0)
                    {
                        coordsOutput.push(new Node(xCoord * this.map.tileWidth -1, (yCoord +1) * this.map.tileHeight +1, this));
                    }
                    if(nodeOptions[2] && tiles[index - layerWidth +1] == 0)
                    {
                        coordsOutput.push(new Node((xCoord +1) * this.map.tileWidth +1, yCoord * this.map.tileHeight -1, this));
                    }
                    if(nodeOptions[3] && tiles[index + layerWidth +1] == 0)
                    {
                        coordsOutput.push(new Node((xCoord +1) * this.map.tileWidth +1, (yCoord +1) * this.map.tileHeight +1, this));
                    }
                }
            }
            this.nodeList = coordsOutput;
        }

        setupConnections()
        {
            for(var i = 0; i < this.nodeList.length; i++)
            {
                for(var j = i; j < this.nodeList.length; j++)
                {
                    if(!this.raycastLine(new Phaser.Line(this.nodeList[i].x, this.nodeList[i].y, this.nodeList[j].x, this.nodeList[j].y)))
                    {
                        this.nodeList[i].connectTo(this.nodeList[j]);
                    }
                }
            }
        }

        drawNodes()
        {
            //Make sure to clear the graphics
            var graphics = this.game.add.graphics(0,0);

            graphics.lineStyle(0);
            graphics.beginFill(0x71A37D, 0.5);
            for(var i = 0; i < this.nodeList.length; i++)
            {
                graphics.drawCircle(this.nodeList[i].x, this.nodeList[i].y, 3);
            }
            graphics.endFill();
        }

        drawConnections(graphics: Phaser.Graphics)
        {
            var usedConnections = {}, currentNode: Node;

            //Make sure to clear the graphics
            graphics.beginFill();
            graphics.lineStyle(1, 0xFF00FF, 1);
            for(var i = 0; i < this.nodeList.length; i++)
            {
                for(var j = 0; j < this.nodeList[i].connections.length; j++)
                {
                    currentNode = this.nodeList[i].connections[j];
                    if(!(currentNode.nodeID in usedConnections))
                    {
                        graphics.moveTo(this.nodeList[i].x, this.nodeList[i].y);
                        graphics.lineTo(currentNode.x, currentNode.y);
                    }
                }
                usedConnections[this.nodeList[i].nodeID] = true;
            }
            graphics.endFill();
        }

        raycastLine(line: Phaser.Line): boolean
        {
            var bodies: Array<Phaser.Physics.P2.Body> = this.layer.bodies,
                currentBody, bodyList: Array<[number, number, number, number]> = [];

            //Get all relevant bodies
            for (var i = 0; i < bodies.length; i++)
            {
                currentBody = bodies[i];
                var bodyRightX = currentBody.x + (currentBody.data.shapes[0].width / 0.8 * this.map.tileWidth),
                    bodyRightY = currentBody.y + (currentBody.data.shapes[0].height / 0.8 * this.map.tileHeight);

                if(!(Math.max(line.start.x, line.end.x) < currentBody.x || bodyRightX < Math.min(line.start.x, line.end.x)
                    || Math.max(line.start.y, line.end.y) < currentBody.y || bodyRightY < Math.min(line.start.y, line.end.y)))
                {
                    bodyList.push([currentBody.x, currentBody.y, bodyRightX, bodyRightY]);
                }
            }

            var coords = [];
            line.coordinatesOnLine(4, coords);
            for(var index = 0; index < bodyList.length; index++)
            {
                for(var coordIndex = 0; coordIndex < coords.length; coordIndex++)
                {
                    if(this.containsPoint(bodyList[index], coords[coordIndex][0], coords[coordIndex][1]))
                        return true;
                }
            }
            return false;
        }

        private containsPoint(rectangle: [number, number, number, number], x, y): boolean
        {
            return !(x < rectangle[0] || y < rectangle[1] || x > rectangle[2] || y > rectangle[3]);
        }
    }

    export class Node
    {
        connections: Array<Node>;
        nodeID: number;

        constructor(public x: number, public y: number, pathFinder: Pathfinding)
        {
            this.connections = [];
            this.nodeID = pathFinder.nodeIDCounter;
            pathFinder.nodeIDCounter++;
        }

        connectTo(node: Node)
        {
            this.connections.push(node);
            node.connections.push(this);
        }
    }
}