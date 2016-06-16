/// <reference path="../lib/phaser.d.ts"/>
/// <reference path="../lib/phaser-tiled.d.ts"/>
/// <reference path="../app.ts"/>

module Manager
{
    export enum AnimType
    {
        LEFT, RIGHT, IDLE, UPDOWN, ATTACK, NONE, DIE
    }

    //Deze class zorgt ervoor dat je makkelijk animaties kan maken voor de player en de enemies.
    export class AnimManager
    {
        gameObject: Phaser.Sprite & GameObjects.Entity;
        current: AnimType;
        attackSignal: Phaser.Signal;

        constructor(GameObject:  Phaser.Sprite & GameObjects.Entity, options: {} = {'Attack': [30,31,32,33,34,35,36,37,38,39]})
        {
            this.gameObject = GameObject;
            this.gameObject.smoothed = false;
            this.gameObject.animations.add('Idle', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], 5, true);
            this.gameObject.animations.add('Walk', [20,21,22,23,24,25,26,27,28,29], 10, true);
            this.gameObject.animations.add('Attack', options['Attack'], 50, false).onComplete.add(this.attackDone, this);
            this.gameObject.animations.add('Die', [40,41,42,43,44,45,46,47,48,49], 5, false);
            this.gameObject.animations.play('Idle');
            this.current = AnimType.IDLE;

            this.attackSignal = new Phaser.Signal();
        }

        attack(animSpeed: number)
        {
            //Deze zorgt voor de attack animatie.
            if(this.current == AnimType.DIE)
                return;
            if(animSpeed < 0)
                this.gameObject.animations.play('Attack');
            else
                this.gameObject.animations.play('Attack', animSpeed, false);
            this.current = AnimType.ATTACK;
        }

        attackDone()
        {
            this.current = AnimType.NONE;
            this.attackSignal.dispatch();
        }

        die(): Phaser.Animation
        {
            this.current = AnimType.DIE;
            return this.gameObject.animations.play('Die');
        }

        updateAnimation(type: AnimType)
        {
            //Hierin kan je een animatietype opgeven en die wordt dan afgespeeld
            if(this.current == AnimType.ATTACK || this.current == AnimType.DIE) return;
            if(this.current == AnimType.NONE)
            {
                switch (type)
                {
                    case AnimType.LEFT:
                        this.gameObject.scale.x = -1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.LEFT;
                        return;
                    case AnimType.RIGHT:
                        this.gameObject.scale.x = 1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.RIGHT;
                        return;
                    case AnimType.UPDOWN:
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.UPDOWN;
                        return;
                    default:
                        this.gameObject.animations.play('Idle');
                        this.current = AnimType.IDLE;
                        return;
                }
            }

            switch (type)
            {
                case AnimType.LEFT:
                    if(this.current != AnimType.LEFT)
                    {
                        this.gameObject.scale.x = -1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.LEFT;
                    }
                    return;
                case AnimType.RIGHT:
                    if(this.current != AnimType.RIGHT)
                    {
                        this.gameObject.scale.x = 1;
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.RIGHT;
                    }
                    return;
                case AnimType.UPDOWN:
                    if(this.current != AnimType.UPDOWN)
                    {
                        this.gameObject.animations.play('Walk');
                        this.current = AnimType.UPDOWN;
                    }
                    return;
                default:
                    if(this.current != AnimType.IDLE)
                    {
                        this.gameObject.animations.play('Idle');
                        this.current = AnimType.IDLE;
                    }
                    return;
            }
        }
    }
}