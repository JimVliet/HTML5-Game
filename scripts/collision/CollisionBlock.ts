module Collision
{
    import Node = Pathfinding.Node;
    export class CollisionBlock
    {
        nodes: Array<Node>;

        constructor(public minX: number, public maxX: number, public minY: number, public maxY: number,
                    public x: number, public y: number)
        {
            this.nodes = [];
        }

        AABB(xMin: number, yMin: number, xMax: number, yMax: number): boolean
        {
            return !(xMax < this.minX || yMax < this.minY || xMin > this.maxX || yMin > this.maxY);
        }

        static createFromBody(childBody: Phaser.Physics.P2.Body): CollisionBlock
        {
            if((<any>childBody.data).concavePath == null)
                return null;
            var halfWidth = (<any>childBody.data).concavePath[0][0] / 0.05,
                halfHeight = (<any>childBody.data).concavePath[0][1] / 0.05;

            return new CollisionBlock(childBody.x - halfWidth, childBody.x + halfWidth, childBody.y - halfHeight,
                childBody.y + halfHeight, childBody.x, childBody.y);
        }
    }
}