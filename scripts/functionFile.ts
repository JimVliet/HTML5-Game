/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>

module functionFile
{
    export function setupWASDKeys(game: Phaser.Game)
    {
        var keyLib = {};
        keyLib['w'] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyLib['a'] = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyLib['s'] = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyLib['d'] = game.input.keyboard.addKey(Phaser.Keyboard.D);
        return keyLib;
    }

    export function convertTiledMapLayer(map: Phaser.Plugin.Tiled.Tilemap, layer: Phaser.Plugin.Tiled.Tilelayer)
    {
        var tile;
        for(var y = 0, h = layer.size.y; y < h; y++)
        {
            for(var x = 0, w= layer.size.x; x < w; x++)
            {
                if(!layer.tiles[y]) continue;

                tile = layer.tiles[y][x];
            }
        }
    }
}