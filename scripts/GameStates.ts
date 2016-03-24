/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>

module GameStates
{
    export class TiledMapLoader extends Phaser.State
    {
        game: Phaser.Game;

        preload()
        {
            var cacheKeyFunc = Phaser.Plugin.Tiled.utils.cacheKey;
            var cacheKey = cacheKeyFunc(game.mapName, 'tiledmap');
            var tileSets = this.game.cache.getTilemapData(cacheKey).data.tilesets;
            for (var n = 0; n < tileSets.length; n++)
            {
                var currentSet = tileSets[n];
                this.game.load.image(cacheKeyFunc(cacheKey.slice(0, -9),'tileset', currentSet.name), 'maps/' + currentSet.image);
            }
        }

        create()
        {
            (<any>this.game.add).tiledmap(game.mapName);
        }
    }
}