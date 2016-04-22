/// <reference path="../../lib/phaser.d.ts"/>
/// <reference path="../../lib/phaser-tiled.d.ts"/>
/// <reference path="../../app.ts"/>
/// <reference path="../GameObjects.ts"/>
/// <reference path="Level3.ts"/>
/// <reference path="../entities/Player.ts"/>

module GameLevels
{
    import Tiled = Phaser.Plugin.Tiled;
    import GameObject = GameObjects.GameObject;
    export class Level2 extends Phaser.State implements GameStates.GameLevel
    {
        game: Phaser.Game;
        mapName: string;
        mapURL: string;
        map: Tiled.Tilemap;
        player: GameObject & Phaser.Sprite;
        pathFinding: Pathfinding.Pathfinding;
        graphics: Phaser.Graphics;

        constructor()
        {
            super();
            this.mapName = 'Level2';
            this.mapURL = 'maps/Level2.json';
        }

        customPreload(game: Phaser.Game)
        {
            game.load.audio('Pershdal-Dung', 'sounds/mp3/Pershdal Dungeons.mp3');
            game.load.spritesheet('PlayerTileset', 'images/dungeon/rogue.png', 32, 32);
        }

        create()
        {
            this.setupCurrentLevel();

            this.graphics = this.game.add.graphics(0,0);
            this.pathFinding = new Pathfinding.Pathfinding(this.game, this.map, this.map.getTilelayer('Solid'));
            this.pathFinding.setupNodes();
            this.pathFinding.drawNodes();

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

            //Add player object
            this.player = new Entities.Player(this.game, 80, 744, this, 'PlayerTileset', 0);
            this.map.getTilelayer('Player').add(this.player);
            this.game.camera.follow(this.player);
            this.game.camera.scale.set(Math.max(1.5, 6 - (Math.round(3840/this.game.width)/2)));
        }

        setupNextLevel()
        {
            var nextLevelBody = this.game.physics.p2.createBody(848, 42, 0, false);
            nextLevelBody.addRectangle(this.map.tileWidth/8, this.map.tileHeight/4, this.map.tileWidth/2, this.map.tileHeight/4, 0);
            nextLevelBody.onBeginContact.add(this.nextLevel, this);
            this.game.physics.p2.addBody(nextLevelBody);
            this.map.getTilelayer('Solid').bodies.push(nextLevelBody);
        }

        nextLevel(body: any, bodyB: any, collidedShape: p2.Shape, contactShape: p2.Shape)
        {
            if(!contactShape.sensor)
            {
                functionFile.loadGameLevel(this.game, new GameLevels.Level3());
            }
        }

        render()
        {
            this.graphics.clear();
            this.graphics.beginFill();
            this.graphics.lineStyle(1, 0x6ACCBF, 0.5);
            var line = new Phaser.Line();
            for(var i = 0; i < this.pathFinding.nodeList.length; i++)
            {
                line.start.setTo(this.pathFinding.nodeList[i].x, this.pathFinding.nodeList[i].y);
                line.end.setTo(this.player.x, this.player.y + 16);
                if(!this.pathFinding.raycastLine(line))
                {
                    this.graphics.moveTo(this.pathFinding.nodeList[i].x, this.pathFinding.nodeList[i].y);
                    this.graphics.lineTo(this.player.x, this.player.y + 16);
                }
            }
            this.graphics.endFill();
        }
    }
}