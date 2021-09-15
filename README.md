# one for all

set of classes to better organize 2d game development

- [Unity inspired architecture](https://docs.unity3d.com/Manual/CreatingGameplay.html)
- [state management](https://gamedevelopment.tutsplus.com/tutorials/finite-state-machines-theory-and-implementation--gamedev-11867)
- [reactive events](https://www.learnrxjs.io/learn-rxjs/subjects)
- [lifecycle cleanup management](https://www.html5gamedevs.com/topic/44780-best-way-to-remove-objects-from-the-stage/)
- [collision detection](https://npmjs.com/package/detect-collisions)
- [drawing on webgl canvas](https://npmjs.com/package/pixi.js)

```
<Gameplay>
  ├─ [Resources Loader (PIXI.Loader + Cache)]
  ├─ [2D Physics (Collision Detection)]
  ├─ [2D Drawing Engine (PIXI.Application)]
  │   └─ [HTMLCanvas]
  └─ [Scene "Scene1"]
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
import { filter, takeUntil } from 'rxjs'
import { Scene, GameObject, Prefab, Resources, Physics } from '@jacekpietal/oneforall'
import { createPrefab, update } from '@jacekpietal/oneforall/dist/demo/sprite.prefab'

async function start() {
  // create PIXI.Scene with bonuses
  const scene: Scene = new Scene({
    visible: true,
    autoSize: true,
    autoSort: true,
    scale: 1.3
  })

  // wait to load cave-boy.json and cave-boy.png, uses PIXI.Loader inside
  const { data } = await Resources.loadResource('./cave-boy.json')
  const { texture } = await Resources.loadResource(data.tileset)
  // create prefab once
  const prefab: Prefab = createPrefab(data, texture)
  // create 50 sprites using prefab
  const gameObjects = await Promise.all(
    Array.from({ length: 50 }, () => GameObject.instantiate(prefab))
  )

  // extend sprites
  gameObjects.forEach((gameObject: GameObject) => {
    // add to scene
    scene.addChild(gameObject)
    // subscribe to our own update function
    gameObject.update$
      .pipe(takeUntil(scene.destroy$))
      .subscribe(update(gameObject, gameObjects))
  })

  // on collision try to set sprite animation to wow
  Physics.collision$
    .pipe(takeUntil(scene.destroy$))
    .subscribe((gameObjects: Array<GameObject & { [prop: string]: any }>) => {
      gameObjects.forEach((gameObject) => {
        gameObject.target = null
        gameObject.sprite.setState('wow2', false, 'idle')
      })
    })

  scene.start()
}

start()
```
just the above code results in:
https://prozi.github.io/oneforall/

take a look at [sprite.prefab](https://github.com/Prozi/oneforall/blob/main/src/demo/sprite.prefab.ts)
to see how the Prefab class was used in the demo

## Classes this library exports

- Physics
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
$ yarn test
PASS src/physics.spec.ts
  GIVEN Physics
    ✓ THEN it can be created (2 ms)
    ✓ THEN createPolygon works (1 ms)
    ✓ THEN createCircle works (1 ms)
    ✓ THEN remove works
    ✓ THEN detectCollisions works (1 ms)
    ✓ THEN detectCollisions ignores bodies with isTrigger (1 ms)
    ✓ THEN pushBack works (1 ms)

PASS src/prefab.spec.ts
  GIVEN Prefab
    ✓ THEN can be instantiated (2 ms)
    ✓ THEN can create 100 instances (30 ms)

PASS src/scene.spec.ts
  GIVEN Scene
    ✓ THEN it works (9 ms)
    ✓ THEN it can have children (1 ms)
    ✓ THEN scene propagates update to gameobject to component (2 ms)

PASS src/sprite.spec.ts
  GIVEN Sprite
    ✓ THEN update propagates x/y changes (1 ms)
    ✓ THEN destroy works (1 ms)

PASS src/index.spec.ts
  GIVEN index.ts
    ✓ THEN basic imports work

PASS src/game-object.spec.ts
  GIVEN GameObject
    ✓ THEN you can add component
    ✓ THEN update propagates to components (2 ms)
    ✓ THEN you can remove component
    ✓ THEN destroy removes component (1 ms)
    ✓ THEN you can get component by name
    ✓ THEN you can get components by name
    ✓ THEN you can destroy 1000 bodies without problem (156 ms)

PASS src/container.spec.ts
  GIVEN Container
    ✓ THEN update propagates x/y changes (1 ms)
    ✓ THEN destroy works

PASS src/circle-body.spec.ts
  GIVEN CircleBody
    ✓ THEN it has set property radius (1 ms)
    ✓ THEN it can't have zero radius (11 ms)
    ✓ THEN update propagates x/y changes

PASS src/state-machine.spec.ts
  GIVEN StateMachine
    ✓ THEN you can set validators (1 ms)
    ✓ THEN you can't change state to invalid state (1 ms)
    ✓ THEN you can change state to valid state

PASS src/application.spec.ts
  GIVEN Application
    ✓ THEN it works (3 ms)

PASS src/resources.spec.ts
  GIVEN Resources
    ✓ THEN it silently fails and proceeds (14 ms)

PASS src/polygon-body.spec.ts
  GIVEN PolygonBody
    ✓ THEN update propagates x/y changes

PASS src/component.spec.ts
  GIVEN Component
    ✓ THEN update publishes update$ (2 ms)
    ✓ THEN destroy publishes destroy$ (2 ms)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks.
Test Suites: 13 passed, 13 total
Tests:       35 passed, 35 total
Snapshots:   0 total
Time:        5.694 s, estimated 6 s
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
