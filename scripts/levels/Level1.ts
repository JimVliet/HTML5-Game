/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../../app.ts"/>
/// <reference path="../GameObjects.ts"/>
/// <reference path="../entities/Player.ts"/>
/// <reference path="Level2.ts"/>

module GameLevels
{
    import Tiled = Phaser.Plugin.Tiled;
    import GameObject = GameObjects.GameObject;
    export class Level1 extends Phaser.State implements GameStates.GameLevel
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: GameObject & Phaser.Sprite;

        constructor()
        {
            super();
            this.mapName = 'Level1';
            this.mapURL = 'maps/Level1.json';
        }

        customPreload(game: Phaser.Game)
        {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
            game.load.audio('Pershdal-Dung', 'sounds/mp3/Pershdal Dungeons.mp3');
            game.load.audio('The-Final-Choice', 'sounds/mp3/The Final Choice.mp3');
            game.load.audio('Saviour-in-the-Dark', 'sounds/mp3/Saviour in the Dark.mp3');
            game.load.audio('Orcward-Silences', 'sounds/mp3/Orcward Silences.mp3');
            game.load.audio('An-Alternate-Demonsion', 'sounds/mp3/An Alternate Demonsion.mp3');
            game.load.audio('Sulphur-so-Good', 'sounds/mp3/Sulphur so Good.mp3');
            game.load.audio('The-Spinal-Tap-Dance', 'sounds/mp3/The Spinal Tap-Dance.mp3');
            game.load.audio('I-Have-a-Bone-to-Pick-with-You', 'sounds/mp3/I have a Bone to Pick with You.mp3');
            game.load.audio('The-Party-Shop', 'sounds/mp3/The Party Shop.mp3');
            game.load.audio('TinyKeep', 'sounds/mp3/TinyKeep');
            //game.load.audio('HollywoodVines', 'sounds/mp3/HollywoodVines.mp3');
        }

        create()
        {
            this.setupCurrentLevel();

            //Play music
            this.game.add.audio('Pershdal-Dung').play(undefined, 0, 0.3, false).onStop.add(functionFile.nextSong, undefined, undefined, this.game, 'Pershdal-Dung');
            this.setupNextLevel();
        }

        setupCurrentLevel()
        {
            //Setup physics
            this.game.physics.startSystem(Phaser.Physics.P2JS);

            //Add tilemap and setup the solid layer
            this.map = (<any>this.game.add).tiledmap(this.mapName);
            this.game.time.advancedTiming = true;

            //Setup the object layer
            functionFile.setupSolidLayer(this.game, this.map.getTilelayer('Solid'), this.map, false);

            //Add player object and setup camera
            this.player = new Entities.Player(this.game, 408, 280, this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(Math.max(1.5, 6 - (Math.round(3840/this.game.width)/2)));
        }

        setupNextLevel()
        {
            var nextLevelBody = this.game.physics.p2.createBody(128, 74, 0, false);
            nextLevelBody.addRectangle(this.map.tileWidth/8, this.map.tileHeight/4, this.map.tileWidth/2, this.map.tileHeight/4, 0);
            nextLevelBody.onBeginContact.add(this.nextLevel, this);
            this.game.physics.p2.addBody(nextLevelBody);
            this.map.getTilelayer('Solid').bodies.push(nextLevelBody);
        }

        nextLevel(body: any, bodyB: any, collidedShape: p2.Shape, contactShape: p2.Shape)
        {
            if(!contactShape.sensor)
            {
                functionFile.loadGameLevel(this.game, new GameLevels.Level2());
            }
        }
    }
}