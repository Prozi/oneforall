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
 PASS  src/state-machine.spec.ts (11.883 s)
  GIVEN StateMachine
    √ THEN you can set validators (3 ms)
    √ THEN you can't change state to invalid state (3 ms)
    √ THEN you can change state to valid state (1 ms)

 PASS  src/polygon-body.spec.ts (12.312 s)
  GIVEN PolygonBody
    √ THEN update propagates x/y changes (8 ms)

 PASS  src/component.spec.ts (12.614 s)
  GIVEN Component
    √ THEN update publishes update$ (4 ms)
    √ THEN destroy publishes destroy$ (2 ms)

 PASS  src/game-object.spec.ts
  GIVEN GameObject
    √ THEN you can add component (1 ms)
    √ THEN you can remove component (1 ms)
    √ THEN you can get component by name (1 ms)
    √ THEN you can get components by name (1 ms)

 PASS  src/circle-body.spec.ts (12.862 s)
  GIVEN CircleBody
    √ THEN it has set property radius (7 ms)
    √ THEN it can't have zero radius (22 ms)
    √ THEN update propagates x/y changes (1 ms)

 PASS  src/physics.spec.ts
  GIVEN Physics
    √ THEN it can be created (2 ms)
    √ THEN createPolygon works (2 ms)
    √ THEN createCircle works (1 ms)
    √ THEN remove works (2 ms)
    √ THEN detectCollisions works (2 ms)
    √ THEN detectCollisions ignores bodies with isTrigger
    √ THEN pushBack works (2 ms)

 PASS  src/sprite.spec.ts (15.546 s)
  GIVEN Sprite
    √ THEN update propagates x/y changes (7 ms)
    √ THEN destroy works (1 ms)

 PASS  src/index.spec.ts
  GIVEN index.ts
    √ THEN basic imports work (1 ms)

 PASS  src/container.spec.ts (16.074 s)
  GIVEN Container
    √ THEN update propagates x/y changes (3 ms)
    √ THEN destroy works (2 ms)

 PASS  src/prefab.spec.ts (16.169 s)
  GIVEN Prefab
    √ THEN can be instantiated (2 ms)
    √ THEN can create 100 instances (42 ms)

Test Suites: 10 passed, 10 total
Tests:       27 passed, 27 total
Snapshots:   0 total
Time:        18.411 s, estimated 25 s
Done in 20.36s.
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
