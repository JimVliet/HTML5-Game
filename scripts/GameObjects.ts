/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="utils/UtilFunctions.ts"/>
/// <reference path="AnimationManager.ts"/>

module GameObjects
{
    import AnimManager = Manager.AnimManager;
    import Level = GameLevels.Level;
    export enum GameObjectType
    {
        PLAYER
    }

    export interface GameObject
    {
        currentLevel: Level;
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