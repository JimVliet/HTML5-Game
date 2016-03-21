/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
var Tiled = Phaser.Plugin.Tiled;
var RPGame = (function () {
    function RPGame() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    RPGame.prototype.preload = function () {
        this.game.add.plugin(new Tiled(this.game, this.game.stage));
        var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
        this.game.load.tiledmap(cacheKey('test_01', 'tiledmap'), 'maps/test_01.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image(cacheKey('test_01', 'tileset', 'Grass shadow'), 'images/tilesets/002-G_Shadow01.png');
        this.game.load.image(cacheKey('test_01', 'tileset', '066-CF_Ground03'), 'images/tilesets/066-CF_Ground03.png');
    };
    RPGame.prototype.create = function () {
        var map = this.game.add.tiledmap('test_01');
    };
    return RPGame;
})();
window.onload = function () {
    var game = new RPGame();
};
//# sourceMappingURL=app.js.map