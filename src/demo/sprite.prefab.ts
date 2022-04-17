import * as PIXI from 'pixi.js'
import { takeUntil } from 'rxjs'
import { GameObject } from '../game-object'
import { CircleBody } from '../circle-body'
import { Scene } from '../scene'
import { Animator } from '../animator'
import { Vector } from 'detect-collisions'

export type TGameObject = GameObject & {
  body: CircleBody
  sprite: Animator
  target?: Vector
}

export function createSprite({ scene, data, texture }) {
  // a base molecule
  const gameObject: TGameObject = new GameObject('Sprite') as TGameObject

  // create body to detect-collisions
  gameObject.body = new CircleBody(gameObject, 20, 14)
  gameObject.body.setPosition(
    Math.random() * innerWidth,
    Math.random() * innerHeight
  )

  // create animator with few animations from json + texture
  gameObject.sprite = new Animator(gameObject, data, texture)
  gameObject.sprite.setState('idle', true)
  gameObject.sprite.children.forEach((child: PIXI.AnimatedSprite) =>
    child.anchor.set(0.5, 0.8)
  )

  // add to scene
  scene.addChild(gameObject)
  scene.physics.insert(gameObject.body)

  // subscribe to its own update function
  gameObject.update$
    .pipe(takeUntil(scene.destroy$))
    .subscribe(() => updateSprite(gameObject))

  return gameObject
}

export function updateSprite(gameObject: TGameObject): void {
  const scene: Scene = gameObject.parent as Scene

  if (Math.random() < 0.05) {
    gameObject.target = {
      x: innerWidth / 2 / gameObject.parent.stage.scale.x,
      y: innerHeight / 2 / gameObject.parent.stage.scale.y
    }
  }

  if (Math.random() < 0.05) {
    gameObject.sprite.setState('roll', false, 'idle')
  }

  if (Math.random() < 0.05) {
    const gameObjects = Array.from(scene.children)

    gameObject.target =
      gameObjects[Math.floor(Math.random() * gameObjects.length)]

    gameObject.sprite.setState('run', true)
  }

  if (gameObject.target) {
    const arc: number = Math.atan2(
      gameObject.target.y - gameObject.y,
      gameObject.target.x - gameObject.x
    )
    const overlapX: number = Math.cos(arc)
    const overlapY: number = Math.sin(arc)

    if (gameObject.sprite instanceof Animator) {
      const flip: number = Math.sign(overlapX) || 1

      gameObject.sprite.setScale(flip, 1)
    }

    gameObject.body.setPosition(
      gameObject.body.x + overlapX,
      gameObject.body.y + overlapY
    )
  }
}
