"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSprite = exports.createSprite = void 0;
const operators_1 = require("rxjs/operators");
const animator_1 = require("../animator");
const circle_body_1 = require("../circle-body");
const game_object_1 = require("../game-object");
function createSprite({ scene, data, texture }) {
    // create game object
    const gameObject = new game_object_1.GameObject('Player');
    // create body
    gameObject.body = new circle_body_1.CircleBody(gameObject, 20, 14);
    gameObject.body.setPosition(Math.random() * innerWidth, Math.random() * innerHeight);
    // insert body to physics and game object to scene
    scene.physics.insert(gameObject.body);
    scene.addChild(gameObject);
    // create animator with few animations from json + texture
    gameObject.sprite = new animator_1.Animator(gameObject, data, texture);
    gameObject.sprite.setState('idle', true);
    // subscribe to its own update function
    gameObject.update$
        .pipe((0, operators_1.takeUntil)(scene.destroy$))
        .subscribe((deltaTime) => updateSprite(gameObject, deltaTime));
    return gameObject;
}
exports.createSprite = createSprite;
function updateSprite(gameObject, deltaTime) {
    const scale = gameObject.scene.stage.scale;
    const gameObjects = gameObject.scene.children;
    const safeDelta = Math.min(60, deltaTime);
    const chance = safeDelta * 0.003;
    if (Math.random() < chance) {
        // funny animation
        gameObject.sprite.setState('roll', false, 'idle');
    }
    else if (Math.random() < chance) {
        // goto center
        gameObject.target = {
            x: innerWidth / 2 / scale.x,
            y: innerHeight / 2 / scale.y
        };
    }
    else if (Math.random() < chance) {
        // if possible follow random target
        if (gameObject.sprite.setState('run', true)) {
            gameObject.target =
                gameObjects[Math.floor(Math.random() * gameObjects.length)];
        }
    }
    if (gameObject.target) {
        const arc = Math.atan2(gameObject.target.y - gameObject.y, gameObject.target.x - gameObject.x);
        if (arc) {
            const offsetX = Math.cos(arc);
            const offsetY = Math.sin(arc);
            if (gameObject.sprite instanceof animator_1.Animator) {
                const flipX = Math.sign(offsetX || gameObject.sprite.scale.x) *
                    Math.abs(gameObject.sprite.scale.x);
                // flip x so there is no need to duplicate sprites
                gameObject.sprite.setScale(flipX, gameObject.sprite.scale.y);
            }
            // update body which updates parent game object
            gameObject.body.setPosition(gameObject.body.x + safeDelta * offsetX, gameObject.body.y + safeDelta * offsetY);
        }
    }
}
exports.updateSprite = updateSprite;
