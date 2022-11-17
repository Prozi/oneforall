import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Component } from './component';
export type TStateValidator = (newState: string) => boolean;
export declare class StateMachine extends Component {
    readonly name: string;
    readonly state$: Subject<string>;
    readonly change$: Subject<string[]>;
    state: string;
    private validators;
    constructor(gameObject: GameObject, initialState?: string);
    setState(newState: string): void;
    setValidators(fromState: string, validators: TStateValidator[]): void;
    getValidators(fromState: string): TStateValidator[];
    destroy(): void;
    private validateStateChange;
}
//# sourceMappingURL=state-machine.d.ts.map