/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="utils/UtilFunctions.ts"/>
/// <reference path="AnimationManager.ts"/>

module GameObjects
{
    import AnimManager = Manager.AnimManager;
    import Level = GameLevels.Level;
    import location = Pathfinding.location;
    export enum GameObjectType
    {
        PLAYER, SKELETON
    }

    export interface GameObject
    {
        currentLevel: Level;
        hitBox: p2.Rectangle;
    }

    export interface Entity extends GameObject
    {
        moveSpeed: number;
        baseMoveSpeed: number;
        moveSpeedMod: number;
        AnimManager: AnimManager;
        attackDelay: number;
    }

    export interface Mob extends Entity
    {
        path: Array<location>;

        updateAI(pathFinding: Pathfinding.Pathfinding): void;
    }
}