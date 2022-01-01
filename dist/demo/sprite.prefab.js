"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.stateChangeAllowed = exports.createPrefab = void 0;
const rxjs_1 = require("rxjs");
const __1 = require("..");
const animator_1 = require("../animator");
function createPrefab(data, texture) {
    return new __1.Prefab('SpritePrefab', (gameObject) => __awaiter(this, void 0, void 0, function* () {
        gameObject.body = new __1.CircleBody(gameObject, 24);
        gameObject.body.x = Math.random() * innerWidth;
        gameObject.body.y = Math.random() * innerHeight;
        gameObject.sprite = new animator_1.Animator(gameObject, data, texture);
        gameObject.sprite.setState('wow2', false, 'idle');
        gameObject.sprite.complete$
            .pipe((0, rxjs_1.takeUntil)(gameObject.destroy$))
            .subscribe(([_oldState, newState]) => {
            if (newState === 'idle') {
                gameObject.target = null;
            }
        });
        gameObject.state = new __1.StateMachine(gameObject, '[state] initial');
    }));
}
exports.createPrefab = createPrefab;
function stateChangeAllowed(gameObject) {
    var _a;
    return ['idle', 'run'].includes((_a = gameObject.sprite) === null || _a === void 0 ? void 0 : _a.state);
}
exports.stateChangeAllowed = stateChangeAllowed;
function update(gameObject, gameObjects) {
    return () => {
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
            gameObject.target =
                gameObjects[Math.floor(Math.random() * gameObjects.length)];
            if (Math.random() < 0.8) {
                gameObject.state.setState('[state] move-forwards');
            }
            else {
                gameObject.state.setState('[state] move-backwards');
            }
            gameObject.sprite.setState('run', true);
        }
        if (gameObject.target) {
            const arc = Math.atan2(gameObject.y - gameObject.target.y, gameObject.x - gameObject.target.x);
            const overlap_x = Math.cos(arc);
            const overlap_y = Math.sin(arc);
            const overlap = gameObject.state.state === '[state] move-forwards' ? 1 : -1;
            if (gameObject.sprite instanceof animator_1.Animator) {
                const flip = Math.sign(overlap * overlap_x) || 1;
                gameObject.sprite.setScale(-flip, 1);
            }
            gameObject.body.x -= overlap_x;
            gameObject.body.y -= overlap_y;
        }
    };
}
exports.update = update;
