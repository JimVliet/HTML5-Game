/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>

module GameStates
{
    export class MineLevel extends Phaser.State implements GameLevel
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        counter: number;

        constructor()
        {
            super();
            this.counter = 0;
            this.mapName = 'mijn2';
            this.mapURL = 'maps/mijn2.json';
        }

        create()
        {
            (<any>this.game.add).tiledmap(this.mapName);
            this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
        }

        updateCounter()
        {
            this.counter++;
            if (this.counter == 6)
            {
                loadGameLevel(this.game, new BeginMap2());
            }
        }
    }

    export class BeginMap2 extends Phaser.State implements GameLevel
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        counter: number;

        constructor()
        {
            super();
            this.counter = 0;
            this.mapName = 'BEGINMAP2';
            this.mapURL = 'maps/BEGINMAP2.json';
        }

        create()
        {
            (<any>this.game.add).tiledmap(this.mapName);
            this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
        }

        updateCounter()
        {
            this.counter++;
            if (this.counter == 6)
            {
                loadGameLevel(this.game, new MineLevel());
            }
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

        constructor(game: Phaser.Game, mapName: string, mapURL: string, state: GameLevel & Phaser.State)
        {
            super();
            this.game = game;
            this.mapName = mapName;
            this.mapURL = mapURL;
            this.StateToStart = state;
        }

        preload()
        {
            this.MainText = this.game.add.text(this.game.width/2, this.game.height/2 - 80, 'Loading ' + this.mapName + " 0%", {fill: '#ffffff'});
            this.MainText.anchor.x = 0.5;
            this.SubText = this.game.add.text(this.game.width/2, this.game.height/2 + 80, 'Completed loading: ', {fill: '#ffffff'});
            this.SubText.anchor.x = 0.5;

            this.game.state.add(this.StateToStart.mapName, this.StateToStart, false);
            (<any>this.game.load).tiledmap(Phaser.Plugin.Tiled.utils.cacheKey(this.StateToStart.mapName, 'tiledmap'), this.StateToStart.mapURL, null, Phaser.Tilemap.TILED_JSON);
        }

        create()
        {
            this.game.load.onFileComplete.add(this.fileCompleted, this);
            var cacheKeyFunc = Phaser.Plugin.Tiled.utils.cacheKey;
            var cacheKey = cacheKeyFunc(this.mapName, 'tiledmap');

            var tileSets = this.game.cache.getTilemapData(cacheKey).data.tilesets;
            for (var n = 0; n < tileSets.length; n++)
            {
                var currentSet = tileSets[n];
                this.game.load.image(cacheKeyFunc(cacheKey.slice(0, -9),'tileset', currentSet.name), 'maps/' + currentSet.image);
            }

            this.game.load.onLoadComplete.addOnce(this.loadCompleted, this);
            this.game.load.start();
        }

        fileCompleted(progress: number, cacheKey: string)
        {
            this.MainText.setText('Loading ' + this.mapName + ' ' + progress + "%");
            this.SubText.setText('Completed loading: ' + cacheKey);
        }

        loadCompleted()
        {
            this.game.state.start(this.StateToStart.mapName, true, false);
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
    }
}