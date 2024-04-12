import { Subject } from 'rxjs/internal/Subject';

import { GameObject } from './game-object';
import { Component } from './component';

export type TStateValidator = (newState: string) => boolean;

export class StateMachine extends Component {
  readonly state$: Subject<string> = new Subject();
  readonly change$: Subject<string[]> = new Subject();

  label = 'StateMachine';
  state = '';

  protected validators: Record<string, TStateValidator[]> = {};

  constructor(gameObject: GameObject, initialState = '') {
    super(gameObject);
    if (initialState) {
      this.state = initialState;
    }
  }

  setState(newState: string): boolean {
    if (!this.validateStateChange(newState)) {
      return false;
    }

    this.change$.next([this.state, newState]);
    this.state = newState;
    this.state$.next(this.state);

    return true;
  }

  setValidators(fromState: string, validators: TStateValidator[]): void {
    this.validators[fromState] = validators;
  }

  getValidators(fromState: string): TStateValidator[] {
    return this.validators[fromState] || [];
  }

  destroy(): void {
    this.state$.complete();
    this.change$.complete();
    super.destroy();
  }

  protected validateStateChange(newState: string): boolean {
    const fromAllStates = this.getValidators('*');
    const fromCurrentState = this.getValidators(this.state);
    const isValid = [...fromAllStates, ...fromCurrentState].every(
      (validator: TStateValidator) => validator(newState)
    );

    return isValid;
  }
}
