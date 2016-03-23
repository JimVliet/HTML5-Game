/// <reference path="../app.ts"/>
/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
var MapLoader = (function () {
    function MapLoader(game, url, filename) {
        this.game = game;
        this.url = url;
        this.fileName = filename;
        this.mapKey = Phaser.Plugin.Tiled.utils.cacheKey(filename, 'tiledmap');
        this.game.load.tiledmap(this.mapKey, url, null, Phaser.Tilemap.TILED_JSON);
    }
    MapLoader.prototype.addMap = function () {
        this.game.add.tiledmap(this.fileName);
    };
    MapLoader.prototype.getData = function () {
        return this.game.cache.getTilemapData(this.mapKey);
    };
    return MapLoader;
})();
/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/MapLoader.ts"/>
var Tiled = Phaser.Plugin.Tiled;
var game;
var RPGame = (function () {
    function RPGame() {
        this.game = new Phaser.Game(1280, 720, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
    }
    RPGame.prototype.preload = function () {
        this.game.load.onFileComplete.add(fileCompleted, this);
        this.game.add.plugin(new Tiled(this.game, this.game.stage));
        var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;
        this.map = new MapLoader(this.game, 'maps/mijn2.json', 'mijn2');
    };
    RPGame.prototype.fileCompleted = function (progress, cacheKey, totalLoaded, totalFiles) {
        console.log('Progress: ' + progress + " cacheKey: " + cacheKey);
        if (cacheKey.indexOf('_tiledmap') > 0) {
            var cacheKeyFunc = Phaser.Plugin.Tiled.utils.cacheKey;
            var tileSets = this.game.cache.getTilemapData(cacheKey).data.tilesets;
            for (var n = 0; n < tileSets.length; n++) {
                var currentSet = tileSets[n];
                console.log(currentSet);
                this.game.load.image(cacheKeyFunc(cacheKey.slice(0, -9), 'tileset', currentSet.name), 'maps/' + currentSet.image);
            }
        }
    };
    RPGame.prototype.create = function () {
        this.map.addMap();
    };
    return RPGame;
})();
function fileCompleted(progress, cacheKey, totalLoaded, totalFiles) {
    game.fileCompleted(progress, cacheKey, totalLoaded, totalFiles);
}
window.onload = function () {
    game = new RPGame();
};
//# sourceMappingURL=generated.js.map