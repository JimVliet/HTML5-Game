/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/GameStates.ts"/>
/// <reference path="scripts/GameObjects.ts"/>
/// <reference path="scripts/functionFile.ts"/>
/// <reference path="scripts/SongManager.ts"/>
/// <reference path="scripts/levels/Level1.ts"/>
/// <reference path="scripts/levels/SolidTest.ts"/>


var gameVar: MyGame.RPGame;
module MyGame
{
    export class RPGame {
        songManager: SongManager.SongManager;

        constructor(width: number, height: number) {
            this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create}, false, false);
        }

        game: Phaser.Game;

        preload()
        {
            this.game.add.plugin(new Phaser.Plugin.Tiled(this.game, this.game.stage));
            this.game.add.plugin(new (<any>Phaser.Plugin).Debug(this.game, this.game.stage));
            //Play music
            SongManager.SongManager.load(this.game);
        }

        create()
        {
            if(window.location.href.indexOf('objectConverter') != -1)
            {
                functionFile.loadGameLevel(this.game, new GameLevels.SolidTest());
            }
            else
            {
                gameVar.songManager = new SongManager.SongManager(this.game);
                gameVar.songManager.next();
                functionFile.loadGameLevel(this.game, new GameLevels.Level1());
            }
        }
    }
}

window.onload = () => {
    var winW = window.innerWidth;
    var winH = window.innerHeight;

    var widthAspectRatio = 16;
    var heightAspectRatio = 9;

    var aspectMultiplier = Math.min(winW/widthAspectRatio, winH/heightAspectRatio);

    gameVar = new MyGame.RPGame(aspectMultiplier*widthAspectRatio, aspectMultiplier*heightAspectRatio);
};