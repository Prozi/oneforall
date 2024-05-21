"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSprite = exports.createSprite = void 0;
const detect_collisions_1 = require("detect-collisions");
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
    gameObject.sprite.setState('idle');
    scene.pixi.stage.addChild(gameObject.sprite.sprite);
    // subscribe to *own* update function until *own* destroy
    gameObject.update$
        .pipe((0, operators_1.takeUntil)(gameObject.destroy$))
        .subscribe((deltaTime) => {
        updateSprite(gameObject, deltaTime);
    });
    return gameObject;
}
exports.createSprite = createSprite;
function updateSprite(gameObject, deltaTime) {
    const scene = gameObject.root;
    const scale = scene.stage.scale;
    const gameObjects = scene.children;
    const safeDelta = Math.min(60, deltaTime);
    const chance = safeDelta * 0.01;
    if (Math.random() < chance) {
        // goto random place
        gameObject.target = {
            x: (Math.random() * innerWidth) / scale.x,
            y: (Math.random() * innerHeight) / scale.y
        };
    }
    else if (Math.random() < chance) {
        // goto random target
        gameObject.target =
            gameObjects[Math.floor(Math.random() * gameObjects.length)];
    }
    else if (Math.random() < chance) {
        // stop
        gameObject.target = null;
    }
    if (gameObject.target && (0, detect_collisions_1.distance)(gameObject.target, gameObject) < 9) {
        gameObject.target = null;
    }
    if (!gameObject.target) {
        gameObject.sprite.setState('idle');
    }
    else {
        gameObject.sprite.setState('run');
        const angle = Math.atan2(gameObject.target.y - gameObject.y, gameObject.target.x - gameObject.x);
        if (!isNaN(angle)) {
            const offsetX = Math.cos(angle);
            const offsetY = Math.sin(angle);
            if (gameObject.sprite instanceof animator_1.Animator) {
                const flipX = Math.sign(offsetX || gameObject.sprite.scale.x) *
                    Math.abs(gameObject.sprite.scale.x);
                // flip x so there is no need to duplicate sprites
                gameObject.sprite.setScale(flipX, gameObject.sprite.scale.y);
            }
            // update body which updates gameObject game object
            gameObject.body.setPosition(gameObject.body.x + safeDelta * offsetX, gameObject.body.y + safeDelta * offsetY);
        }
    }
}
exports.updateSprite = updateSprite;
