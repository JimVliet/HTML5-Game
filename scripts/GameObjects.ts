/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="functionFile.ts"/>
/// <reference path="AnimationManager.ts"/>

module GameObjects
{
    import AnimManager = Manager.AnimManager;
    export enum GameObjectType
    {
        PLAYER
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