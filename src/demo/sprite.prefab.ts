import { distance } from 'detect-collisions';
import { takeUntil } from 'rxjs/operators';

import { Animator } from '../animator';
import { CircleBody } from '../circle-body';
import { GameObject, TGameObject } from '../game-object';
import { Scene } from '../scene';

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
  gameObject.sprite.setState('idle');

  scene.pixi.stage.addChild(gameObject.sprite.sprite);

  // subscribe to *own* update function until *own* destroy
  gameObject.update$
    .pipe(takeUntil(gameObject.destroy$))
    .subscribe((deltaTime) => {
      updateSprite(gameObject, deltaTime);
    });

  return gameObject;
}

export function updateSprite(gameObject: TGameObject, deltaTime: number): void {
  const scene = gameObject.root;
  const scale = scene.stage.scale;
  const gameObjects = scene.children as TGameObject[];
  const safeDelta = Math.min(60, deltaTime);
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

  if (gameObject.target && distance(gameObject.target, gameObject) < 9) {
    gameObject.target = null;
  }

  if (!gameObject.target) {
    gameObject.sprite.setState('idle');
  } else {
    gameObject.sprite.setState('run');

    const angle: number = Math.atan2(
      gameObject.target.y - gameObject.y,
      gameObject.target.x - gameObject.x
    );
    if (!isNaN(angle)) {
      const offsetX: number = Math.cos(angle);
      const offsetY: number = Math.sin(angle);

      if (gameObject.sprite instanceof Animator) {
        const flipX: number =
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
