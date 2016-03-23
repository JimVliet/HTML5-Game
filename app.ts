/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/MapLoader.ts"/>

import Tiled = Phaser.Plugin.Tiled;
var game;
class RPGame {

    constructor() {
        this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', { preload: this.preload, create: this.create});
    }

    game: Phaser.Game;
    map: MapLoader;

    preload() {
        this.game.load.onFileComplete.add(fileCompleted, this);
        this.game.add.plugin(new Tiled(this.game, this.game.stage));
        var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
        this.map = new MapLoader(this.game, 'maps/mijn2.json', 'mijn2');
    }

    fileCompleted(progress: number, cacheKey: string, totalLoaded: number, totalFiles: number)
    {
        console.log('Progress: ' + progress + " cacheKey: " + cacheKey);
        if (cacheKey.indexOf('_tiledmap') > 0)
        {
            var cacheKeyFunc = Phaser.Plugin.Tiled.utils.cacheKey;
            var tileSets =  this.game.cache.getTilemapData(cacheKey).data.tilesets;
            for (var n = 0; n < tileSets.length; n++)
            {
                var currentSet = tileSets[n];
                console.log(currentSet);
                this.game.load.image(cacheKeyFunc(cacheKey.slice(0, -9),'tileset', currentSet.name), 'maps/' + currentSet.image);
            }
        }
    }


    create() {
        this.map.addMap();
    }

}

function fileCompleted(progress: number, cacheKey: string, totalLoaded: number, totalFiles: number): void
{
    game.fileCompleted(progress, cacheKey, totalLoaded, totalFiles);
}

window.onload = () => {

    game = new RPGame();

};