"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSprite = exports.createSprite = void 0;
const rxjs_1 = require("rxjs");
const game_object_1 = require("../game-object");
const circle_body_1 = require("../circle-body");
const animator_1 = require("../animator");
function createSprite({ scene, data, texture }) {
    // a base molecule
    const gameObject = new game_object_1.GameObject('Sprite');
    // create body to detect-collisions
    gameObject.body = new circle_body_1.CircleBody(gameObject, 20);
    gameObject.body.setPosition(Math.random() * innerWidth, Math.random() * innerHeight);
    // create animator with few animations from json + texture
    gameObject.sprite = new animator_1.Animator(gameObject, data, texture);
    gameObject.sprite.setState('idle', true);
    // add to scene
    scene.addChild(gameObject);
    scene.physics.insert(gameObject.body);
    // subscribe to its own update function
    gameObject.update$
        .pipe((0, rxjs_1.takeUntil)(scene.destroy$))
        .subscribe(() => updateSprite(gameObject));
    return gameObject;
}
exports.createSprite = createSprite;
function updateSprite(gameObject) {
    const scene = gameObject.parent; // always
    if (Math.random() < 0.05) {
        gameObject.target = {
            x: innerWidth / 2 / gameObject.parent.stage.scale.x,
            y: innerHeight / 2 / gameObject.parent.stage.scale.y
        };
    }
    if (Math.random() < 0.05) {
        gameObject.sprite.setState('roll', false, 'idle');
    }
    if (Math.random() < 0.05) {
        const gameObjects = Array.from(scene.children);
        gameObject.target =
            gameObjects[Math.floor(Math.random() * gameObjects.length)];
        gameObject.sprite.setState('run', true);
    }
    if (gameObject.target) {
        const arc = Math.atan2(gameObject.target.y - gameObject.y, gameObject.target.x - gameObject.x);
        const overlapX = Math.cos(arc);
        const overlapY = Math.sin(arc);
        if (gameObject.sprite instanceof animator_1.Animator) {
            const flip = Math.sign(overlapX) || 1;
            gameObject.sprite.setScale(flip, 1);
        }
        gameObject.body.setPosition(gameObject.body.x + overlapX, gameObject.body.y + overlapY);
    }
}
exports.updateSprite = updateSprite;
