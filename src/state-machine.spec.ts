import { GameObject } from './game-object';
import { StateMachine } from './state-machine';

describe('GIVEN StateMachine', () => {
  it('THEN you can set validators', () => {
    const go = new GameObject();
    const state = new StateMachine(go);

    state.setValidators('', []);
  });

  it('THEN you can\'t change state to invalid state', () => {
    const go = new GameObject();
    const state = new StateMachine(go);

    state.setValidators('', [(newState: string) => newState !== 'DISALLOW']);

    state.setState('DISALLOW');
    expect(state.state).toBe('');
  });

  it('THEN you can change state to valid state', () => {
    const go = new GameObject();
    const state = new StateMachine(go);

    state.setValidators('', [(newState: string) => newState !== 'DISALLOW']);

    state.setState('ALLOW');
    expect(state.state).toBe('ALLOW');
  });
});
