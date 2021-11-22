'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.createPrefab = createPrefab;
exports.stateChangeAllowed = stateChangeAllowed;
exports.update = update;

var _rxjs = require('rxjs');

var _ = require('..');

var _animator = require('../animator');

function createPrefab(data, texture) {
    return new _.Prefab('SpritePrefab', async function (gameObject) {
        gameObject.body = new _.CircleBody(gameObject, 24);
        gameObject.body.x = Math.random() * innerWidth;
        gameObject.body.y = Math.random() * innerHeight;
        gameObject.sprite = new _animator.Animator(gameObject, data, texture);
        gameObject.sprite.setState('wow2', false, 'idle');
        gameObject.sprite.complete$.pipe((0, _rxjs.takeUntil)(gameObject.destroy$)).subscribe(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                _oldState = _ref2[0],
                newState = _ref2[1];

            if (newState === 'idle') {
                gameObject.target = null;
            }
        });
        gameObject.state = new _.StateMachine(gameObject, '[state] initial');
    });
}
function stateChangeAllowed(gameObject) {
    var _a;
    return ['idle', 'run'].includes((_a = gameObject.sprite) === null || _a === void 0 ? void 0 : _a.state);
}
function update(gameObject, gameObjects) {
    return function () {
        if (Math.random() < 0.05) {
            gameObject.target = {
                x: innerWidth / 2 / gameObject.parent.stage.scale.x,
                y: innerHeight / 2 / gameObject.parent.stage.scale.y
            };
        }
        if (stateChangeAllowed(gameObject) && Math.random() < 0.05) {
            gameObject.sprite.setState('attack', false, 'idle');
        }
        if (stateChangeAllowed(gameObject) && Math.random() < 0.05) {
            gameObject.target = gameObjects[Math.floor(Math.random() * gameObjects.length)];
            if (Math.random() < 0.8) {
                gameObject.state.setState('[state] move-forwards');
            } else {
                gameObject.state.setState('[state] move-backwards');
            }
            gameObject.sprite.setState('run', true);
        }
        if (gameObject.target) {
            var arc = Math.atan2(gameObject.y - gameObject.target.y, gameObject.x - gameObject.target.x);
            var overlap_x = Math.cos(arc);
            var overlap_y = Math.sin(arc);
            var overlap = gameObject.state.state === '[state] move-forwards' ? 1 : -1;
            if (gameObject.sprite instanceof _animator.Animator) {
                var flip = Math.sign(overlap * overlap_x) || 1;
                gameObject.sprite.setScale(-flip, 1);
            }
            gameObject.body.x -= overlap_x;
            gameObject.body.y -= overlap_y;
        }
    };
}