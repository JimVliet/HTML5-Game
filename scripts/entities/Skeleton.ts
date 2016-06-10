/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../../app.ts"/>
/// <reference path="../utils/UtilFunctions.ts"/>
/// <reference path="../AnimationManager.ts"/>
/// <reference path="../Collision/Pathfinding.ts"/>

module Entities
{
    import MobEntity = GameObjects.MobEntity;
    import GameObjectType = GameObjects.GameObjectType;
    import AnimManager = Manager.AnimManager;
    import AnimType = Manager.AnimType;
    import Level = GameLevels.Level;
    export class Skeleton extends Phaser.Sprite implements MobEntity
    
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
        
        constructor(game: Phaser.Game, x: number, y: number, currentLevel: Level, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number)
        {
            super(game, x, y,  key, frame);
            this.objectType = GameObjectType.SKELETON;
            this.currentLevel = currentLevel;
            this.baseMoveSpeed = 40;
            this.moveSpeedMod = 1;
            this.canAttack = true;
            this.attackDelay = 800;

            //Setup physics and the Skeleton body
            this.game.physics.p2.enable(this);
            this.anchor.setTo(0.5,0.5);
            this.body.clearShapes();
            this.body.mass *= 10;
            this.body.fixedRotation = true;
            this.body.addRectangle(14,5, 0, 16, 0);
            this.hitBox = this.body.addRectangle(14, 30, 0, 0, 0);
            this.hitBox.sensor = true;

            //Setup animationManager
            this.AnimManager = new AnimManager(this, undefined);
            this.AnimManager.attackSignal.add(function()
            {
                this.moveSpeedMod += 0.6;
            }, this);
        }
        
        //Main update loop
        update()
        {
            this.updateMoveSpeed();
            this.AnimManager.updateAnimation(AnimType.IDLE);
            this.body.setZeroVelocity();
        }

        updateMoveSpeed()
        {
            this.moveSpeed = this.baseMoveSpeed * this.moveSpeedMod;
        }
        
        // Monster AI
        attack()
        {
            this.AnimManager.attack();
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
            if(!pathFinding.raycastLine(new Phaser.Line(this.x +16, this.y+16, this.currentLevel.player.x+16, this.currentLevel.player.y+16), 0, 0))
            {

            }
        }
    }
}
