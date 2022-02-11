import { takeUntil } from 'rxjs'
import { GameObject } from '../game-object'
import { CircleBody } from '../circle-body'
import { Scene } from '../scene'
import { Animator } from '../animator'

export function createSprite({ scene, data, texture }) {
  // a base molecule
  const gameObject: any = new GameObject('Sprite')

  // create body to detect-collisions
  gameObject.body = new CircleBody(gameObject, 20)
  gameObject.body.setPosition(
    Math.random() * innerWidth,
    Math.random() * innerHeight
  )

  // create animator with few animations from json + texture
  gameObject.sprite = new Animator(gameObject, data, texture)
  gameObject.sprite.setState('idle', true)

  // add to scene
  scene.addChild(gameObject)
  scene.physics.insert(gameObject.body)

  // subscribe to its own update function
  gameObject.update$
    .pipe(takeUntil(scene.destroy$))
    .subscribe(() => updateSprite(gameObject))

  return gameObject
}

export function updateSprite(
  gameObject: GameObject & { [prop: string]: any }
): void {
  const scene: Scene = gameObject.parent // always

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
