/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
module SongManager
{
    export class playList
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
            this.playList[1] = game.add.audio('The-Final-Choice', 0.3, false);
            this.playList[2] = game.add.audio('Saviour-in-the-Dark', 0.3, false);
            this.playList[3] = game.add.audio('Orcward-Silences', 0.3, false);
            this.playList[4] = game.add.audio('An-Alternate-Demonsion', 0.3, false);
            this.playList[5] = game.add.audio('Sulphur-So-Good', 0.3, false);
            this.playList[6] = game.add.audio('The-Spinal-Tap-Dance', 0.3, false);
            this.playList[7] = game.add.audio('I-Have-a-Bone-to-Pick-with-You', 0.3, false);
            this.playList[8] = game.add.audio('The-Party-Shop', 0.3, false);
            this.playList[9] = game.add.audio('TinyKeep', 0.3, false);
        }

        next()
        {
            this.playList[this.currentSongNumb].play().onStop.add(this.next, this);
            this.currentSongNumb = (this.currentSongNumb + 1) % this.playList.length;
        }

        static load(game: Phaser.Game)
        {
            game.load.audio('Pershdal-Dung', 'sounds/mp3/Pershdal Dungeons.mp3');
            game.load.audio('The-Final-Choice', 'sounds/mp3/The Final Choice.mp3');
            game.load.audio('Saviour-in-the-Dark', 'sounds/mp3/Saviour in the Dark.mp3');
            game.load.audio('Orcward-Silences', 'sounds/mp3/Orcward Silences.mp3');
            game.load.audio('An-Alternate-Demonsion', 'sounds/mp3/An Alternate Demonsion.mp3');
            game.load.audio('Sulphur-So-Good', 'sounds/mp3/Sulphur so Good.mp3');
            game.load.audio('The-Spinal-Tap-Dance', 'sounds/mp3/The Spinal Tap-Dance.mp3');
            game.load.audio('I-Have-a-Bone-to-Pick-with-You', 'sounds/mp3/I have a Bone to Pick with You.mp3');
            game.load.audio('The-Party-Shop', 'sounds/mp3/The Party Shop.mp3');
            game.load.audio('TinyKeep', 'sounds/mp3/TinyKeep.mp3');
        }
    }
}