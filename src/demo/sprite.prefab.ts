import { takeUntil } from 'rxjs/operators';

import { Animator } from '../animator';
import { CircleBody } from '../circle-body';
import { GameObject, TGameObject } from '../game-object';

export function createSprite({ scene, data, texture }): TGameObject {
  // create game object
  const gameObject = new GameObject('Player') as TGameObject;

  // create body
  gameObject.body = new CircleBody(gameObject, 20, 14);
  gameObject.body.setPosition(
    Math.random() * innerWidth,
    Math.random() * innerHeight
  );

  // insert body to physics and game object to scene
  scene.physics.insert(gameObject.body);
  scene.addChild(gameObject);

  // create animator with few animations from json + texture
  gameObject.sprite = new Animator(gameObject, data, texture);
  gameObject.sprite.setState('idle', true);

  // subscribe to its own update function
  gameObject.update$
    .pipe(takeUntil(scene.destroy$))
    .subscribe((deltaTime) => updateSprite(gameObject, deltaTime));

  return gameObject;
}

export function updateSprite(gameObject: TGameObject, deltaTime: number): void {
  const scale = gameObject.scene.stage.scale;
  const gameObjects = gameObject.scene.children as TGameObject[];
  const safeDelta = Math.min(60, deltaTime);
  const chance = safeDelta * 0.003;

  if (Math.random() < chance) {
    // funny animation
    gameObject.sprite.setState('roll', false, 'idle');
  } else if (Math.random() < chance) {
    // goto center
    gameObject.target = {
      x: innerWidth / 2 / scale.x,
      y: innerHeight / 2 / scale.y
    };
  } else if (Math.random() < chance) {
    // if possible follow random target
    if (gameObject.sprite.setState('run', true)) {
      gameObject.target =
        gameObjects[Math.floor(Math.random() * gameObjects.length)];
    }
  }

  if (gameObject.target) {
    const arc: number = Math.atan2(
      gameObject.target.y - gameObject.y,
      gameObject.target.x - gameObject.x
    );

    if (arc) {
      const offsetX: number = Math.cos(arc);
      const offsetY: number = Math.sin(arc);

      if (gameObject.sprite instanceof Animator) {
        const flipX: number =
          Math.sign(offsetX || gameObject.sprite.scale.x) *
          Math.abs(gameObject.sprite.scale.x);
        // flip x so there is no need to duplicate sprites
        gameObject.sprite.setScale(flipX, gameObject.sprite.scale.y);
      }

      // update body which updates parent game object
      gameObject.body.setPosition(
        gameObject.body.x + safeDelta * offsetX,
        gameObject.body.y + safeDelta * offsetY
      );
    }
  }
}
