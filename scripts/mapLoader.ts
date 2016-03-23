/// <reference path="../app.ts"/>
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>

class MapLoader
{
    game: Phaser.Game;
    url: string;
    fileName: string;
    mapKey: string;

    constructor(game: Phaser.Game, url: string, filename: string)
    {
        this.game = game;
        this.url = url;
        this.fileName = filename;
        this.mapKey = Phaser.Plugin.Tiled.utils.cacheKey(filename, 'tiledmap');
        (<any>this.game.load).tiledmap(this.mapKey, url, null, Phaser.Tilemap.TILED_JSON);
    }

    addMap()
    {
        (<any>this.game.add).tiledmap(this.fileName);
    }

    getData()
    {
        return this.game.cache.getTilemapData(this.mapKey);
    }
}