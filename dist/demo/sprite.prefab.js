"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSprite = exports.createSprite = void 0;
const operators_1 = require("rxjs/operators");
const animator_1 = require("../animator");
const circle_body_1 = require("../circle-body");
const game_object_1 = require("../game-object");
function createSprite({ scene, data, texture }) {
    // a base molecule
    const gameObject = new game_object_1.GameObject('Sprite');
    // create body
    gameObject.body = new circle_body_1.CircleBody(gameObject, 20, 14);
    gameObject.body.setPosition(Math.random() * innerWidth, Math.random() * innerHeight);
    scene.physics.insert(gameObject.body);
    scene.addChild(gameObject);
    // create animator with few animations from json + texture
    gameObject.sprite = new animator_1.Animator(gameObject, data, texture);
    gameObject.sprite.setState('idle', true);
    gameObject.sprite.children.forEach((child) => child.anchor.set(0.5, 0.8));
    // subscribe to its own update function
    gameObject.update$
        .pipe((0, operators_1.takeUntil)(scene.destroy$))
        .subscribe(() => updateSprite(gameObject));
    return gameObject;
}
exports.createSprite = createSprite;
function updateSprite(gameObject) {
    const scene = gameObject.scene;
    if (Math.random() < 0.05) {
        gameObject.target = {
            x: innerWidth / 2 / scene.stage.scale.x,
            y: innerHeight / 2 / scene.stage.scale.y
        };
    }
    if (Math.random() < 0.05) {
        gameObject.sprite.setState('roll', false, 'idle');
    }
    if (Math.random() < 0.05) {
        // tslint:disable-next-line: no-any
        const gameObjects = scene.children;
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
