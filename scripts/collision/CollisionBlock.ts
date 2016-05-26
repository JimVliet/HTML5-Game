module Collision
{
    import Node = Pathfinding.Node;
    export class CollisionBlock
    {
        nodes: Array<Node>;
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;

        constructor(public childBody: Phaser.Physics.P2.Body)
        {
            if((<any>childBody.data).concavePath == null)
            {

            }

            var halfWidth = (<any>childBody.data).concavePath[0][0] / 0.05,
                halfHeight = (<any>childBody.data).concavePath[0][1] / 0.05;
            this.minX = childBody.x - halfWidth;
            this.maxX = childBody.x + halfWidth;
            this.minY = childBody.y - halfHeight;
            this.maxY = childBody.y + halfHeight;
        }
    }
}