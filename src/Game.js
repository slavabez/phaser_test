import Phaser from 'phaser';
import star from './assets/star.png';
import sky from './assets/sky.png';
import ground from './assets/platform.png';
import dude from './assets/dude.png';

export default class Game {

    constructor(){
        this.phaser = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this)
        });
    }

    preload() {
        this.phaser.load.image('star', star);
        this.phaser.load.image('sky', sky);
        this.phaser.load.image('ground', ground);
        this.phaser.load.spritesheet('dude', dude, 32, 48);


        console.log('Game pre-loaded...');
    }

    create() {

        this.phaser.physics.startSystem(Phaser.Physics.ARCADE);
        this.phaser.add.sprite(0,0,'sky');

        this.platforms = this.phaser.add.group();
        this.platforms.enableBody = true;

        let ground = this.platforms.create(0, this.phaser.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);

        ground.body.immovable = true;

        let ledge = this.platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;

        ledge = this.platforms.create(-150, 250, 'ground');

        ledge.body.immovable = true;

        this.player = this.phaser.add.sprite(32, this.phaser.world.height - 150, 'dude');

        this.phaser.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        this.player.animations.add('left', [0,1,2,3], 10, true);
        this.player.animations.add('right', [5,6,7,8], 10, true);

        this.stars = this.phaser.add.group();
        this.stars.enableBody = true;

        for(let i = 0; i < 12; i++) {
            let star = this.stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 6;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        this.score = 0;
        this.scoreText = this.phaser.add.text(16, 16, 'Очки: 0', { fontSize: '32px', fill: '#000' });

        console.log('Game created');
    }

    update() {
        let hitPlatform = this.phaser.physics.arcade.collide(this.player, this.platforms);
        this.phaser.physics.arcade.collide(this.stars, this.platforms);
        this.phaser.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

        let cursors = this.phaser.input.keyboard.createCursorKeys();

        this.player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }
        else if (cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        } else {
            this.player.animations.stop();
            this.player.frame = 4;
        }

        if (cursors.up.isDown && this.player.body.touching.down && hitPlatform){
            this.player.body.velocity.y = -350;
        }

        if (this.score === 120){
            this.scoreText.text = 'Победа!';
        }

    }

    collectStar(player, star){
        star.kill();

        this.score += 10;
        this.scoreText.text = 'Очки: ' + this.score;
    }
}
