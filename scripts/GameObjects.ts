/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="functionFile.ts"/>
/// <reference path="AnimationManager.ts"/>

module GameObjects
{
    import AnimManager = Manager.AnimManager;
    import AnimType = Manager.AnimType;
    export enum GameObjectType
    {
        PLAYER
    }

    export class Player extends Phaser.Sprite implements MobEntity
    {
        objectType: GameObjectType;
        currentLevel: GameStates.GameLevel & Phaser.State;
        moveSpeed: number;
        baseMoveSpeed: number;
        moveSpeedMod: number;
        keyListener: {[name: string]: Phaser.Key};
        body: Phaser.Physics.P2.Body;
        AnimManager: AnimManager;
        canAttack: boolean;
        attackDelay: number;
        hitBox: p2.Rectangle;

        constructor(game: Phaser.Game, x: number, y: number, currentLevel: GameStates.GameLevel & Phaser.State, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number)
        {
            super(game, x, y,  key, frame);
            this.objectType = GameObjectType.PLAYER;
            this.currentLevel = currentLevel;
            this.baseMoveSpeed = 100;
            this.moveSpeedMod = 1;
            this.canAttack = true;
            this.attackDelay = 800;
            this.keyListener = functionFile.setupPlayerKeys(this.game);

            //Setup physics and the player body
            this.game.physics.p2.enable(this);
            this.anchor.setTo(0.5,0.5);
            this.body.clearShapes();
            this.body.fixedRotation = true;
            this.body.addRectangle(14,5, 0, 16, 0);
            this.hitBox = this.body.addRectangle(14, 30, 0, 0, 0);
            this.hitBox.sensor = true;

            //Setup animationManager
            this.AnimManager = new AnimManager(this, {'Attack': [30,31,32,33,34,35,35,34,33,32,31]});
            this.AnimManager.attackSignal.add(function()
            {
                this.moveSpeedMod += 0.6;
            }, this);
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

    }

    export interface GameObject
    {
        currentLevel: GameStates.GameLevel & Phaser.State;
        hitBox: p2.Rectangle;
    }

    export interface MobEntity extends GameObject
    {
        moveSpeed: number;
        baseMoveSpeed: number;
        moveSpeedMod: number;
        AnimManager: AnimManager;
        attackDelay: number;
    }
}