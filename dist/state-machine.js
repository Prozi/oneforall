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
    validateStateChange(newState) {
        const transitionValidators = this.validators[this.state] || [];
        return transitionValidators.every((transitionValidator) => transitionValidator(newState));
    }
}