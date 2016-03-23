/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>

class MapLoader
{
    game: Phaser.Game;
    url: string;
    fileName: string;

    constructor(game: Phaser.Game, url: string, filename: string)
    {
        this.game = game;
        this.url = url;
        this.fileName = filename;
        (<any>this.game.load).tiledmap(Phaser.Plugin.Tiled.utils.cacheKey('test_01', 'tiledmap'), 'maps/test_01.json', null, Phaser.Tilemap.TILED_JSON);
    }

    generateMap()
    {
        //test

    }

    getData()
    {
        var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
        return this.game.cache.getTilemapData(cacheKey('test_01', 'tiledmap'));
    }
}