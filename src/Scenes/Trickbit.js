// ----------------------------------------------------------------------------------------------------------------
// TO-DO LIST 
    // Player Physics (done)
    // Camera movement (done)
    // Canvas config (done, might tweak)
    // Spikes collision logic (done)
    // Enemy collision logic (still deciding)
    // Key collect logic (done)
    // platform "falling" logic 
    // key unlock door logic (done)
    // audio for walking, jumping, opening chest, and dying (done)
    // create the end game scene

// for funsies
    // funny bird killing animation (falls/dies upon overlap but doesn't infringe on the player's momentum/path)
    // level progress bar
    // key is being "held" by the player
// ----------------------------------------------------------------------------------------------------------------
class Trickbit extends Phaser.Scene {
    constructor() {
        super("trickbitScene");
    }

    init() {
        // Player Physics
        this.ACCELERATION = 4 * 100;    
        this.MAX_SPEED = 2 * 100;         
        this.DECELERATION = 100 * 100;    
        this.JUMP_HEIGHT = -3 * 200;  
        this.DOWN_GRAVITY = 2 * 1000;    
        this.physics.world.gravity.y = this.DOWN_GRAVITY;
        this.AIR_ACCELERATION = this.ACCELERATION * 0.5; 
        this.AIR_DECELERATION = this.DECELERATION * 2; 
        this.PARTICLE_VELOCITY = 50;

        // Camera Config
        this.targetZoom = 3;
        this.targetOffsetX = 0;
        this.currentOffsetX = 0;
        this.offsetLerpSpeed = 0.01; 

        // Tile Bias for spike collision idk i picked a random high number and it works
        this.physics.world.TILE_BIAS = 40;

        this.lastStepX = 0;          // Tracks the last X position where a step sound played
        this.stepDistance = 64;      // Play sound every 32 pixels
        this.playerHealth = 100;
    }

    preload() {
        // Scene Plug-In by Jim Whitehead (modified, https://github.com/JimWhiteheadUCSC/TileAnimation.git)
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    // Object Creation Helper Function
    createGameObjects(layerName, objectName, frameId) {
        const scaleSize = 2.0;
        
        // Create the objects from the layer
        const objects = this.map.createFromObjects(layerName, {
            name: objectName,
            key: "tilemap_sheet",
            frame: frameId
        });
        
        // Apply scaling and physics to all objects
        objects.forEach(obj => {
            obj.setScale(scaleSize);
            obj.x = obj.x * scaleSize;
            obj.y = obj.y * scaleSize;
        });
        
        // Enable physics
        this.physics.world.enable(objects, Phaser.Physics.Arcade.STATIC_BODY);
        
        return objects;
    }

    create() {
        // 16x16 tiles 160W 32H map (for scale = 2: 5120W 1024H px canvas (main.js))
        this.map = this.add.tilemap("Trickbit-level-1", 16, 16, 160, 32);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");

        const scaleSize = 2.0;
        // Create layers
        this.baseLayer = this.map.createLayer("Base", this.tileset, 0, 0).setScale(scaleSize);
        this.pipesLayer = this.map.createLayer("Pipes", this.tileset, 0, 0).setScale(scaleSize);
        this.miscLayer = this.map.createLayer("Misc", this.tileset, 0, 0).setScale(scaleSize);
        this.deathLayer = this.map.createLayer("Death", this.tileset, 0, 0).setScale(scaleSize);
        this.enemyLayer = this.map.createLayer("Enemy", this.tileset, 0, 0).setScale(scaleSize);

        // Create game objects using the helper function
        this.keyobj = this.createGameObjects("Keys", "Key", 96);
        this.door = this.createGameObjects("Doors", "door", 56);
        this.chests = this.createGameObjects("Chests", "chest", 389);

        // Make base collidable
        this.baseLayer.setCollisionByProperty({
            collides: true
        });

        this.deathLayer.setCollisionByProperty({
            collides: true
        });

        this.enemyLayer.setCollisionByProperty({
            collides: true
        });

        // Player config ----------
        my.sprite.player = this.physics.add.sprite(0, game.config.height/2, "tile_0240.png").setScale(SCALE);
        my.sprite.player.setCollideWorldBounds(true); 

        // Configure the collision box size  
        my.sprite.player.body.setSize(12, 16).setOffset(2, 0);

        // Player Movement Particles
        this.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['magic_01.png', 'magic_02.png'],
            scale: {start: 0.01, end: 0.05, random: true},
            lifespan: 300, maxAliveParticles: 6,
            alpha: {start: 1, end: 0.1, gravityY: -400},
        });
        this.walking.stop();

        // Player Jumping Particles
        this.jumping = this.add.particles(0, 0, 'kenny-particles', {
            frame: ['twirl_01.png', 'twirl_02.png'],
            scale: { start: 0.01, end: 0.1 },
            lifespan: 500,  
            maxAliveParticles: 2,
            alpha: { start: 1, end: 0 },
            gravityY: 100,  
            speed: { min: 50, max: 100 },
            angle: { min: -85, max: -95 },  
            emitZone: { source: new Phaser.Geom.Rectangle(-10, 0, 20, 10) }  
        });
        this.jumping.stop();

        // Collision handling
        this.physics.add.collider(my.sprite.player, this.baseLayer);

        this.physics.add.collider(my.sprite.player, this.deathLayer, () => {
            this.sound.play('deaddd', {volume: 0.5});
            this.scene.restart();
        });

        this.keyCollected = false;
        // Collect key when player comes in contact
        this.physics.add.overlap(my.sprite.player, this.keyobj, (obj1, obj2) => {
            this.sound.play('keyyy', {volume: 0.3});
            obj2.destroy();
            this.keyCollected = true;
        });

