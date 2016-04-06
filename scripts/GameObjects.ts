/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="functionFile.ts"/>
module GameObjects
{
    export enum GameObjectType
    {
        PLAYER
    }

    export class Player extends Phaser.Sprite implements GameObject
    {
        objectType: GameObjectType;
        currentLevel: GameStates.GameLevel & Phaser.State;
        moveSpeed: number;
        keyListener: {};

        constructor(game: Phaser.Game, x: number, y: number, currentLevel: GameStates.GameLevel & Phaser.State, key?: string | Phaser.RenderTexture | Phaser.BitmapData | PIXI.Texture, frame?: string | number)
        {
            super(game, x, y,  key, frame);
            this.objectType = GameObjectType.PLAYER;
            this.currentLevel = currentLevel;
            this.moveSpeed = 40;
            this.keyListener = functionFile.setupWASDKeys(this.game);
            this.game.physics.p2.enable(this);
            this.anchor.setTo(0.5,0.5);
            this.body.fixedRotation = true;
            this.body.debug = false;
            (<Phaser.Physics.P2.Body>this.body).clearShapes();
            (<Phaser.Physics.P2.Body>this.body).addRectangle(14,5, 0, 16, 0);

            //Setup animations
            this.smoothed = false;
            this.animations.add('Idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], 5, true);
            this.animations.add('Right', [20,21,22,23,24,25,26,27,28,29], 10, true);
            this.animations.add('Left', [20,21,22,23,24,25,26,27,28,29], 10, true);
            this.animations.add('AttackRight', [30,31,32,33,34,35,36,37,38,39], 10, true);
            this.animations.add('AttackLeft', [30,31,32,33,34,35,36,37,38,39], 10, true);
            this.animations.add('DieRight', [40,41,42,43,44,45,46,47,48,49], 10, true);
            this.animations.add('DieLeft', [40,41,42,43,44,45,46,47,48,49], 10, true);
            this.animations.play('Idle');
        }

        update()
        {
            this.updateMovementControl();
        }

        updateMovementControl()
        {
            (<Phaser.Physics.P2.Body>this.body).setZeroVelocity();
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

            var diagSpeed = this.moveSpeed * 0.7071;
            switch (ang)
            {
                case 4:
                    this.playRight();
                    (<Phaser.Physics.P2.Body>this.body).moveRight(diagSpeed);
                    (<Phaser.Physics.P2.Body>this.body).moveUp(diagSpeed);
                    break;
                case 1:
                    this.playRight();
                    (<Phaser.Physics.P2.Body>this.body).moveRight(this.moveSpeed);
                    break;
                case -2:
                    this.playRight();
                    (<Phaser.Physics.P2.Body>this.body).moveRight(diagSpeed);
                    (<Phaser.Physics.P2.Body>this.body).moveDown(diagSpeed);
                    break;
                case -3:
                    this.playUpDown();
                    (<Phaser.Physics.P2.Body>this.body).moveDown(this.moveSpeed);
                    break;
                case -4:
                    this.playLeft();
                    (<Phaser.Physics.P2.Body>this.body).moveLeft(diagSpeed);
                    (<Phaser.Physics.P2.Body>this.body).moveDown(diagSpeed);
                    break;
                case -1:
                    this.playLeft();
                    (<Phaser.Physics.P2.Body>this.body).moveLeft(this.moveSpeed);
                    break;
                case 2:
                    this.playLeft();
                    (<Phaser.Physics.P2.Body>this.body).moveLeft(diagSpeed);
                    (<Phaser.Physics.P2.Body>this.body).moveUp(diagSpeed);
                    break;
                case 3:
                    this.playUpDown();
                    (<Phaser.Physics.P2.Body>this.body).moveUp(this.moveSpeed);
                    break;
                default:
                    this.playIdle();
                    break;
            }
        }

        playRight()
        {
            if (this.animations.currentAnim.name != "Right")
            {
                this.scale.x = 1;
                this.animations.play('Right');
            }

        }

        playLeft()
        {
            if(this.animations.currentAnim.name != "Left")
            {
                this.scale.x = -1;
                this.animations.play('Left');
            }
        }

        playIdle()
        {
            if(this.animations.currentAnim.name != "Idle")
            {
                this.animations.play('Idle');
            }
        }

        playUpDown()
        {
            if(this.scale.x < 0)
            {
                this.playLeft();
                return;
            }
            this.playRight();
        }
    }

    export interface GameObject
    {
        objectType: GameObjectType;
        currentLevel: GameStates.GameLevel & Phaser.State;
        moveSpeed: number;
    }
}