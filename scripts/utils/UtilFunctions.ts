/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../../app.ts"/>
/// <reference path="../Collision/CollisionTiles.ts"/>

module UtilFunctions
{
    import Polygon = Phaser.Polygon;
    import Level = GameLevels.Level;
    export function setupPlayerKeys(game: Phaser.Game): {[name: string]: Phaser.Key}
    {
        var keyLib: {[name: string]: Phaser.Key} = {};
        keyLib['w'] = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyLib['a'] = game.input.keyboard.addKey(Phaser.Keyboard.A);
        keyLib['s'] = game.input.keyboard.addKey(Phaser.Keyboard.S);
        keyLib['d'] = game.input.keyboard.addKey(Phaser.Keyboard.D);
        keyLib['space'] = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        return keyLib;
    }

    export function loadGameLevel(game: Phaser.Game, levelToLoad: Level)
    {
        game.state.add('TiledMapLoader', new GameStates.TiledMapLoader(game, levelToLoad), true);
    }

    export function sign(testNumb: number): number
    {
        if(testNumb < 0)
            return -1;
        if(testNumb > 0)
            return 1;
        return 0;
    }
}