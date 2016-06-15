/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../../app.ts"/>
/// <reference path="../utils/UtilFunctions.ts"/>
/// <reference path="../AnimationManager.ts"/>
/// <reference path="../Collision/Pathfinding.ts"/>

module Entities
{
    import MobEntity = GameObjects.Entity;
    import GameObjectType = GameObjects.GameObjectType;
    import AnimManager = Manager.AnimManager;
    import AnimType = Manager.AnimType;
    import Level = GameLevels.Level;

    export class Player extends Phaser.Sprite implements MobEntity
    {
        objectType: GameObjectType;
        currentLevel: Level;
        moveSpeed: number;
        baseMoveSpeed: number;
        moveSpeedMod: number;
        keyListener: {[name: string]: Phaser.Key};
        body: Phaser.Physics.P2.Body;
        AnimManager: AnimManager;
        canAttack: boolean;
        attackDelay: number;
        hitBox: p2.Rectangle;
        maxHealth: number;
        isDying: boolean;
        attackDamage: number;

        constructor(game: Phaser.Game, x: number, y: number, currentLevel: Level, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number)
        {
            super(game, x, y,  key, frame);
            this.objectType = GameObjectType.PLAYER;
            this.currentLevel = currentLevel;
            this.baseMoveSpeed = 55;
            this.moveSpeedMod = 1;
            this.canAttack = true;
            this.attackDelay = 800;
            this.keyListener = UtilFunctions.setupPlayerKeys(this.game);
            this.health = this.maxHealth;
            this.isDying = false;
            this.attackDamage = 50;

            //Setup physics and the player body
            this.game.physics.p2.enable(this);
            this.anchor.setTo(0.5,0.5);
            this.body.clearShapes();
            this.body.fixedRotation = true;
            this.body.addRectangle(14,5, 0, 16, 0);
            this.hitBox = this.body.addRectangle(14, 30, 0, 0, 0);
            this.hitBox.sensor = true;
            this.body.mass *= 4;

            //Setup animationManager
            this.AnimManager = new AnimManager(this, {'Attack': [30,31,32,33,34,35,35,34,33,32,31]});
            this.AnimManager.attackSignal.add(function()
            {
                this.moveSpeedMod += 0.6;
            }, this);

            var timer = this.game.time.create(false);
            timer.loop(1000, function()
            {
                this.health = Math.min(this.maxHealth, this.health + 2);
            }, this);
            timer.start();
        }

        damagePlayer(amount: number)
        {
            this.health -= amount;
            if(this.health <= 0)
            {
                this.death();
            }
        }

        death()
        {
            this.AnimManager.die().onComplete.add(function()
            {
                this.game.state.add('Death', new GameStates.GameOver(this.game), true);
            }, this);
            this.isDying = true;
            this.body.static = true;
        }

        //Main update loop
        update()
        {
            this.updateMoveSpeed();
            this.updateMovementControl();
        }

        updateMoveSpeed()
        {
            this.moveSpeed = this.baseMoveSpeed * this.moveSpeedMod;
        }

        updateMovementControl()
        {
            this.body.setZeroVelocity();
            var ang = 0;

            if(this.keyListener['s'].isDown)
            {
                ang -= 3;
            }
            if(this.keyListener['w'].isDown)
            {
                ang += 3;
            }
            if(this.keyListener['d'].isDown)
            {
                ang += 1;
            }
            if(this.keyListener['a'].isDown)
            {
                ang -= 1;
            }

            var diagSpeed = this.moveSpeed * 0.7071,
                anim: AnimType = AnimType.IDLE;

            switch (ang)
            {
                case 4:
                    anim = AnimType.RIGHT;
                    this.body.moveRight(diagSpeed);
                    this.body.moveUp(diagSpeed);
                    break;
                case 1:
                    anim = AnimType.RIGHT;
                    this.body.moveRight(this.moveSpeed);
                    break;
                case -2:
                    anim = AnimType.RIGHT;
                    this.body.moveRight(diagSpeed);
                    this.body.moveDown(diagSpeed);
                    break;
                case -3:
                    anim = AnimType.UPDOWN;
                    this.body.moveDown(this.moveSpeed);
                    break;
                case -4:
                    anim = AnimType.LEFT;
                    this.body.moveLeft(diagSpeed);
                    this.body.moveDown(diagSpeed);
                    break;
                case -1:
                    anim = AnimType.LEFT;
                    this.body.moveLeft(this.moveSpeed);
                    break;
                case 2:
                    anim = AnimType.LEFT;
                    this.body.moveLeft(diagSpeed);
                    this.body.moveUp(diagSpeed);
                    break;
                case 3:
                    anim = AnimType.UPDOWN;
                    this.body.moveUp(this.moveSpeed);
                    break;
            }

            if(this.keyListener['space'].isDown && this.canAttack)
            {
                return this.attack();
            }

            this.AnimManager.updateAnimation(anim);
        }

        attack()
        {
            this.AnimManager.attack(-1);
            var timer = this.game.time.add(new Phaser.Timer(this.game, true));
            timer.add(this.attackDelay, function()
            {
                this.canAttack = true;
            }, this);
            timer.start();
            this.canAttack = false;
            this.moveSpeedMod -= 0.6;

            var endX = this.x + (this.scale.x * 16);

            for(var i = 0; i < this.currentLevel.mobs.length; i++)
            {
                if(this.currentLevel.mobs[i].isHit(Math.min(this.x, endX), Math.max(this.x, endX), this.y -1, this.y+1))
                {
                    this.currentLevel.mobs[i].damageEntity(this.attackDamage);
                }
            }
        }
    }
}