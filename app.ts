/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/GameStates.ts"/>
/// <reference path="scripts/GameObjects.ts"/>
/// <reference path="scripts/utils/UtilFunctions.ts"/>
/// <reference path="scripts/SongManager.ts"/>
/// <reference path="scripts/levels/Level.ts"/>
/// <reference path="scripts/Collision/CollisionTiles.ts"/>

var gameVar: MyGame.Game;
module MyGame
{
    export class Game {
        songManager: SongManager.SongManager;
        game: Phaser.Game;

        constructor(width: number, height: number) {
            this.game = new Phaser.Game(width, height, Phaser.AUTO, 'content', { preload: this.preload, create: this.create}, false, false);
            this.songManager = null;
        }

        preload()
        {
            this.game.add.plugin(new Phaser.Plugin.Tiled(this.game, this.game.stage));
            this.game.add.plugin(new (<any>Phaser.Plugin).Debug(this.game, this.game.stage));
        }

        create()
        {
            UtilFunctions.loadGameLevel(this.game, new GameLevels.Level(this.game, Game.getNextLevel("Start")));
        }

        static getNextLevel(name: string): string
        {
            var levelList = ["Level1", "Level2", "Level3", "Level4", "Level5", "Level6", "LevelEnd"];
            if(name == "Start")
                return levelList[0];

            for(var i = 0; i < levelList.length-1; i++)
            {
                if(levelList[i] == name)
                    return levelList[i+1];
            }
            return null;
        }
    }
}

window.onload = () => {
    var winW = window.innerWidth;
    var winH = window.innerHeight;

    var widthAspectRatio = 16;
    var heightAspectRatio = 9;

    var aspectMultiplier = Math.min(winW/widthAspectRatio, winH/heightAspectRatio);

    gameVar = new MyGame.Game(aspectMultiplier*widthAspectRatio, aspectMultiplier*heightAspectRatio);
};
