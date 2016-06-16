module UtilFunctions
{
    //Dit is een simpele class die je kan gebruiken voor coordinaten.
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