import Phaser from 'phaser';
import star from './assets/star.png';
import background from './assets/london.jpg';
import ground from './assets/platform.png';
import dude from './assets/dude_leila.png';
import selfridgesBag from './assets/selfridges-bag.png';
import icecream from './assets/icecream.png';
import burger from './assets/burger.png';

export default class Game {

    constructor(){
        this.phaser = new Phaser.Game(1280, 800, Phaser.AUTO, 'game', {
            preload: this.preload.bind(this),
            create: this.create.bind(this),
            update: this.update.bind(this)
        });
    }

    preload() {
        this.phaser.load.image('star', star);
        this.phaser.load.image('bag', selfridgesBag);
        this.phaser.load.image('background', background);
        this.phaser.load.image('ground', ground);
        this.phaser.load.image('icecream', icecream);
        this.phaser.load.image('burger', burger);
        this.phaser.load.spritesheet('dude', dude, 32, 48);


        console.log('Game pre-loaded...');
    }

    create() {

        this.phaser.physics.startSystem(Phaser.Physics.ARCADE);
        this.phaser.add.sprite(0,0,'background');

        this.platforms = this.phaser.add.group();
        this.platforms.enableBody = true;

        let ground = this.platforms.create(0, this.phaser.world.height - 40, 'ground');
        ground.scale.setTo(4, 4);

        ground.body.immovable = true;

        let shakeShackLedge = this.platforms.create(-150, 250, 'ground');
        shakeShackLedge.body.immovable = true;

        let selfridgesPlatform = this.platforms.create(400, 425, 'ground');
        selfridgesPlatform.scale.setTo(0.5, 1);
        selfridgesPlatform.body.immovable = true;

        let amnestyPlatform = this.platforms.create(600, 600, 'ground');
        amnestyPlatform.body.immovable = true;

        let boxParkPlatform = this.platforms.create(1000, 475, 'ground');
        boxParkPlatform.scale.setTo(0.75, 1);
        boxParkPlatform.body.immovable = true;

        this.player = this.phaser.add.sprite(32, this.phaser.world.height - 150, 'dude');

        this.phaser.physics.arcade.enable(this.player);

        this.player.body.bounce.y = 0.1;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        this.player.animations.add('left', [0,1,2,3], 10, true);
        this.player.animations.add('right', [5,6,7,8], 10, true);

        this.stars = this.phaser.add.group();
        this.stars.enableBody = true;

        // Add burgers to ShakeShack
        for(let i = 0; i < 3; i++) {
            let burger = this.stars.create(i * 70 + 15, 0, 'burger');
            burger.body.gravity.y = 60;
            burger.body.bounce.y = 0.35 + i * 0.05;
        }

        // Add bags to Selfridges
        for(let i = 0; i < 3; i++) {
            let bag = this.stars.create(i * 70 + 408, 200, 'bag');
            bag.body.gravity.y = 60;
            bag.body.bounce.y = 0.3 + i * 0.05;
        }

        // Add ice-cream to Box Park
        for(let i = 0; i < 3; i++) {
            let icecream = this.stars.create(i * 70 + 1050, 200, 'icecream');
            icecream.body.gravity.y = 60;
            icecream.body.bounce.y = 0.40 + i * 0.05;
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
