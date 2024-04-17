import { Subject } from 'rxjs/internal/Subject';
import { Component } from './component';
import { GameObject } from './game-object';
export type TStateValidator = (newState: string) => boolean;
export declare class StateMachine extends Component {
    /**
     * Before his state changes, it emits this subject.
     */
    readonly change$: Subject<string[]>;
    /**
     * After his state changes, it emits this subject.
     */
    readonly state$: Subject<string>;
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    label: string;
    /**
     * Current state of the State Machine.
     */
    state: string;
    /**
     * Validators for state changes.
     */
    protected validators: Record<string, TStateValidator[]>;
    constructor(gameObject: GameObject, initialState?: string);
    setState(newState: string): boolean;
    setValidators(fromState: string, validators: TStateValidator[]): void;
    getValidators(fromState: string): TStateValidator[];
    destroy(): void;
    protected validateStateChange(newState: string): boolean;
}
//# sourceMappingURL=state-machine.d.ts.map