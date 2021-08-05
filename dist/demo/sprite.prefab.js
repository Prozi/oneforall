import { takeUntil } from 'rxjs';
import { Prefab, StateMachine, CircleBody, Physics, Resources } from '..';
import { Animator } from '../animator';
export async function preload(path) {
    const { data } = await Resources.loadResource(`${path}.json`);
    const { texture } = await Resources.loadResource(data.tileset);
    return {
        data,
        texture
    };
}
export function createPrefab(data, texture) {
    return new Prefab('SpritePrefab', async (gameObject) => {
        gameObject.body = new CircleBody(gameObject, 24);
        gameObject.body.x = Math.random() * innerWidth;
        gameObject.body.y = Math.random() * innerHeight;
        gameObject.sprite = new Animator(gameObject, data, texture);
        gameObject.sprite.setState('wow2', false, 'idle');
        gameObject.sprite.complete$
            .pipe(takeUntil(gameObject.destroy$))
            .subscribe(([_oldState, newState]) => {
            if (newState === 'idle') {
                gameObject.target = null;
            }
        });
        gameObject.state = new StateMachine(gameObject, '[state] initial');
    });
}
Physics.collision$.subscribe((gameObject) => {
    if (stateChangeAllowed(gameObject)) {
        gameObject.target = null;
        gameObject.sprite.setState('wow2', false, 'idle');
    }
});
function stateChangeAllowed(gameObject) {
    return ['idle', 'run'].includes(gameObject.sprite.state);
}
export function update(gameObject, gameObjects) {
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
            if (gameObject.sprite instanceof Animator) {
                const flip = Math.sign(overlap * overlap_x) || 1;
                gameObject.sprite.setScale(-flip, 1);
            }
            Physics.pushBack(gameObject.body, {
                overlap,
                overlap_x,
                overlap_y
            });
        }
    };
}
