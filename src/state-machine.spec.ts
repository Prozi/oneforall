import { GameObject } from './game-object';
import { StateMachine } from './state-machine';

describe('GIVEN StateMachine', () => {
  it('THEN you can set validators', () => {
    const go = new GameObject();
    const state = new StateMachine(go);

    state.setValidators('INITIAL_STATE', []);
  });

  it('THEN you can\'t change state to invalid state', () => {
    const go = new GameObject();
    const state = new StateMachine(go);

    state.setValidators('INITIAL_STATE', [
      (newState: string) => newState !== 'DISALLOW'
    ]);

    state.setState('DISALLOW');
    expect(state.state).toBe('INITIAL_STATE');
  });

  it('THEN you can change state to valid state', () => {
    const go = new GameObject();
    const state = new StateMachine(go);

    state.setValidators('INITIAL_STATE', [
      (newState: string) => newState !== 'DISALLOW'
    ]);

    state.setState('ALLOW');
    expect(state.state).toBe('ALLOW');
  });
});
