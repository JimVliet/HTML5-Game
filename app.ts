/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/GameStates.ts"/>
import Tiled = Phaser.Plugin.Tiled;
var game;
class RPGame {

    constructor(width: number, height: number) {
        this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create});
        this.mapName = 'mijn2';
        this.mapURL = 'maps/mijn2.json';
    }

    mapURL: string;
    mapName: string;
    game: Phaser.Game;

    loadMap(url: string, filename: string)
    {
        (<any>this.game.load).tiledmap(Phaser.Plugin.Tiled.utils.cacheKey(filename, 'tiledmap'), url, null, Phaser.Tilemap.TILED_JSON);
    }

    preload() {
        this.game.add.plugin(new Tiled(this.game, this.game.stage));
        game.loadMap(game.mapURL, game.mapName);
    }

    create() {
        this.game.state.add('TiledMapLoader', GameStates.TiledMapLoader, true);
    }

}

window.onload = () => {
    var winW = window.innerWidth;
    var winH = window.innerHeight;

    var widthAspectRatio = 16;
    var heightAspectRatio = 9;

    var aspectMultiplier = Math.min(winW/widthAspectRatio, winH/heightAspectRatio);

    game = new RPGame(aspectMultiplier*widthAspectRatio, aspectMultiplier*heightAspectRatio);

};