import { Vector } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { takeUntil } from 'rxjs/operators';

import { Animator } from '../animator';
import { CircleBody } from '../circle-body';
import { GameObject } from '../game-object';

export type TGameObject = GameObject & {
  body: CircleBody;
  sprite: Animator;
  target?: Vector;
};

export function createSprite({ scene, data, texture }): TGameObject {
  // a base molecule
  const gameObject = new GameObject('Sprite') as TGameObject;

  // create body
  gameObject.body = new CircleBody(gameObject, 20, 14);
  gameObject.body.setPosition(
    Math.random() * innerWidth,
    Math.random() * innerHeight
  );

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
    const gameObjects = scene.children as any[];

    gameObject.target =
      gameObjects[Math.floor(Math.random() * gameObjects.length)];

    gameObject.sprite.setState('run', true);
  }

  if (gameObject.target) {
    const arc: number = Math.atan2(
      gameObject.target.y - gameObject.y,
      gameObject.target.x - gameObject.x
    );
    const overlapX: number = Math.cos(arc);
    const overlapY: number = Math.sin(arc);

    if (gameObject.sprite instanceof Animator) {
      const flip: number = Math.sign(overlapX) || 1;

      gameObject.sprite.setScale(flip, 1);
    }

    gameObject.body.setPosition(
      gameObject.body.x + overlapX,
      gameObject.body.y + overlapY
    );
  }
}
