/// <reference path="lib/phaser.d.ts"/>
/// <reference path="lib/phaser-tiled.d.ts"/>
/// <reference path="scripts/LevelLoader.ts"/>
/// <reference path="scripts/GameObjects.ts"/>
/// <reference path="scripts/utils/UtilFunctions.ts"/>
/// <reference path="scripts/SongManager.ts"/>
/// <reference path="scripts/levels/Level.ts"/>
/// <reference path="scripts/Collision/CollisionTiles.ts"/>

var gameVar: MyGame.Game;
module MyGame
{
    //Dit is de hoofdclass waarin de basis staat.
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
            this.game.load.spritesheet("Snek", "images/dungeon/Snaksprite.png", 32, 32);
            this.game.load.image("DeathScreen", "images/dungeon/DeathScreen.png");
            this.game.load.image("EndScreen", "images/dungeon/EndScreen.png");
            this.game.load.image("StartScreen", "images/dungeon/BeginScherm.png");
        }

        create()
        {
            this.game.state.add('Start', new GameStates.StartScreen(this.game), true);
        }

        static getNextLevel(name: string): string
        {
            //Deze functie geeft de naam van het volgende level weer.
            //Je kan heel makkelijk een level toevoegen door het aan deze lijst van namen toe te voegen.
            //Het moet dan wel aan enkele voorwaarden voldoen.
            //Zoals een collision laag en een trigger laag. Zodat er triggers enemies kunnen worden ingezet
            //en het einde van het level kan dan worden aangegeven.
            var levelList = ["Level1", "Level2", "Level3", "Level4", "Level5", "Level6", "LevelEnd"];
            if(name == "Start")
                return levelList[0];

            for(var i = 0; i < levelList.length-1; i++)
            {
                if(levelList[i] == name)
                    return levelList[i+1];
            }
            if(name == levelList[levelList.length-1])
                return "End";
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
