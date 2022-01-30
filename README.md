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
import { filter, takeUntil } from 'rxjs'
import { Scene, GameObject, Prefab, Resources } from '@jacekpietal/oneforall'
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
  gameObjects.forEach((gameObject: any) => {
    // add to scene
    scene.addChild(gameObject)
    scene.physics.insert(gameObject.body)
    // subscribe to our own update function
    gameObject.update$
      .pipe(takeUntil(scene.destroy$))
      .subscribe(update(gameObject, gameObjects))
  })

  // separate sprites
  scene.update$.pipe(takeUntil(scene.destroy$)).subscribe(() => {
    scene.physics.separate()
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
