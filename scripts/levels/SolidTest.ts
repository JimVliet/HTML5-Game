/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../../app.ts"/>
/// <reference path="../GameObjects.ts"/>

module GameLevels
{
    import Tiled = Phaser.Plugin.Tiled;

    export class SolidTest extends Phaser.State implements GameStates.GameLevel
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: GameObjects.GameObject & Phaser.Sprite;

        constructor()
        {
            super();
            this.mapName = 'SolidTestMap';
            this.mapURL = 'maps/SolidTestMap.json';
        }

        customPreload(game: Phaser.Game)
        {
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
        }

        create()
        {
            this.setupCurrentLevel();
        }

        setupCurrentLevel()
        {
            this.game.physics.startSystem(Phaser.Physics.P2JS);
            this.map = (<any>this.game.add).tiledmap(this.mapName);
            this.game.time.advancedTiming = true;
            this.game.camera.scale.set(1);
            functionFile.setupSolidLayer(this.game, this.map.getTilelayer('Solid'), this.map, true);
        }

        render()
        {
            this.game.debug.text(this.game.time.fps.toString(), 32, 32, '#00ff00');
        }

    }
}