/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="GameObjects.ts"/>

module GameStates
{
    import Tiled = Phaser.Plugin.Tiled;
    import GameObject = GameObjects.GameObject;
    import Color = Phaser.Color;
    import Game = Phaser.Game;

    export class AITest extends Phaser.State implements GameLevel
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: GameObject & Phaser.Sprite;

        constructor()
        {
            super();
            this.mapName = 'Cave';
            this.mapURL = 'maps/Cave.json';
        }

        customPreload(game: Phaser.Game)
        {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
            game.load.audio('Pershdal-Dung', 'sounds/mp3/Pershdal Dungeons.mp3');
            //game.load.audio('HollywoodVines', 'sounds/mp3/HollywoodVines.mp3');
        }

        create()
        {
            this.setupCurrentLevel();

            //Play music
            this.game.add.audio('Pershdal-Dung').play(undefined, 0, 0.3, true);
            this.setupNextLevel();
        }

        setupCurrentLevel()
        {
            //Setup physics
            this.game.physics.startSystem(Phaser.Physics.P2JS);

            //Add tilemap and setup the solid layer
            this.map = (<any>this.game.add).tiledmap(this.mapName);
            this.game.time.advancedTiming = true;

            //Setup the object layer
            functionFile.setupSolidLayer(this.game, this.map.getTilelayer('Solid'), this.map, false);

            //Add player object and setup camera
            this.player = new GameObjects.Player(this.game, 408, 280, this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(4.5);
        }

        setupNextLevel()
        {
            var nextLevelBody = this.game.physics.p2.createBody(128, 74, 0, false);
            nextLevelBody.addRectangle(this.map.tileWidth/8, this.map.tileHeight/4, this.map.tileWidth/2, this.map.tileHeight/4, 0);
            nextLevelBody.onBeginContact.add(this.nextLevel, this);
            this.game.physics.p2.addBody(nextLevelBody);
            this.map.getTilelayer('Solid').bodies.push(nextLevelBody);
        }

        nextLevel()
        {
            loadGameLevel(this.game, new Level2());
        }

        render()
        {
            this.game.debug.text(this.game.time.fps.toString(), 32, 32, '#00ff00');
        }
    }

    export class Level2 extends Phaser.State implements GameLevel
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: GameObject & Phaser.Sprite;

        constructor()
        {
            super();
            this.mapName = 'Level2';
            this.mapURL = 'maps/Level2.json'
        }

        customPreload(game: Phaser.Game)
        {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
            game.load.audio('HollywoodVines', 'sounds/mp3/HollywoodVines.mp3');
        }

        create()
        {
            this.setupCurrentLevel();
            //Play music
            this.game.add.audio('HollywoodVines').play(undefined, 0, 0.5, true);
        }

        setupCurrentLevel()
        {
            //Setup physics
            this.game.physics.startSystem(Phaser.Physics.P2JS);

            //Add tilemap and setup the solid layer
            this.map = (<any>this.game.add).tiledmap(this.mapName);
            this.game.time.advancedTiming = true;

            //Setup the object layer
            functionFile.setupSolidLayer(this.game, this.map.getTilelayer('Solid'), this.map, false);

            //Add player object
            this.player = new GameObjects.Player(this.game, 120, 930, this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(4.5);
        }

        render()
        {
            this.game.debug.text(this.game.time.fps.toString(), 32, 32, '#00ff00');
        }
    }

    export class SolidTest extends Phaser.State implements GameLevel
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: GameObject & Phaser.Sprite;

        constructor()
        {
            super();
            this.mapName = 'Level2';
            this.mapURL = 'maps/Level2.json';
        }

        customPreload(game: Phaser.Game)
        {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
        }

        create()
        {
            this.setupCurrentLevel();
        }

        setupCurrentLevel()
        {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.map = (<any>this.game.add).tiledmap(this.mapName);
            this.game.time.advancedTiming = true;
            this.game.camera.scale.set(1);
            functionFile.setupSolidLayer(this.game, this.map.getTilelayer('Solid'), this.map, true);
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

            //Load the custom assets needed for the state
            this.StateToStart.customPreload(this.game);
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

                var tileSets = this.game.cache.getTilemapData(this.mapCacheKey).data.tilesets;
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

        customPreload(game: Phaser.Game): void;
        setupCurrentLevel(): void;
    }
}