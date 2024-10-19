'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.create = create;
exports.update = update;
const game_object_1 = require('../game-object');
const animator_1 = require('../animator');
const circle_body_1 = require('../circle-body');
const detect_collisions_1 = require('detect-collisions');
const operators_1 = require('rxjs/operators');
function create({ scene, data, texture }) {
  // create game object
  const gameObject = new game_object_1.GameObject('Player');
  // create body
  gameObject.body = new circle_body_1.CircleBody(gameObject, 20, 14, 20, {
    padding: 7
  });
  gameObject.body.setPosition(
    Math.random() * innerWidth,
    Math.random() * innerHeight
  );
  // create animator with few animations from json + texture
  gameObject.sprite = new animator_1.Animator(gameObject, data, texture);
  gameObject.sprite.setState('idle');
  // insert body to physics and game object to scene
  scene.addChild(gameObject);
  // subscribe to *own* update function until *own* destroy
  gameObject.update$
    .pipe((0, operators_1.takeUntil)(gameObject.destroy$))
    .subscribe((deltaTime) => {
      update(gameObject, deltaTime);
    });
  return gameObject;
}
function update(gameObject, deltaTime) {
  const scene = gameObject.scene;
  const scale = scene.stage.scale;
  const gameObjects = scene.children;
  // at 60fps deltaTime = 1.0, at 30fps deltaTime = 2.0
  const safeDelta = Math.min(deltaTime, 2);
  const chance = safeDelta * 0.01;
  if (Math.random() < chance) {
    // goto random place
    gameObject.target = {
      x: (Math.random() * innerWidth) / scale.x,
      y: (Math.random() * innerHeight) / scale.y
    };
  } else if (Math.random() < chance) {
    // goto random target
    gameObject.target =
      gameObjects[Math.floor(Math.random() * gameObjects.length)];
  } else if (Math.random() < chance) {
    // stop
    gameObject.target = null;
  }
  if (
    gameObject.target &&
    (0, detect_collisions_1.distance)(gameObject.target, gameObject) < 9
  ) {
    gameObject.target = null;
  }
  if (!gameObject.target) {
    gameObject.sprite.setState('idle');
  } else {
    gameObject.sprite.setState('run');
    const angle = Math.atan2(
      gameObject.target.y - gameObject.y,
      gameObject.target.x - gameObject.x
    );
    if (!isNaN(angle)) {
      const offsetX = Math.cos(angle);
      const offsetY = Math.sin(angle);
      if (gameObject.sprite instanceof animator_1.Animator) {
        const flipX =
          Math.sign(offsetX || gameObject.sprite.scale.x) *
          Math.abs(gameObject.sprite.scale.x);
        // flip x so there is no need to duplicate sprites
        gameObject.sprite.setScale(flipX, gameObject.sprite.scale.y);
      }
      // update body which updates gameObject game object
      gameObject.body.setPosition(
        gameObject.body.x + safeDelta * offsetX,
        gameObject.body.y + safeDelta * offsetY
      );
    }
  }
}
