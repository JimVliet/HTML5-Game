/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../../app.ts"/>
/// <reference path="../utils/UtilFunctions.ts"/>
/// <reference path="../utils/CoordClass.ts"/>
/// <reference path="../AnimationManager.ts"/>
/// <reference path="../Collision/Pathfinding.ts"/>

module Entities
{
    import GameObjectType = GameObjects.GameObjectType;
    import AnimManager = Manager.AnimManager;
    import AnimType = Manager.AnimType;
    import Level = GameLevels.Level;
    import location = Pathfinding.location;
    import Mob = GameObjects.Mob;
    export class Skeleton extends Phaser.Sprite implements Mob
    
    {
        objectType: GameObjectType;
        currentLevel: Level;
        moveSpeed: number;
        baseMoveSpeed: number;
        moveSpeedMod: number;
        body: Phaser.Physics.P2.Body;
        AnimManager: AnimManager;
        canAttack: boolean;
        attackDelay: number;
        hitBox: p2.Rectangle;
        path: Array<location>;
        isRoaming: boolean;
        
        constructor(game: Phaser.Game, x: number, y: number, currentLevel: Level, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number)
        {
            super(game, x, y,  key, frame);
            this.objectType = GameObjectType.SKELETON;
            this.currentLevel = currentLevel;
            this.baseMoveSpeed = 40;
            this.moveSpeedMod = 1;
            this.canAttack = true;
            this.attackDelay = 1000;
            this.path = [];
            this.isRoaming = false;

            //Setup physics and the Skeleton body
            this.game.physics.p2.enable(this);
            this.anchor.setTo(0.5,0.5);
            this.body.clearShapes();
            this.body.mass *= 5;
            this.body.fixedRotation = true;
            this.body.addRectangle(14,5, 0, 16, 0);
            this.hitBox = this.body.addRectangle(14, 30, 0, 0, 0);
            this.hitBox.sensor = true;

            //Setup animationManager
            this.AnimManager = new AnimManager(this, {'Attack': [30,31,32,33,34,35,38,39]});
            this.AnimManager.attackSignal.add(function()
            {
                this.moveSpeedMod += 0.6;
            }, this);
        }
        
        //Main update loop
        update()
        {
            this.body.setZeroVelocity();
            this.updateMoveSpeed();
            this.updateAI(this.currentLevel.colManager.pathFinding);
            if(this.path.length > 0 && this.path[0] != null)
            {
                this.followPath();
                var deltaX = this.x - this.currentLevel.player.x,
                    deltaY = this.y - this.currentLevel.player.y;
                if(deltaX*deltaX + deltaY*deltaY < 300)
                {
                    if(this.canAttack)
                    {
                        this.AnimManager.updateAnimation(AnimType.ATTACK);
                        this.attack();
                    }
                }
            }
            else
            {
                this.AnimManager.updateAnimation(AnimType.IDLE);
                /*if(!this.isRoaming)
                {
                    if(UtilFunctions.getRandomInt(0, 99) == 0)
                    {
                        this.isRoaming = true;

                    }
                    else
                        this.AnimManager.updateAnimation(AnimType.IDLE);
                }
                */
            }
        }

        followPath()
        {
            var xDif = this.path[0].x - this.x,
                yDif = this.path[0].y - (this.y + 16);
            if(xDif*xDif + yDif*yDif < 1)
            {
                this.path.shift();
            }
            if(this.path.length == 0)
                return;

            var angleBetween = Math.atan2(xDif, yDif),
                deltaY = Math.cos(angleBetween),
                deltaX = Math.sin(angleBetween);

            this.body.moveRight(deltaX * this.moveSpeed);
            this.body.moveDown(deltaY * this.moveSpeed);

            if(deltaX > 0)
                this.AnimManager.updateAnimation(AnimType.RIGHT);
            else if(deltaX < 0)
                this.AnimManager.updateAnimation(AnimType.LEFT);
            else
            {
                if(deltaY == 0)
                    this.AnimManager.updateAnimation(AnimType.IDLE);
                else
                    this.AnimManager.updateAnimation(AnimType.UPDOWN);
            }
        }

        updateMoveSpeed()
        {
            this.moveSpeed = this.baseMoveSpeed * this.moveSpeedMod;
        }
        
        // Monster AI
        attack()
        {
            this.AnimManager.attack(20);
            var timer = this.game.time.add(new Phaser.Timer(this.game, true));
            timer.add(this.attackDelay, function()
            {
                this.canAttack = true;
            }, this);
            timer.start();
            this.canAttack = false;
            this.moveSpeedMod -= 0.6;
        }

        updateAI(pathFinding: Pathfinding.Pathfinding)
        {
            var line = new Phaser.Line(this.x, this.y+16, this.currentLevel.player.x, this.currentLevel.player.y+16);
            if(!pathFinding.raycastLine(line, 6.5, 2.1))
            {
                this.path = [new UtilFunctions.Coords(this.currentLevel.player.x, this.currentLevel.player.y+16)];
            }
        }
    }
}
