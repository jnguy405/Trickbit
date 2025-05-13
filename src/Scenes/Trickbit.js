class Trickbit extends Phaser.Scene {
    constructor() {
        super("trickbitScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 300;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -800;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        this.map = this.add.tilemap("Trickbit-level-1", 16, 16, 160, 32);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        const scaleSize = 1.5;
        // Create a layer
        this.baseLayer = this.map.createLayer("Base", this.tileset, 0, 0);
        this.pipesLayer = this.map.createLayer("Pipes", this.tileset, 0, 0);
        this.miscLayer = this.map.createLayer("Misc", this.tileset, 0, 0);
        this.baseLayer.setScale(scaleSize);
        this.pipesLayer.setScale(scaleSize);
        this.miscLayer.setScale(scaleSize);

        this.baseLayer.setPosition(0, 0);
        // Make it collidable
        this.baseLayer.setCollisionByProperty({
            collides: true
        });

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(0, game.config.height/2, "platformer_characters", "tile_0240.png").setScale(SCALE);
        my.sprite.player.setCollideWorldBounds(true); 
        // Configure the collision box size  
        my.sprite.player.body.setSize(10, 16); // (px)
        my.sprite.player.body.setOffset(3, 0); 

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.baseLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

    }

    update() {
        if(cursors.left.isDown) {
            // TODO: have the player accelerate to the left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

        } else if(cursors.right.isDown) {
            // TODO: have the player accelerate to the right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
        }
    }
}