/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="GameObjects.ts"/>

module GameStates
{
    import Tiled = Phaser.Plugin.Tiled;
    import GameObject = GameObjects.GameObject;
    import game = PIXI.game;

    export class AITest extends Phaser.State implements GameLevel
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: GameObject & Phaser.Sprite;
        camera: Phaser.Camera;

        constructor()
        {
            super();
            this.mapName = 'Cave';
            this.mapURL = 'maps/Cave.json';
        }

        preload()
        {
            this.game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
            this.game.load.audio('Pershdal-Dung', 'sounds/mp3/Pershdal Dungeons.mp3')
        }

        create()
        {
            //Setup physics
            this.game.physics.startSystem(Phaser.Physics.P2JS);

            //Add tilemap
            this.map = (<any>this.game.add).tiledmap(this.mapName);
            this.game.time.advancedTiming = true;

            //Add player object
            this.player = new GameObjects.Player(this.game, 408, 280, this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);

            //Setup the camera
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(4.5);

            //Play music
            this.game.add.audio('Pershdal-Dung').play('',0, 0.3,true);
        }

        render()
        {
            this.game.debug.text(this.game.time.fps.toString(), 32, 32, '#00ff00');
        }
    }

    export class TiledMapLoader extends Phaser.State
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        StateToStart: GameLevel & Phaser.State;
        MainText: Phaser.Text;
        SubText: Phaser.Text;
        mapCacheKey: string;

        constructor(game: Phaser.Game, state: GameLevel & Phaser.State)
        {
            super();
            this.game = game;
            this.mapName = state.mapName;
            this.mapURL = state.mapURL;
            this.StateToStart = state;
            this.mapCacheKey = Phaser.Plugin.Tiled.utils.cacheKey(this.mapName, 'tiledmap');
        }

        preload()
        {
            this.MainText = this.game.add.text(this.game.width/2, this.game.height/2 - 80, 'Loading ' + this.mapName + " 0%", {fill: '#ffffff'});
            this.MainText.anchor.x = 0.5;
            this.SubText = this.game.add.text(this.game.width/2, this.game.height/2 + 80, 'Completed loading: ', {fill: '#ffffff'});
            this.SubText.anchor.x = 0.5;

            (<any>this.game.load).tiledmap(this.mapCacheKey, this.StateToStart.mapURL, null, Phaser.Tilemap.TILED_JSON);
            this.game.load.onFileComplete.add(this.fileCompleted, this);
        }

        create()
        {
            this.game.state.add(this.StateToStart.mapName, this.StateToStart, false);
            this.game.state.start(this.StateToStart.mapName, true, false);
            console.log('LoadCompleted');
        }

        fileCompleted(progress: number, cacheKey: string)
        {
            this.MainText.setText('Loading ' + this.mapName + ' ' + progress + "%");
            this.SubText.setText('Completed loading: ' + cacheKey);

            if (cacheKey == this.mapCacheKey)
            {
                var cacheKeyFunc = Phaser.Plugin.Tiled.utils.cacheKey;
                var cacheKey = this.mapCacheKey;

                var tileSets = this.game.cache.getTilemapData(cacheKey).data.tilesets;
                for (var n = 0; n < tileSets.length; n++)
                {
                    var currentSet = tileSets[n];
                    this.game.load.image(cacheKeyFunc(cacheKey.slice(0, -9),'tileset', currentSet.name), 'maps/' + currentSet.image);
                }
            }
        }

        shutdown()
        {
            this.game.load.onFileComplete.remove(this.fileCompleted, this);
            this.MainText.destroy();
            this.SubText.destroy();
            this.game.state.remove('TiledMapLoader');
        }
    }

    export interface GameLevel
    {
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: GameObject & Phaser.Sprite;
        camera: Phaser.Camera;
    }
}