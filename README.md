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

```
<Gameplay>
  ├─ [Resources Loader (PIXI.Loader + Cache)]
  ├─ [2D Drawing Engine (PIXI.Application)]
  │   └─ [HTMLCanvas]
  └─ [Scene "Scene1"]
      ├─ [2D Physics (Collision Detection)]
      ├─ [GameObject "Level1" (from Prefab)]
      │   ├─ [100x Sprite "TileSprite"]
      │   └─ [30x PolygonBody "TileCollider"]
      ├─ [GameObject "Player" (from Prefab)]
      │   ├─ [CircleBody]
      │   ├─ [Sprite]
      │   └─ [StateMachine]
      └─ [50x GameObject "Enemy" (from Prefab)]
          ├─ [CircleBody]
          ├─ [Sprite]
          └─ [StateMachine]
```

## Installation

```
yarn add @jacekpietal/oneforall -D
```

## Demo

```typescript
import { takeUntil } from 'rxjs'
import { Scene, Resources } from '@jacekpietal/oneforall'
import { createSprite } from '@jacekpietal/oneforall/dist/demo/sprite.prefab'

async function start() {
  // create Scene
  const scene: Scene = new Scene({
    // with few optional params
    visible: true,
    autoSort: true
  })

  // new since pixi 7/8
  await scene.pixi.init({
    autoStart: false,
    sharedTicker: false,
    resizeTo: window,
    autoDensity: true,
  });

  document.body.appendChild(scene.pixi.canvas);

  // wait to load cave-boy.json and cave-boy.png, uses PIXI.Loader inside
  const { data } = await Resources.loadResource('./cave-boy.json')
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
  const gameObject: any = new GameObject('Sprite')

  // create body
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
```

```typescript
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
$ jest --verbose --silent
 PASS  src/component.spec.ts (5.432 s)
  GIVEN Component
    ✓ THEN update publishes update$ (3 ms)
    ✓ THEN destroy publishes destroy$ (1 ms)

 PASS  src/state-machine.spec.ts (5.507 s)
  GIVEN StateMachine
    ✓ THEN you can set validators (2 ms)
    ✓ THEN you can't change state to invalid state (2 ms)
    ✓ THEN you can change state to valid state (1 ms)

 PASS  src/sprite.spec.ts (6.322 s)
  GIVEN Sprite
    ✓ THEN update propagates x/y changes (4 ms)
    ✓ THEN destroy works (1 ms)

 PASS  src/scene.spec.ts (6.497 s)
  GIVEN Scene
    ✓ THEN it works (13 ms)
    ✓ THEN it can have children (1 ms)
    ✓ THEN scene propagates update to gameobject to component (2 ms)

 PASS  src/scene-base.spec.ts (6.576 s)
  GIVEN SceneBase
    ✓ THEN it works (2 ms)
    ✓ THEN it can have children (1 ms)
    ✓ THEN scene propagates update to gameobject to component (2 ms)

 PASS  src/container.spec.ts (6.723 s)
  GIVEN Container
    ✓ THEN update propagates x/y changes (3 ms)
    ✓ THEN destroy works (5 ms)

 PASS  src/index.spec.ts (6.678 s)
  GIVEN index.ts
    ✓ THEN basic imports work (3 ms)

 PASS  src/application.spec.ts
  GIVEN Application
    ✓ THEN it works (12 ms)

 PASS  src/polygon-body.spec.ts (6.791 s)
  GIVEN PolygonBody
    ✓ THEN update propagates x/y changes (3 ms)

 PASS  src/circle-body.spec.ts (6.814 s)
  GIVEN CircleBody
    ✓ THEN it has set property radius (2 ms)
    ✓ THEN it can't have zero radius (6 ms)
    ✓ THEN update propagates x/y changes

 PASS  src/resources.spec.ts
  GIVEN Resources
    ✓ THEN it silently fails and proceeds (14 ms)

 PASS  src/prefab.spec.ts (6.896 s)
  GIVEN Prefab
    ✓ THEN can be instantiated (3 ms)
    ✓ THEN can create 100 instances (13 ms)

 PASS  src/game-object.spec.ts (6.997 s)
  GIVEN GameObject
    ✓ THEN you can add component (3 ms)
    ✓ THEN update propagates to components (2 ms)
    ✓ THEN you can remove component (1 ms)
    ✓ THEN destroy removes component
    ✓ THEN you can get component by name
    ✓ THEN you can get components by name (1 ms)
    ✓ THEN you can destroy 1000 bodies without problem (58 ms)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks. Active timers can also cause this, ensure that .unref() was called on them.
Test Suites: 13 passed, 13 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        7.892 s, estimated 8 s
```

```
$ node -r esm ./test-build.js
...
<ref *1> GameObject {
  'update$': Subject {
    closed: false,
    observers: [],
    isStopped: false,
    hasError: false,
    thrownError: null
  },
  'destroy$': Subject {
    closed: false,
    observers: [],
    isStopped: false,
    hasError: false,
    thrownError: null
  },
  components: Set(1) {
    Component {
      name: 'Component',
      'update$': [Subject],
      'destroy$': [Subject],
      gameObject: [Circular *1]
    }
  },
  'components$': Subject {
    closed: false,
    observers: [],
    isStopped: false,
    hasError: false,
    thrownError: null
  },
  name: 'GameObject',
  x: 0,
  y: 0
}
<ref *1> Component {
  name: 'Component',
  'update$': Subject {
    closed: false,
    observers: [],
    isStopped: false,
    hasError: false,
    thrownError: null
  },
  'destroy$': Subject {
    closed: false,
    observers: [],
    isStopped: false,
    hasError: false,
    thrownError: null
  },
  gameObject: GameObject {
    'update$': Subject {
      closed: false,
      observers: [],
      isStopped: false,
      hasError: false,
      thrownError: null
    },
    'destroy$': Subject {
      closed: false,
      observers: [],
      isStopped: false,
      hasError: false,
      thrownError: null
    },
    components: Set(1) { [Circular *1] },
    'components$': Subject {
      closed: false,
      observers: [],
      isStopped: false,
      hasError: false,
      thrownError: null
    },
    name: 'GameObject',
    x: 0,
    y: 0
  }
}
```
