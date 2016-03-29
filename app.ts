/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/GameStates.ts"/>

module MyGame
{
    export class RPGame {

        constructor(width: number, height: number) {
            this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create});
        }

        game: Phaser.Game;

        preload()
        {
            this.game.add.plugin(new Phaser.Plugin.Tiled(this.game, this.game.stage));
        }

        create()
        {
            loadGameLevel(this.game, new GameStates.AITest());
        }
    }
}
function loadGameLevel(game: Phaser.Game, levelToLoad: GameStates.GameLevel & Phaser.State)
{
    game.state.add('TiledMapLoader', new GameStates.TiledMapLoader(game, levelToLoad), false);
    game.state.start('TiledMapLoader', true, true);
}

window.onload = () => {
    var winW = window.innerWidth;
    var winH = window.innerHeight;

    var widthAspectRatio = 16;
    var heightAspectRatio = 9;

    var aspectMultiplier = Math.min(winW/widthAspectRatio, winH/heightAspectRatio);

    var gameVar = new MyGame.RPGame(aspectMultiplier*widthAspectRatio, aspectMultiplier*heightAspectRatio);
};