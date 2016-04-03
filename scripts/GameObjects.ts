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
            this.moveSpeed = 250;
            this.keyListener = functionFile.setupWASDKeys(this.game);
            this.game.physics.arcade.enable(this);
            (<Phaser.Physics.Arcade.Body>this.body).collideWorldBounds = true;
        }


        update()
        {
            this.updateMovementControl();
        }

        updateMovementControl()
        {
            var xVel = 0.0;
            var yVel = 0.0;
            if(this.keyListener['s'].isDown)
            {
                yVel += this.moveSpeed;
            }
            if(this.keyListener['w'].isDown)
            {
                yVel -= this.moveSpeed;
            }
            if(this.keyListener['d'].isDown)
            {
                xVel += this.moveSpeed;
            }
            if(this.keyListener['a'].isDown)
            {
                xVel -= this.moveSpeed;
            }

            if (xVel != 0 && yVel != 0)
            {
                this.body.velocity.x = xVel * 0.7071;
                this.body.velocity.y = yVel * 0.7071;
            }
            else
            {
                this.body.velocity.x = xVel;
                this.body.velocity.y = yVel;
            }
        }
    }

    export interface GameObject
    {
        objectType: GameObjectType;
        currentLevel: GameStates.GameLevel & Phaser.State;
        moveSpeed: number;
    }
}