/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../utils/Queue.ts"/>
/// <reference path="CollisionTiles.ts"/>
/// <reference path="../utils/UtilFunctions.ts"/>

module Pathfinding
{
    import Queue = DataStructures.Queue;
    import CollisionManager = Collision.CollisionManager;
    import CollisionBlock = Collision.CollisionBlock;
    export class Pathfinding
    {
        nodeList: Array<Node>;
        nodeIDCounter: number;
        graphics: Phaser.Graphics;
        stepRate: number;
        blocks: Array<CollisionBlock>;

        constructor(public game: Phaser.Game, public map: Phaser.Plugin.Tiled.Tilemap,
                    public layer: Phaser.Plugin.Tiled.Tilelayer, public parent: CollisionManager)
        {
            this.nodeIDCounter = 0;
            this.graphics = this.game.add.graphics(0,0);
            this.stepRate = 4;
            this.blocks = [];
        }

        setupPathfinding(x: number, y:number)
        {
            //Create the block list
            for(var i = 0; i < this.layer.bodies.length; i++)
            {
                var block: CollisionBlock = Collision.CollisionBlock.createFromBody(this.layer.bodies[i]);
                if(block != null)
                {
                    this.blocks.push(block);

                }
            }

            this.setupNodes(2, 2);
            this.stepRate = 1;
            this.setupConnections(0, 0);
            this.stepRate = 4;
            //The x and y coords are used for determining the necessary nodes.
            //So the player position for example.
            this.removeUnnecessaryNodes(x, y);
        }

        setupNodes(deltaX: number, deltaY: number)
        {
            var layerWidth = this.layer.size['x'],
                tiles = this.layer.tileIds, coordsOutput: Array<Node> = [],
                map = Collision.getPropMap(tiles, layerWidth, this.parent.getGidOfTileset("Collision").firstgid),
                xCoord, yCoord, nodeOptions: Array<boolean>, newNode: Node,
                curBlock: CollisionBlock;

            //Nodeoptions indexes:
            //01
            //32

            for(var index = 0; index < tiles.length; index++)
            {
                if(tiles[index] != 0) {
                    xCoord = index % layerWidth;
                    yCoord = Math.floor(index / layerWidth);
                    nodeOptions = Collision.tileCornerWaypoint(xCoord, yCoord, map, deltaX, deltaY);

                    curBlock = null;
                    for(var i = 0; i < this.blocks.length; i++)
                    {
                        if(this.blocks[i].AABB(xCoord*16, yCoord*16, xCoord*16 +15, yCoord*16 +15))
                            curBlock = this.blocks[i];
                    }
                    if(curBlock == null)
                        throw new Error("woops this place shouldn't exist");

                    if(nodeOptions[0])
                    {
                        newNode = new Node((xCoord * 16) + map[yCoord][xCoord].leftX -deltaX,
                            (yCoord * 16) + map[yCoord][xCoord].upperY -deltaY, this, curBlock, 0);
                        coordsOutput.push(newNode);
                        curBlock.nodes[0] = newNode;
                    }
                    if(nodeOptions[1])
                    {
                        newNode = new Node((xCoord * 16) + map[yCoord][xCoord].rightX + deltaX,
                            (yCoord * 16) + map[yCoord][xCoord].upperY -deltaY, this, curBlock, 1);
                        coordsOutput.push(newNode);
                        curBlock.nodes[1] = newNode;
                    }
                    if(nodeOptions[2])
                    {
                        newNode = new Node((xCoord * 16) + map[yCoord][xCoord].rightX +deltaX,
                            (yCoord * 16) + map[yCoord][xCoord].lowerY +deltaY, this, curBlock, 2);
                        coordsOutput.push(newNode);
                        curBlock.nodes[2] = newNode;
                    }
                    if(nodeOptions[3])
                    {
                        newNode = new Node((xCoord * 16) + map[yCoord][xCoord].leftX -deltaX,
                            (yCoord * 16) + map[yCoord][xCoord].lowerY +deltaY, this, curBlock, 3);
                        coordsOutput.push(newNode);
                        curBlock.nodes[3] = newNode;
                    }
                }
            }
            this.nodeList = coordsOutput;
        }

        setupConnections(deltaX: number, deltaY: number)
        {
            for(var i = 0; i < this.nodeList.length; i++)
            {
                //Start at the next node that isn't checked
                //j = i+1, because if it's the same it will check itself
                for(var j = i+1; j < this.nodeList.length; j++)
                {
                    if(!this.raycastLine(new Phaser.Line(this.nodeList[i].x, this.nodeList[i].y, this.nodeList[j].x,
                            this.nodeList[j].y), deltaX, deltaY))
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
                if(!this.raycastLine(new Phaser.Line(x,y, this.nodeList[startNodeIndex].x, this.nodeList[startNodeIndex].y), 0, 0))
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

        raycastLine(line: Phaser.Line, deltaX: number, deltaY: number): boolean
        {
            var currentBody: CollisionBlock, coords = [];

            line.coordinatesOnLine(4, coords);
            //Get all relevant bodies
            for (var i = 0; i < this.blocks.length; i++)
            {
                currentBody = this.blocks[i];
                var minX = currentBody.minX - deltaX, maxX = currentBody.maxX + deltaX,
                    minY = currentBody.minY - deltaY, maxY = currentBody.maxY + deltaY;

                if(!(Math.max(line.start.x, line.end.x) < minX || maxX < Math.min(line.start.x, line.end.x)
                    || Math.max(line.start.y, line.end.y) < minY || maxY < Math.min(line.start.y, line.end.y)))
                {
                    for(var coordIndex = 0; coordIndex < coords.length; coordIndex++)
                    {
                        if(Pathfinding.containsPoint([minX, minY, maxX, maxY], coords[coordIndex][0], coords[coordIndex][1]))
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
                if(!this.raycastLine(line, 0, 0))
                {
                    graphics.moveTo(this.nodeList[i].x, this.nodeList[i].y);
                    graphics.lineTo(x, y);
                }
            }
            graphics.endFill();
        }

        static containsPoint(rectangle: [number, number, number, number], x, y): boolean
        {
            return !(x < rectangle[0] || y < rectangle[1] || x > rectangle[2] || y > rectangle[3]);
        }
    }

    export class Node implements location
    {
        connections: Array<Node>;
        nodeID: number;
        block: CollisionBlock;
        direction: number;
        x: number;
        y: number;

        constructor(x: number, y: number, pathFinder: Pathfinding, block: CollisionBlock, direction: number)
        {
            this.x = x;
            this.y = y;
            this.connections = [];
            this.nodeID = pathFinder.nodeIDCounter;
            pathFinder.nodeIDCounter++;
            this.block = block;
            this.direction = direction;
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

    export interface location
    {
        x: number;
        y: number;
    }
}