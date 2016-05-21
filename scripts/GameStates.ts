/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>
/// <reference path="GameObjects.ts"/>

module GameStates
{
    import Tiled = Phaser.Plugin.Tiled;
    import Level = GameLevels.Level;

    export class TiledMapLoader extends Phaser.State
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        StateToStart: Level;
        MainText: Phaser.Text;
        SubText: Phaser.Text;
        mapCacheKey: string;

        constructor(game: Phaser.Game, state: Level)
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
            if(gameVar.songManager == null)
            {
                SongManager.SongManager.load(this.game);
            }
            this.game.camera.scale.setTo(1, 1);
            this.MainText = this.game.add.text(this.game.width/2, this.game.height/2 - 80, 'Loading ' + this.mapName + " 0%", {fill: '#ffffff'});
            this.MainText.anchor.x = 0.5;
            this.SubText = this.game.add.text(this.game.width/2, this.game.height/2 + 80, 'Completed loading: ', {fill: '#ffffff'});
            this.SubText.anchor.x = 0.5;

            (<any>this.game.load).tiledmap(this.mapCacheKey, this.StateToStart.mapURL, null, Phaser.Tilemap.TILED_JSON);

            //Load the custom assets needed for the state
            this.StateToStart.customPreload();
            this.game.load.onFileComplete.add(this.fileCompleted, this);
        }

        create()
        {
            //Play music
            if(gameVar.songManager == null)
                gameVar.songManager = new SongManager.SongManager(this.game);

            this.game.state.add(this.StateToStart.mapName, this.StateToStart, false);
            this.game.state.start(this.StateToStart.mapName, true, false);
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
            this.game.state.remove('TiledMapLoader');
        }
    }
}