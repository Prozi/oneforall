<h1>oneforall</h1>

- GameObject, Prefab, StateMachine, Sprite, CircleBody, PolygonBody, Physics

- with WebGL support with PIXI: Sprite, Container, Scene

- with lifecycle management (proper destroy)

- with rxjs events

- thoroughly unit tested

- written in typescript exported as npm es6 module

---

```
<game>
├── [Physics]
└── [Scene]
    ├── [HTMLCanvas]
    ├── [GameObject "Map"]
    │   ├── [PolygonBody]
    │   └── [Container]
    │       └──[100x Sprite]
    ├── [GameObject "Player" from Prefab]
    │   ├── [CircleBody]
    │   ├── [Sprite]
    │   └── [StateMachine]
    └── [100x GameObject "Enemy" from Prefab]
        ├── [CircleBody]
        ├── [Sprite]
        └── [StateMachine]
```

---

```javascript
import {
  Scene,
  GameObject,
  Prefab,
  StateMachine,
  Sprite,
  CircleBody
} from '@jacekpietal/oneforall'

const scene: Scene = new Scene({ visible: true })
const soldierPrefab: Prefab = new Prefab('Soldier', (go: GameObject & any) => {
  go.state = new StateMachine(go)
  go.sprite = new Sprite(go, PIXI.Texture.WHITE)

  go.body = new CircleBody(go, 40)
  go.body.x = Math.random() * innerWidth
  go.body.y = Math.random() * innerHeight

  go.update()
  scene.addChild(go)
})

const soldiers: GameObject[] = new Array(100)
  .fill(0)
  .map((_) => GameObject.instantiate(soldierPrefab))

document.body.appendChild(scene.pixi.view)

scene.pixi.start()
```

---

```
$ jest --verbose --silent
 PASS  src/game-object.spec.ts (15.046 s)
  GIVEN GameObject
    √ THEN you can add component (4 ms)
    √ THEN update propagates to components (4 ms)
    √ THEN you can remove component
    √ THEN destroy removes component (1 ms)
    √ THEN you can get component by name (1 ms)
    √ THEN you can get components by name

 PASS  src/component.spec.ts (15.083 s)
  GIVEN Component
    √ THEN update publishes update$ (4 ms)
    √ THEN destroy publishes destroy$ (2 ms)

 PASS  src/state-machine.spec.ts (15.606 s)
  GIVEN StateMachine
    √ THEN you can set validators (3 ms)
    √ THEN you can't change state to invalid state (2 ms)
    √ THEN you can change state to valid state

 PASS  src/resources.spec.ts (18.96 s)
  GIVEN Resources
    √ THEN it silently fails and proceeds (28 ms)

 PASS  src/sprite.spec.ts (19.514 s)
  GIVEN Sprite
    √ THEN update propagates x/y changes (19 ms)
    √ THEN destroy works (1 ms)

 PASS  src/container.spec.ts (19.666 s)
  GIVEN Container
    √ THEN update propagates x/y changes (4 ms)
    √ THEN destroy works (2 ms)

 PASS  src/scene.spec.ts (19.918 s)
  GIVEN Scene
    √ THEN it works (18 ms)
    √ THEN it can have children (1 ms)
    √ THEN scene propagates update to gameobject to component (4 ms)

 PASS  src/physics.spec.ts
  GIVEN Physics
    √ THEN it can be created (1 ms)
    √ THEN createPolygon works (1 ms)
    √ THEN createCircle works
    √ THEN remove works (1 ms)
    √ THEN detectCollisions works (3 ms)
    √ THEN detectCollisions ignores bodies with isTrigger (1 ms)
    √ THEN pushBack works (4 ms)

 PASS  src/polygon-body.spec.ts
  GIVEN PolygonBody
    √ THEN update propagates x/y changes (4 ms)

 PASS  src/prefab.spec.ts
  GIVEN Prefab
    √ THEN can be instantiated (1 ms)
    √ THEN can create 100 instances (44 ms)

 PASS  src/circle-body.spec.ts
  GIVEN CircleBody
    √ THEN it has set property radius (2 ms)
    √ THEN it can't have zero radius (17 ms)
    √ THEN update propagates x/y changes (1 ms)

 PASS  src/index.spec.ts
  GIVEN index.ts
    √ THEN basic imports work (5 ms)

 PASS  src/application.spec.ts
  GIVEN Application
    √ THEN it works (9 ms)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due t
o improper teardown. Try running with --detectOpenHandles to find leaks.
Test Suites: 13 passed, 13 total
Tests:       34 passed, 34 total
Snapshots:   0 total
Time:        22.862 s
Done in 25.38s.
```

---

```
$ node -r esm ./test-build.js
...
<ref *1> GameObject {
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
Done in 5.26s.
```
