import { Subject } from 'rxjs';
import { Component } from './component';
export class StateMachine extends Component {
    constructor(gameObject, initialState = 'INITIAL_STATE') {
        super(gameObject);
        this.name = 'StateMachine';
        this.state$ = new Subject();
        this.change$ = new Subject();
        this.validators = {};
        this.state = initialState;
    }
    setState(newState) {
        if (!this.validateStateChange(newState)) {
            return;
        }
        this.change$.next([this.state, newState]);
        this.state = newState;
        this.state$.next(this.state);
    }
    setValidators(fromState, validators) {
        this.validators[fromState] = validators;
    }
    getValidators(fromState) {
        return this.validators[fromState];
    }
    destroy() {
        this.state$.complete();
        this.change$.complete();
        super.destroy();
    }
    validateStateChange(newState) {
        if (!this.state) {
            return true;
        }
        const fromAllStates = this.validators['*'] || [];
        const fromCurrentState = this.validators[this.state] || [];
        return [...fromAllStates, ...fromCurrentState].every((validator) => validator(newState));
    }
}
