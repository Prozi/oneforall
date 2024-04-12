import * as PIXI from 'pixi.js';
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
  gameObject.sprite.children.forEach((child: PIXI.AnimatedSprite) =>
    child.anchor.set(0.5, 0.8)
  );

  // subscribe to its own update function
  gameObject.update$
    .pipe(takeUntil(scene.destroy$))
    .subscribe(() => updateSprite(gameObject));

  return gameObject;
}

export function updateSprite(gameObject: TGameObject): void {
  const scale = gameObject.scene.stage.scale;
  const gameObjects = gameObject.scene.children as TGameObject[];

  if (Math.random() < 0.05) {
    // funny animation
    gameObject.sprite.setState('roll', false, 'idle');
  }

  if (Math.random() < 0.05) {
    // goto center
    gameObject.target = {
      x: innerWidth / 2 / scale.x,
      y: innerHeight / 2 / scale.y
    };
  }

  if (Math.random() < 0.05) {
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
      const overlapX: number = Math.cos(arc);
      const overlapY: number = Math.sin(arc);

      if (gameObject.sprite instanceof Animator) {
        const flipX: number = Math.sign(overlapX) || gameObject.sprite.scale.x;
        // flip x so there is no need to duplicate sprites
        gameObject.sprite.setScale(flipX, 1);
      }

      // update body which updates parent game object
      gameObject.body.setPosition(
        gameObject.body.x + overlapX,
        gameObject.body.y + overlapY
      );
    }
  }
}
