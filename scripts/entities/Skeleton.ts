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
