/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
module SongManager
{
    export class SongManager
    {
        playList: Array<Phaser.Sound>;
        currentSongNumb: number;
        game: Phaser.Game;

        constructor(game: Phaser.Game)
        {
            this.game = game;
            this.currentSongNumb = 0;
            this.playList = [];
            this.playList[0] = game.add.audio('Pershdal-Dung', 0.3, false);
            this.playList[1] = game.add.audio('Vines', 0.45, false);
            this.playList[2] = game.add.audio('The-Final-Choice', 0.3, false);
            this.playList[3] = game.add.audio('An-Alternate-Demonsion', 0.3, false);
            this.playList[4] = game.add.audio('I-Have-a-Bone-to-Pick-with-You', 0.3, false);
        }

        next()
        {
            this.playList[this.currentSongNumb].play().onStop.add(this.next, this);
            this.currentSongNumb = (this.currentSongNumb + 1) % this.playList.length;
        }

        static load(game: Phaser.Game)
        {
            game.load.audio('Pershdal-Dung', 'sounds/mp3/Pershdal Dungeons.mp3');
            game.load.audio('Vines', 'sounds/mp3/HollywoodVines.mp3');
            game.load.audio('The-Final-Choice', 'sounds/mp3/The Final Choice.mp3');
            game.load.audio('An-Alternate-Demonsion', 'sounds/mp3/An Alternate Demonsion.mp3');
            game.load.audio('I-Have-a-Bone-to-Pick-with-You', 'sounds/mp3/I have a Bone to Pick with You.mp3');
        }
    }
}