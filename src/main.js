// Jim Whitehead
// Created: 4/14/2024
// Phaser: 3.70.0
//
// Cubey
//
// An example of putting sprites on the screen using Phaser
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict";

let config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 5120,
    height: 1024,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
        }
    },
    render: {
        pixelArt: true,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [Load, Trickbit, WinScene]
};

const SCALE = 2.0;  
var cursors;
var my = { sprite: {}, text: {} };

const game = new Phaser.Game(config);