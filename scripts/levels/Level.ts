/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../../app.ts"/>
/// <reference path="../GameObjects.ts"/>
/// <reference path="../SongManager.ts"/>
/// <reference path="../Collision/Pathfinding.ts"/>
/// <reference path="../entities/Player.ts"/>
/// <reference path="../Collision/CollisionManager.ts"/>

module GameLevels
{
    import Tiled = Phaser.Plugin.Tiled;
    import GameObject = GameObjects.GameObject;
    import CollisionManager = Collision.CollisionManager;
    export class Level extends Phaser.State
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: GameObject & Phaser.Sprite;
        colManager: CollisionManager;
        graphics: Phaser.Graphics;

        constructor(game: Phaser.Game, map: string)
        {
            super();
            this.game = game;
            this.mapName = map;
            this.mapURL = 'maps/' + map + '.json';
        }

        customPreload(): void
        {
            this.game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
        }

        create()
        {
            //Setup physics
            this.game.physics.startSystem(Phaser.Physics.P2JS);

            //Add tilemap and setup the solid layer
            this.map = (<any>this.game.add).tiledmap(this.mapName);
            this.game.time.advancedTiming = true;

            //Setup collision and pathFinding
            this.colManager = new Collision.CollisionManager(this, this.map, this.map.getTilelayer('Solid'));
            this.colManager.start(false);

            //Add player object and setup camera
            this.player = new Entities.Player(this.game, this.colManager.startPos[0], this.colManager.startPos[1], this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(Math.max(1.5, 6 - (Math.round(3840/this.game.width)/2)));

            this.graphics = this.game.add.graphics(0,0);

            this.colManager.startPathfinding(false);
        }

        nextLevel(body: any, bodyB: any, collidedShape: p2.Shape, contactShape: p2.Shape)
        {
            if(!contactShape.sensor)
            {
                var nextLvl = MyGame.Game.getNextLevel(this.mapName);
                if(nextLvl == null)
                    return;
                UtilFunctions.loadGameLevel(this.game, new Level(this.game, nextLvl));
            }
        }

        render()
        {
            //this.graphics.clear();
            //this.colManager.pathFinding.debugVisibleNodes(this.player.x, this.player.y +16, this.graphics);
        }
    }
}
