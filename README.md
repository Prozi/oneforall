<h1>oneforall</h1>

- GameObject, Prefab, StateMachine, Sprite, CircleBody, PolygonBody, Physics

- with PIXI.js support with Sprite and Container

- with lifecycle management (proper destroy)

- with rxjs events

- thoroughly unit tested

- written in typescript exported as npm es6 module

```javascript
import { GameObject, Prefab, StateMachine, Sprite, CircleBody } from 'oneforall'

const soldierPrefab: Prefab = new Prefab('Soldier', (go: GameObject & any) => {
  go.state = new StateMachine(go)
  go.sprite = new Sprite(go, PIXI.Texture.WHITE)
  go.body = new CircleBody(go, 40)
  go.body.x = Math.random() * innerWidth
  go.body.y = Math.random() * innerHeight
  go.update()
})

const soldiers: GameObject[] = new Array(100)
  .fill(0)
  .map((_) => GameObject.instantiate(soldierPrefab))
```

```
$ jest --verbose --silent
 PASS  src/component.spec.ts (14.487 s)
  GIVEN Component
    √ THEN update publishes update$ (5 ms)
    √ THEN destroy publishes destroy$ (1 ms)

 PASS  src/polygon-body.spec.ts
  GIVEN PolygonBody
    √ THEN update propagates x/y changes (6 ms)

 PASS  src/circle-body.spec.ts (16.34 s)
  GIVEN CircleBody
    √ THEN it has set property radius (16 ms)
    √ THEN it can't have zero radius (41 ms)
    √ THEN update propagates x/y changes (2 ms)

 PASS  src/state-machine.spec.ts
  GIVEN StateMachine
    √ THEN you can set validators (1 ms)
    √ THEN you can't change state to invalid state (2 ms)
    √ THEN you can change state to valid state (4 ms)

 PASS  src/game-object.spec.ts
  GIVEN GameObject
    √ THEN you can add component (2 ms)
    √ THEN you can remove component (1 ms)
    √ THEN you can get component by name (1 ms)
    √ THEN you can get components by name

 PASS  src/physics.spec.ts
  GIVEN Physics
    √ THEN it can be created (1 ms)
    √ THEN createPolygon works (1 ms)
    √ THEN createCircle works (1 ms)
    √ THEN remove works (4 ms)
    √ THEN detectCollisions works (5 ms)
    √ THEN detectCollisions ignores bodies with isTrigger (2 ms)
    √ THEN pushBack works (4 ms)

 PASS  src/sprite.spec.ts (19.494 s)
  GIVEN Sprite
    √ THEN update propagates x/y changes (5 ms)
    √ THEN destroy works (1 ms)

 PASS  src/prefab.spec.ts (19.631 s)
  GIVEN Prefab
    √ THEN can be instantiated (3 ms)
    √ THEN can create 100 instances (31 ms)

 PASS  src/container.spec.ts (20.311 s)
  GIVEN Container
    √ THEN update propagates x/y changes (3 ms)
    √ THEN destroy works (1 ms)

 PASS  src/index.spec.ts (20.502 s)
  GIVEN index.ts
    √ THEN basic imports work (2 ms)

 PASS  src/scene.spec.ts (20.729 s)
  GIVEN Scene
    √ THEN it works (14 ms)

A worker process has failed to exit gracefully and has been force exited. This is likely caused by tests leaking due to improper teardown. Try ru
nning with --detectOpenHandles to find leaks.
Test Suites: 11 passed, 11 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        22.719 s
Done in 24.87s.
```

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
