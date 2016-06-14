/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="Pathfinding.ts"/>
/// <reference path="CollisionManager.ts"/>
/// <reference path="CollisionBlock.ts"/>

module Collision
{
    export class ColTileProps
    {
        leftX: number;
        upperY: number;
        rightX: number;
        lowerY: number;

        constructor()
        {
            this.leftX = 0;
            this.upperY = 0;
            this.rightX = 15;
            this.lowerY = 15;


        }

        collideXAxis(x: number)
        {
            return x >= this.leftX && x <= this.rightX;
        }

        collideYAxis(y: number)
        {
            return y >= this.upperY && y <= this.lowerY;
        }
    }

    export function getPropMap(tiles: number[], width: number, firstGid: number): Array<Array<ColTileProps>>
    {
        var map: Array<Array<ColTileProps>> = [],
            y: number, x: number;

        for(var i = 0; i < tiles.length; i++)
        {
            y = Math.floor(i/ width);
            x = i % width;
            if(map[y] == null)
                map[y] = [];

            map[y][x] = getTileCollisionProperties(tiles[i]-firstGid);
        }

        return map;
    }


    export function getTileCollisionProperties(tileIndex: number): ColTileProps
    {
        if(tileIndex < 0 || tileIndex >= 65)
            return null;

        //X offset, Y offset
        var props: ColTileProps = new ColTileProps();
        if(tileIndex < 25)
        {
            props.leftX = tileIndex % 5;
            props.upperY = Math.floor(tileIndex /5);
            props.rightX = 15 - (tileIndex % 5);
            props.lowerY = 15 - (Math.floor(tileIndex /5));
        }
        else if(tileIndex < 35)
            props.lowerY -= tileIndex - 24;
        else if(tileIndex < 45)
            props.upperY = tileIndex - 34;
        else if(tileIndex < 55)
            props.rightX -= tileIndex - 44;
        else if(tileIndex < 65)
            props.leftX = tileIndex - 54;
        return props;
    }

    export function tileCornerWaypoint(x: number, y: number, map: Array<Array<ColTileProps>>, deltaX: number, deltaY: number)
    :[boolean, boolean, boolean, boolean]
    {
        //Indexcorners
        //0-1
        //| |
        //3-2

        var tileProps = map[y][x],
            xDif = 16 - deltaX, yDif = 16-deltaY,
            minX = x == 0,
            maxX = x == map[0].length - 1,
            minY = y == 0,
            maxY = y == map.length - 1,
            topLeft:ColTileProps = minX || minY ? null: map[y-1][x-1],
            top:ColTileProps = minY ? null: map[y-1][x],
            topRight: ColTileProps = maxX || minY ? null: map[y-1][x+1],
            left: ColTileProps = minX ? null: map[y][x-1],
            right: ColTileProps = maxX ? null: map[y][x+1],
            bottomLeft: ColTileProps = minX || maxY ? null: map[y+1][x-1],
            bottom: ColTileProps = maxY ? null: map[y+1][x],
            bottomRight: ColTileProps = maxX || maxY? null: map[y+1][x+1];

        if(tileProps == null)
            return [false, false, false, false];

        var outputCorners: [boolean, boolean, boolean, boolean] =
            [!minX && !minY, !maxX && !minY, !maxX && !maxY, !minX && !maxY];

        //Check if there is a node above the tileProps and check if they touch each other
        if(top != null && top.lowerY - tileProps.upperY >= yDif)
        {
            //The topleft corner will be moved one to the left on the x axis
            //So you need to subtract 1
            if(tileProps.leftX == top.leftX || top.collideXAxis(tileProps.leftX-1))
                outputCorners[0] = false;
            if(tileProps.rightX == top.rightX || top.collideXAxis(tileProps.rightX+1))
                outputCorners[1] = false;
        }
        if(right!= null && tileProps.rightX - right.leftX >= xDif)
        {
            if(tileProps.upperY == right.upperY || right.collideYAxis(tileProps.upperY-1))
                outputCorners[1] = false;
            if(tileProps.lowerY == right.lowerY || right.collideYAxis(tileProps.lowerY+1))
                outputCorners[2] = false;
        }
        if(bottom != null && tileProps.lowerY - bottom.upperY >= yDif)
        {
            if(tileProps.leftX == bottom.leftX || bottom.collideXAxis(tileProps.leftX-1))
                outputCorners[3] = false;
            if(tileProps.rightX == bottom.rightX || bottom.collideXAxis(tileProps.rightX+1))
                outputCorners[2] = false;
        }
        if(left != null && left.rightX - tileProps.leftX >= xDif)
        {
            if(tileProps.upperY == left.upperY || left.collideYAxis(tileProps.upperY-1))
                outputCorners[0] = false;
            if(tileProps.lowerY == left.lowerY || left.collideYAxis(tileProps.lowerY+1))
                outputCorners[3] = false;
        }

        if(topLeft != null && topLeft.rightX - tileProps.leftX >= xDif && topLeft.lowerY - tileProps.upperY >= yDif)
            outputCorners[0] = false;
        if(topRight != null && tileProps.rightX - topRight.leftX >= xDif && topRight.lowerY - tileProps.upperY >= yDif)
            outputCorners[1] = false;
        if(bottomRight != null && tileProps.rightX - bottomRight.leftX >= xDif && tileProps.lowerY - bottomRight.upperY >= yDif)
            outputCorners[2] = false;
        if(bottomLeft != null && bottomLeft.rightX - tileProps.leftX >= xDif && tileProps.lowerY - bottomLeft.upperY >= yDif)
            outputCorners[3] = false;

        return outputCorners;
    }

}