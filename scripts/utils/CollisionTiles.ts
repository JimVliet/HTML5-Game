/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>

module CollisionTiles
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

    export function tileCornerWaypoint(x: number, y: number, map: Array<Array<ColTileProps>>)
    :[boolean, boolean, boolean, boolean]
    {
        //Indexcorners
        //0-1
        //| |
        //3-2
        var tileProps = map[y][x],
            topLeft:ColTileProps = x >= 0 && y >= 0 ? map[x-1][y-1] : null,
            top:ColTileProps = y >= 0 ? map[y-1][x]: null,
            topRight: ColTileProps = x+1 < map[0].length && y>= 0 ? map[y-1][x+1] : null,
            left: ColTileProps = x >= 0 ? map[y][x-1]: null,
            right: ColTileProps = x+1 < map[0].length ? map[y][x+1]: null,
            bottomLeft: ColTileProps = x >= 0 && y+1 < map.length ? map[y+1][x-1]: null,
            bottom: ColTileProps = y+1 < map.length ? map[y+1][x]: null,
            bottomRight: ColTileProps = x+1 < map[0].length && y+1 < map.length ? map[y+1][x+1]: null;

        var outputCorners: [boolean, boolean, boolean, boolean] = [true, true, true, true];

        //Check if there is a node above the tileProps and check if they touch each other
        if(top != null && top.lowerY - tileProps.upperY == 15)
        {
            //The topleft corner will be moved one to the left on the x axis
            //So you need to subtract 1
            if(tileProps.leftX == top.leftX || top.collideXAxis(tileProps.leftX-1))
                outputCorners[0] = false;
            if(tileProps.rightX == top.rightX || top.collideXAxis(tileProps.rightX+1))
                outputCorners[1] = false;
        }
        if(right!= null && tileProps.rightX - right.leftX == 15)
        {
            if(tileProps.upperY == right.upperY || right.collideYAxis(tileProps.upperY-1))
                outputCorners[1] = false;
            if(tileProps.lowerY == right.lowerY || right.collideYAxis(tileProps.lowerY+1))
                outputCorners[2] = false;
        }
        if(bottom != null && tileProps.lowerY - bottom.upperY == 15)
        {
            if(tileProps.leftX == bottom.leftX || bottom.collideXAxis(tileProps.leftX-1))
                outputCorners[3] = false;
            if(tileProps.rightX == bottom.rightX || bottom.collideXAxis(tileProps.rightX+1))
                outputCorners[2] = false;
        }
        if(left != null && left.rightX - tileProps.leftX == 15)
        {
            if(tileProps.upperY == left.upperY || left.collideYAxis(tileProps.upperY-1))
                outputCorners[0] = false;
            if(tileProps.lowerY == left.lowerY || left.collideYAxis(tileProps.lowerY+1))
                outputCorners[3] = false;
        }

        if(outputCorners[0] && topLeft.rightX - tileProps.leftX == 15 && topLeft.lowerY - tileProps.upperY == 15)
            outputCorners[0] = false;
        if(outputCorners[1] && tileProps.rightX - topRight.leftX == 15 && topLeft.lowerY - tileProps.upperY == 15)
            outputCorners[1] = false;
        if(outputCorners[2] && tileProps.rightX - bottomRight.leftX == 15 && tileProps.lowerY - bottomRight.upperY == 15)
            outputCorners[2] = false;
        if(outputCorners[3] && bottomLeft.rightX - tileProps.leftX == 15 && bottomLeft.upperY - tileProps.leftX == 15)
            outputCorners[3] = false;

        return outputCorners;
    }
}