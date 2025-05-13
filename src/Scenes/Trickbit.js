class Trickbit extends Phaser.Scene {
    constructor() {
        super("trickbitScene");
    }

    init() {
        // Update your physics variables with the new parameters
        this.ACCELERATION = 4 * 100;      // Acceleration -10 (scaled up for Phaser's physics)
        this.MAX_SPEED = 2 * 100;          // Max Speed -7
        this.DECELERATION = 100 * 100;              // Deceleration -30
        this.JUMP_HEIGHT = -3 * 200;     // Jump Height -3 (negative because up is negative in screen coordinates)
        this.DOWN_GRAVITY = 2 * 1000;    // Down Gravity -2.5
        this.physics.world.gravity.y = this.DOWN_GRAVITY;
        this.AIR_ACCELERATION = this.ACCELERATION * 0.5; 
        this.AIR_DECELERATION = this.DECELERATION * 2; 
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
    // Handle left/right movement with max speed
        let onGround = my.sprite.player.body.blocked.down;
        let currentAcceleration = onGround ? this.ACCELERATION : this.AIR_ACCELERATION;
        let currentDeceleration = onGround ? this.DECELERATION : this.AIR_DECELERATION;

        if (cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-currentAcceleration);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            if (my.sprite.player.body.velocity.x < -this.MAX_SPEED) {
                my.sprite.player.body.velocity.x = -this.MAX_SPEED;
            }
        } else if (cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(currentAcceleration);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            if (my.sprite.player.body.velocity.x > this.MAX_SPEED) {
                my.sprite.player.body.velocity.x = this.MAX_SPEED;
            }
        } else {
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(currentDeceleration);
            if (onGround) {
                my.sprite.player.anims.play('idle');
            }
        }

        // Jump handling
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_HEIGHT);
        }
    }
}