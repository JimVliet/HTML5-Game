/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="utils/Queue.ts"/>
/// <reference path="utils/CollisionTiles.ts"/>
/// <reference path="functionFile.ts"/>

module Pathfinding
{
    import Queue = DataStructures.Queue;
    export class Pathfinding
    {
        nodeList: Array<Node>;
        nodeIDCounter: number;
        graphics: Phaser.Graphics;

        constructor(public game: Phaser.Game, public map: Phaser.Plugin.Tiled.Tilemap, public layer: Phaser.Plugin.Tiled.Tilelayer)
        {
            this.nodeIDCounter = 0;
            this.graphics = this.game.add.graphics(0,0);
        }

        setupPathfinding(x: number, y:number, debug: boolean)
        {
            this.setupNodes();
            this.setupConnections();
            //The x and y coords are used for determining the necessary nodes.
            //So the player position for example.
            this.removeUnnecessaryNodes(x, y);

            this.drawNodes(this.graphics);
            this.drawConnections(this.graphics);
        }

        setupNodes()
        {
            var layerWidth = this.layer.size['x'],
                tiles = this.layer.tileIds, coordsOutput: Array<Node> = [],
                map = CollisionTiles.getPropMap(tiles, layerWidth, functionFile.getGidOfSolidTileset(this.map).firstgid),
                xCoord, yCoord, nodeOptions: Array<boolean>;

            //Nodeoptions indexes:
            //01
            //32

            for(var index = 0; index < tiles.length; index++)
            {
                if(tiles[index] != 0) {
                    xCoord = index % layerWidth;
                    yCoord = Math.floor(index / layerWidth);
                    nodeOptions = CollisionTiles.tileCornerWaypoint(xCoord, yCoord, map);

                    if(nodeOptions[0])
                    {
                        coordsOutput.push(new Node((xCoord * 16) + map[yCoord][xCoord].leftX -2,
                            (yCoord * 16) + map[yCoord][xCoord].upperY -2, this));
                    }
                    if(nodeOptions[1])
                    {
                        coordsOutput.push(new Node((xCoord * 16) + map[yCoord][xCoord].rightX + 2,
                            (yCoord * 16) + map[yCoord][xCoord].upperY -2, this));
                    }
                    if(nodeOptions[2])
                    {
                        coordsOutput.push(new Node((xCoord * 16) + map[yCoord][xCoord].rightX +2,
                            (yCoord * 16) + map[yCoord][xCoord].lowerY +2, this));
                    }
                    if(nodeOptions[3])
                    {
                        coordsOutput.push(new Node((xCoord * 16) + map[yCoord][xCoord].leftX -2,
                            (yCoord * 16) + map[yCoord][xCoord].lowerY +2, this));
                    }
                }
            }
            this.nodeList = coordsOutput;
        }

        setupConnections()
        {
            for(var i = 0; i < this.nodeList.length; i++)
            {
                //Start at the next node that isn't checked
                //j = i+1, because if it's the same it will check itself
                for(var j = i+1; j < this.nodeList.length; j++)
                {
                    if(!this.raycastLine(new Phaser.Line(this.nodeList[i].x, this.nodeList[i].y, this.nodeList[j].x, this.nodeList[j].y)))
                    {
                        this.nodeList[i].connectTo(this.nodeList[j]);
                    }
                }
            }
        }

        drawNodes(graphics: Phaser.Graphics)
        {
            //Make sure to clear the graphics
            graphics.lineStyle(0);
            graphics.beginFill(0xAB482C, 0.8);
            for(var i = 0; i < this.nodeList.length; i++)
            {
                graphics.drawCircle(this.nodeList[i].x, this.nodeList[i].y, 3);
            }
            graphics.endFill();
        }

        removeNode(node: Node): boolean
        {
            for(var index = 0; index < this.nodeList.length; index++)
            {
                if(node.nodeID == this.nodeList[index].nodeID)
                {
                    this.nodeList.splice(index, 1);
                    node.disconnectAll();
                    return true;
                }
            }

            return false;
        }

