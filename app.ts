/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>

import Tiled = Phaser.Plugin.Tiled;
class RPGame {

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }

    game: Phaser.Game;

    preload() {
        this.game.add.plugin(new Tiled(this.game, this.game.stage));
        var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
        (<any>this.game.load).tiledmap(cacheKey('test_01', 'tiledmap'), 'maps/test_01.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image(cacheKey('test_01', 'tileset', 'Grass shadow'), 'images/tilesets/002-G_Shadow01.png');
        this.game.load.image(cacheKey('test_01', 'tileset', '066-CF_Ground03'), 'images/tilesets/066-CF_Ground03.png');
    }

    create() {
        var map = (<any>this.game.add).tiledmap('test_01');
    }

}

window.onload = () => {

    var game = new RPGame();

};