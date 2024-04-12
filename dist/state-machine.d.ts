import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Component } from './component';
export type TStateValidator = (newState: string) => boolean;
export declare class StateMachine extends Component {
    readonly state$: Subject<string>;
    readonly change$: Subject<string[]>;
    label: string;
    state: string;
    protected validators: Record<string, TStateValidator[]>;
    constructor(gameObject: GameObject, initialState?: string);
    setState(newState: string): boolean;
    setValidators(fromState: string, validators: TStateValidator[]): void;
    getValidators(fromState: string): TStateValidator[];
    destroy(): void;
    protected validateStateChange(newState: string): boolean;
}
//# sourceMappingURL=state-machine.d.ts.map