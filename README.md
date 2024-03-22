# one for all

set of classes to better organize 2d game development

[<img src="https://img.shields.io/npm/v/@jacekpietal/oneforall?style=for-the-badge&color=success" alt="npm version" />](https://www.npmjs.com/package/@jacekpietal/oneforall?activeTab=versions)
[<img src="https://img.shields.io/npm/l/@jacekpietal/oneforall.svg?style=for-the-badge&color=success" alt="license: MIT" />](https://github.com/Prozi/@jacekpietal/oneforall/blob/master/LICENSE)
[<img src="https://img.shields.io/circleci/build/github/Prozi/oneforall/main?style=for-the-badge" alt="build status" />](https://app.circleci.com/pipelines/github/Prozi/oneforall)

- [Unity inspired architecture](https://docs.unity3d.com/Manual/CreatingGameplay.html)
- [state management](https://gamedevelopment.tutsplus.com/tutorials/finite-state-machines-theory-and-implementation--gamedev-11867)
- [reactive events](https://www.learnrxjs.io/learn-rxjs/subjects)
- [lifecycle cleanup management](https://www.html5gamedevs.com/topic/44780-best-way-to-remove-objects-from-the-stage/)
- [collision detection](https://npmjs.com/package/detect-collisions)
- [drawing on webgl canvas](https://npmjs.com/package/pixi.js)

```bash
[Drawing: "pixi.js"]
   └──[Physics: "collision-detection"]
      [1x Scene: "Scene1"]
      ├──[1x Prefab: "Level1"]
      │  ├──[100x Sprite: "TileSprite"]
      │  └──[30x PolygonBody: "TileCollider"]
      ├──[1x Prefab: "Player"]
      │  ├──[CircleBody]
      │  ├──[Sprite]
      │  └──[StateMachine]
      └──[50x Prefab: "Enemy"]
         ├──[CircleBody]
         ├──[Sprite]
         └──[StateMachine]
```

## Installation

```
yarn add @jacekpietal/oneforall -D
```

## Demo

```typescript
import { takeUntil } from "rxjs"
import { Scene, Resources } from "@jacekpietal/oneforall"
import { createSprite } from "@jacekpietal/oneforall/dist/demo/sprite.prefab"

async function start() {
  // create Scene
  const scene: Scene = new Scene({
    // with few optional params
    visible: true,
    autoSort: true,
  })

  // new since pixi 7/8
  await scene.pixi.init({
    autoStart: false,
    sharedTicker: false,
    resizeTo: window,
    autoDensity: true,
  })

  document.body.appendChild(scene.pixi.canvas)

  // wait to load cave-boy.json and cave-boy.png, uses PIXI.Loader inside
  const { data } = await Resources.loadResource("./cave-boy.json")
  const { texture } = await Resources.loadResource(data.tileset)

  // create 50 sprites from that
  Array.from({ length: 50 }, () => createSprite({ scene, data, texture }))

  // separate sprites
  scene.update$.pipe(takeUntil(scene.destroy$)).subscribe(() => {
    scene.physics.separate()
  })

  scene.start()
}

start()
```

```typescript
export function createSprite({ scene, data, texture }) {
  // a base molecule
  const gameObject: any = new GameObject("Sprite")

  // create body
  gameObject.body = new CircleBody(gameObject, 20)
  gameObject.body.setPosition(
    Math.random() * innerWidth,
    Math.random() * innerHeight
  )

  // create animator with few animations from json + texture
  gameObject.sprite = new Animator(gameObject, data, texture)
  gameObject.sprite.setState("idle", true)

  // add to scene
  scene.addChild(gameObject)
  scene.physics.insert(gameObject.body)

  // subscribe to its own update function
  gameObject.update$
    .pipe(takeUntil(scene.destroy$))
    .subscribe(() => updateSprite(gameObject))

  return gameObject
}
```

```typescript
export function updateSprite(
  gameObject: GameObject & { [prop: string]: any }
): void {
  const scene: Scene = gameObject.parent // always

  if (Math.random() < 0.05) {
    gameObject.target = {
      x: innerWidth / 2 / gameObject.parent.stage.scale.x,
      y: innerHeight / 2 / gameObject.parent.stage.scale.y,
    }
  }

  if (Math.random() < 0.05) {
    gameObject.sprite.setState("roll", false, "idle")
  }

  if (Math.random() < 0.05) {
    const gameObjects = Array.from(scene.children)

    gameObject.target =
      gameObjects[Math.floor(Math.random() * gameObjects.length)]

    gameObject.sprite.setState("run", true)
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
```

just the above code results in:
https://prozi.github.io/oneforall/

take a look at [sprite.prefab](https://github.com/Prozi/oneforall/blob/main/src/demo/sprite.prefab.ts)
to see how the Prefab class was used in the demo

## Classes this library exports

- Resources
- Scene
- GameObject
- Prefab
- Container
- Sprite
- Animator
- CircleBody
- PolygonBody
- StateMachine

## Tests

```
{ gameObject: true, component: true }

 PASS  src/circle-body.spec.ts
  GIVEN CircleBody
    ✓ THEN it has set property radius (4 ms)
    ✓ THEN it can't have zero radius (9 ms)
    ✓ THEN update propagates x/y changes (1 ms)

 PASS  src/application.spec.ts
  GIVEN Application
    ✓ THEN it works (3 ms)

 PASS  src/resources.spec.ts
  GIVEN Resources
    ✓ THEN it silently fails and proceeds (7 ms)

 PASS  src/prefab.spec.ts
  GIVEN Prefab
    ✓ THEN can be instantiated (4 ms)
    ✓ THEN can create 100 instances (9 ms)

 PASS  src/sprite.spec.ts
  GIVEN Sprite
    ✓ THEN update propagates x/y changes (3 ms)
    ✓ THEN removeChild works
    ✓ THEN destroy works (1 ms)
    ✓ THEN destroy works extended

 PASS  src/scene.spec.ts
  GIVEN Scene
    ✓ THEN it works (3 ms)
    ✓ THEN it can have children
    ✓ THEN scene propagates update to gameobject to component (4 ms)

 PASS  src/game-object.spec.ts
  GIVEN GameObject
    ✓ THEN you can add component (4 ms)
    ✓ THEN update propagates to components (1 ms)
    ✓ THEN you can remove component
    ✓ THEN destroy removes component
    ✓ THEN you can get component by label (1 ms)
    ✓ THEN you can get components by label
    ✓ THEN you can destroy 1000 bodies without problem (109 ms)

 PASS  src/state-machine.spec.ts
  GIVEN StateMachine
    ✓ THEN you can set validators (1 ms)
    ✓ THEN you can't change state to invalid state (1 ms)
    ✓ THEN you can change state to valid state

 PASS  src/component.spec.ts
  GIVEN Component
    ✓ THEN update publishes update$ (1 ms)
    ✓ THEN destroy publishes destroy$

 PASS  src/container.spec.ts
  GIVEN Container
    ✓ THEN update propagates x/y changes (1 ms)
    ✓ THEN destroy works

 PASS  src/polygon-body.spec.ts
  GIVEN PolygonBody
    ✓ THEN update propagates x/y changes (1 ms)

 PASS  src/scene-base.spec.ts
  GIVEN SceneBase
    ✓ THEN it works (1 ms)
    ✓ THEN it can have children
    ✓ THEN scene propagates update to gameobject to component (1 ms)

 PASS  src/index.spec.ts
  GIVEN index.ts
    ✓ THEN basic imports work (1 ms)

Test Suites: 13 passed, 13 total
Tests:       33 passed, 33 total
Snapshots:   0 total
Time:        2.438 s, estimated 3 s
```
