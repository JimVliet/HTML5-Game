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
    //Uit deze class worden alle levels gemaakt. Ik heb maar 1 class, zodat je makkelijk een nieuwe level kan maken.
    import Tiled = Phaser.Plugin.Tiled;
    import GameObject = GameObjects.GameObject;
    import CollisionManager = Collision.CollisionManager;
    import Mob = GameObjects.Mob;
    import Player = Entities.Player;
    import Skeleton = Entities.Skeleton;
    export class Level extends Phaser.State
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: Player;
        colManager: CollisionManager;
        graphics: Phaser.Graphics;
        mobs: Array<Skeleton>;

        constructor(game: Phaser.Game, map: string)
        {
            super();
            this.game = game;
            this.mapName = map;
            this.mapURL = 'maps/' + map + '.json';
            this.mobs = [];
        }

        customPreload(): void
        {
            this.game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
            this.game.load.spritesheet('Skeleton', 'images/dungeon/skeleton.png', 32, 32);
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
            //---------- Verander de variabele hieronder in true om de collision debug te weergeven --------------
            this.colManager.start(false);

            //Add player object and setup camera
            this.player = new Entities.Player(this.game, this.colManager.startPos[0], this.colManager.startPos[1], this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(Math.max(1.5, 6 - (Math.round(3840/this.game.width)/2)));

            this.graphics = this.game.add.graphics(0,0);

            //---------- Verander de variabele hieronder in true om de pathfinding debug te weergeven --------------
            this.colManager.startPathfinding(false);
        }

        update()
        {
            this.map.getTilelayer("Player").sort("y", Phaser.Group.SORT_ASCENDING);
        }

        nextLevel(body: any, bodyB: any, collidedShape: p2.Shape, contactShape: p2.Shape)
        {
            //Deze functie wordt gebruikt om te kijken of de player het einde van het level heeft bereikt.
            if(!contactShape.sensor && body.data.id == this.player.body.data.id)
            {
                var nextLvl = MyGame.Game.getNextLevel(this.mapName);
                if(nextLvl == null)
                    return;
                if(nextLvl == "End")
                {
                    this.game.state.add('End', new GameStates.End(this.game), true);
                }
                else
                    UtilFunctions.loadGameLevel(this.game, new Level(this.game, nextLvl));
            }
        }

        render()
        {
            this.game.debug.text("Health: " + this.player.health, 10, 40);
            this.game.debug.text("Controls: WASD to move and spacebar to attack", 10, 20);
        }
    }
}
