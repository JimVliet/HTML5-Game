module GameStates
{
    export class GameOver extends Phaser.State
    {
        image: Phaser.Sprite;
        button: Phaser.Button;

        constructor(public game: Phaser.Game)
        {
            super();
        }

        preload()
        {
            this.image = this.game.add.sprite(0, 0, 'DeathScreen');
            this.game.camera.scale.setTo(1, 1);
            this.image.width = this.game.width;
            this.image.height = this.game.height;
            this.button = this.game.add.button(0.41*this.image.width, 0.69*this.game.height, undefined, function()
            {
                UtilFunctions.loadGameLevel(this.game, new GameLevels.Level(this.game, MyGame.Game.getNextLevel("Start")));
            });
            this.button.width = 0.55 * this.image.width - this.button.x;
            this.button.height = 0.75 * this.image.height - this.button.y;
        }
    }
    export class End extends Phaser.State
    {
        image: Phaser.Sprite;

        constructor(public game: Phaser.Game)
        {
            super();
        }

        preload()
        {
            this.image = this.game.add.sprite(0, 0, 'EndScreen');
            this.game.camera.scale.setTo(1, 1);
            this.image.width = this.game.width;
            this.image.height = this.game.height;
        }
    }
}