        removeMultipleNodes(list: Array<Node>)
        {
            for(var index = 0; index < list.length; index++)
            {
                this.removeNode(list[index]);
            }
        }


        removeUnnecessaryNodes(x: number, y: number)
        {
            var startingNode: Node = null;

            for(var startNodeIndex = 0; startNodeIndex < this.nodeList.length; startNodeIndex++)
            {
                if(!this.raycastLine(new Phaser.Line(x,y, this.nodeList[startNodeIndex].x, this.nodeList[startNodeIndex].y)))
                {
                    startingNode = this.nodeList[startNodeIndex];
                    break;
                }
            }

            if(startingNode == null) return;

            var visitedNodes = {},
                nodeQueue: Queue<Node> = new Queue<Node>(),
                currentNode: Node;

            nodeQueue.add(startingNode);

            while(!nodeQueue.isEmpty())
            {
                currentNode = nodeQueue.pop();
                for(var index = 0; index < currentNode.connections.length; index++)
                {
                    if(!(currentNode.connections[index].nodeID in visitedNodes))
                    {
                        nodeQueue.add(currentNode.connections[index]);
                    }
                }
                visitedNodes[currentNode.nodeID] = true;
            }

            var nodesToRemove: Array<Node> = [];

            for(var nodeIndex = 0; nodeIndex < this.nodeList.length; nodeIndex++)
            {
                if(!(this.nodeList[nodeIndex].nodeID in visitedNodes))
                {
                    nodesToRemove.push(this.nodeList[nodeIndex]);
                }
            }

            this.removeMultipleNodes(nodesToRemove);
        }

        drawConnections(graphics: Phaser.Graphics)
        {
            var usedConnections = {}, currentNode: Node;

            //Make sure to clear the graphics
            graphics.beginFill();
            graphics.lineStyle(0.3, 0xFF00FF, 1);
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
                currentBody, bodyList: Array<[number, number, number, number]> = [],
                coords = [];

            line.coordinatesOnLine(4, coords);
            //Get all relevant bodies
            for (var i = 0; i < bodies.length; i++)
            {
                currentBody = bodies[i];
                var bodyRightX = currentBody.x + (currentBody.data.shapes[0].width / 0.8 * this.map.tileWidth),
                    bodyRightY = currentBody.y + (currentBody.data.shapes[0].height / 0.8 * this.map.tileHeight);

                if(!(Math.max(line.start.x, line.end.x) < currentBody.x || bodyRightX < Math.min(line.start.x, line.end.x)
                    || Math.max(line.start.y, line.end.y) < currentBody.y || bodyRightY < Math.min(line.start.y, line.end.y)))
                {
                    for(var coordIndex = 0; coordIndex < coords.length; coordIndex++)
                    {
                        if(this.containsPoint([currentBody.x, currentBody.y, bodyRightX, bodyRightY], coords[coordIndex][0], coords[coordIndex][1]))
                            return true;
                    }
                }
            }

            return false;
        }

        debugVisibleNodes(x: number, y: number, graphics: Phaser.Graphics)
        {
            graphics.beginFill();
            graphics.lineStyle(0.3, 0x287994);
            var line = new Phaser.Line();
            for(var i = 0; i < this.nodeList.length; i++)
            {
                line.start.setTo(this.nodeList[i].x, this.nodeList[i].y);
                line.end.setTo(x, y);
                if(!this.raycastLine(line))
                {
                    graphics.moveTo(this.nodeList[i].x, this.nodeList[i].y);
                    graphics.lineTo(x, y);
                }
            }
            graphics.endFill();
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

        disconnect(node: Node)
        {
            for(var index = 0; index < this.connections.length; index++)
            {
                if(this.connections[index].nodeID == node.nodeID)
                {
                    this.connections.splice(index, 1);
                    return;
                }
            }
        }

        disconnectAll()
        {
            for(var i = 0; i < this.connections.length; i++)
            {
                this.connections[i].disconnect(this);
            }
        }
    }
}