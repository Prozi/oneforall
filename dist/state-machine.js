"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateMachine = void 0;
const Subject_1 = require("rxjs/internal/Subject");
const component_1 = require("./component");
class StateMachine extends component_1.Component {
    constructor(gameObject, initialState = '') {
        super(gameObject);
        this.state$ = new Subject_1.Subject();
        this.change$ = new Subject_1.Subject();
        this.label = 'StateMachine';
        this.state = '';
        this.validators = {};
        if (initialState) {
            this.state = initialState;
        }
    }
    setState(newState) {
        if (!this.validateStateChange(newState)) {
            return false;
        }
        this.change$.next([this.state, newState]);
        this.state = newState;
        this.state$.next(this.state);
        return true;
    }
    setValidators(fromState, validators) {
        this.validators[fromState] = validators;
    }
    getValidators(fromState) {
        return this.validators[fromState] || [];
    }
    destroy() {
        this.state$.complete();
        this.change$.complete();
        super.destroy();
    }
    validateStateChange(newState) {
        const fromAllStates = this.getValidators('*');
        const fromCurrentState = this.getValidators(this.state);
        const isValid = [...fromAllStates, ...fromCurrentState].every((validator) => validator(newState));
        return isValid;
    }
}
exports.StateMachine = StateMachine;
