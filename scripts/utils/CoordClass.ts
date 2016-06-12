module UtilFunctions
{
    import location = Pathfinding.location;
    export class Coords implements location
    {
        x: number;
        y: number;

        constructor(x: number, y: number)
        {
            this.x = x;
            this.y = y;
        }
    }
}