        // Door and Key logic
        this.physics.add.collider(my.sprite.player, this.door, (player, door) => {
            if (this.keyCollected) {
                // Key collected, change door frame
                if (door.frame && door.frame.name !== 58) { 
                    door.setTexture("tilemap_sheet", 58);
                    this.time.delayedCall(500, () => {
                        this.scene.start('winScene');
                    });
                }
            } else {
                // Key not collected logic remains the same
                if (!this.keyNeededText) {
                    this.keyNeededText = this.add.text(
                        player.x, 
                        player.y - 30, 
                        "Key needed!", 
                        { font: '16px Arial', fill: '#ffffff' }
                    ).setOrigin(0.5);
                    
                    this.time.addEvent({
                        delay: 1500,
                        callback: () => {
                            if (this.keyNeededText) {
                                this.keyNeededText.destroy();
                                this.keyNeededText = null;
                            }
                        },
                        callbackScope: this
                    });
                }
            }
        });

        this.physics.add.collider(my.sprite.player, this.enemyLayer, (player, enemy) => {
            this.enemyLayer.removeTileAt(enemy.x, enemy.y);
            this.sound.play('damage', {volume: 0.2});
            this.playerHealth -= 20;
            console.log(this.playerHealth);
        });

        // chest particle logic 
        this.chestBurst = this.add.particles(0, 0, 'kenny-particles', {
            frame: ['star_08.png'],
            lifespan: 200,
            speed: {min: 45, max: 80},
            angle: {min: 0, max: 360},
            quantity: 6,
            scale: {start: 0.05, end: 0.0},
            alpha: {start: 1, end: 0},
            rotate: {min: 0, max: 135},
        });
        
        this.chestBurst.stop();

        this.physics.add.collider(my.sprite.player, this.chests, (player, chest) => {
            const chestX = chest.x;
            const chestY = chest.y;
            if (chest.frame && chest.frame.name !== 390) { 
                chest.setTexture("tilemap_sheet", 390);
                // reward logic here -----------------------------
                //
                this.sound.play('chestie', {volume: 0.3});
                this.chestBurst.setPosition(chestX, chestY);
                this.chestBurst.start();
                this.time.delayedCall(1000, () => {
                    chest.destroy();
                    this.chestBurst.stop();
                });
            }
        });

        // Camera config -----------
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels * scaleSize, this.map.heightInPixels * scaleSize);
        this.cameras.main.startFollow(my.sprite.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(this.targetZoom);
        this.cameras.main.setDeadzone(200, 50);
        this.cameras.main.setFollowOffset(0, 0);

        // Key input
        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // Scene Plug-In
        this.animatedTiles.init(this.map);
    }

    update() {
        // left/right movement with max speed
        let onGround = my.sprite.player.body.blocked.down;
        let currentAcceleration = onGround ? this.ACCELERATION : this.AIR_ACCELERATION;
        let currentDeceleration = onGround ? this.DECELERATION : this.AIR_DECELERATION;

        // Footstep sound logic (only when moving on ground)
        if (onGround && (cursors.left.isDown || cursors.right.isDown)) {
            if (Math.abs(my.sprite.player.x - this.lastStepX) >= this.stepDistance) {
                this.sound.play('walkie', { volume: 1 });
                this.lastStepX = my.sprite.player.x;
            }
        }
        // Movement logic
        if (cursors.left.isDown) {
            my.sprite.player.body.setAccelerationX(-currentAcceleration);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            this.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            this.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            this.walking.start();
            if (my.sprite.player.body.velocity.x < -this.MAX_SPEED) {
                my.sprite.player.body.velocity.x = -this.MAX_SPEED;
            }
        } 
        else if (cursors.right.isDown) {
            my.sprite.player.body.setAccelerationX(currentAcceleration);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            this.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            this.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            this.walking.start();
            if (my.sprite.player.body.velocity.x > this.MAX_SPEED) {
                my.sprite.player.body.velocity.x = this.MAX_SPEED;
            }
        } 
        else {
            this.physics.world.collide(my.sprite.player, this.deathLayer);  
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(currentDeceleration);
            this.walking.stop();
            if (onGround) {
                my.sprite.player.anims.play('idle');
            }
        }

        // Jump handling
        if (my.sprite.player.body.blocked.down) {
            // Player is on the ground
            this.jumping.stop();
            if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
                this.sound.play('jumpy', {volume: 0.2});
                my.sprite.player.body.setVelocityY(this.JUMP_HEIGHT);
                // Start particles when jumping
                this.jumping.startFollow(my.sprite.player, 0, my.sprite.player.displayHeight / 2, false);
                this.jumping.start();
            }
        } else {
            my.sprite.player.anims.play('jump');
        }

        if (cursors.left.isDown) {
            this.targetOffsetX = -50;  // Look left
        } else if (cursors.right.isDown) {
            this.targetOffsetX = 50;   // Look right
        } else {
            this.targetOffsetX = 0;    // Center when idle
        }

        // Smoothly interpolate current offset toward target offset
        this.currentOffsetX = Phaser.Math.Linear(
            this.currentOffsetX, 
            this.targetOffsetX, 
            this.offsetLerpSpeed
        );

        // Smooth Zoom / Camera
        this.cameras.main.setFollowOffset(this.currentOffsetX, 0);
        const currentZoom = this.cameras.main.zoom;
        const zoomSpeed = 0.001;
        this.cameras.main.setZoom(Phaser.Math.Linear(currentZoom, this.targetZoom, zoomSpeed));
    }
}