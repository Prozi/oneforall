import { Vector } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { Container } from './container';
import { GameObject } from './game-object';
import { StateMachine } from './state-machine';
export interface AnimatorData {
    animations: Record<string, number[]>;
    cols: number;
    rows: number;
    animationSpeed?: number;
    anchor?: Vector;
}
export declare class Animator extends Container {
    /**
     * When animation completes, it emits this subject.
     */
    readonly complete$: Subject<string>;
    /**
     * Inner State Machine Object.
     */
    readonly stateMachine: StateMachine;
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    label: string;
    /**
     * List of possible animations.
     */
    states: string[];
    /**
     * Pointer to currently visible animation.
     */
    animation?: PIXI.AnimatedSprite;
    /**
     * @param gameObject
     * @param options
     * @param texture
     */
    constructor(gameObject: GameObject, { animations, cols, rows, animationSpeed, anchor }: AnimatorData, { width, height, source }: PIXI.Texture);
    /**
     * Reference to inner State Machine's state.
     */
    get state(): string;
    /**
     * Reference to inner State Machine's state$ Subject.
     */
    get state$(): Subject<string>;
    setScale(x?: number, y?: number): void;
    getAnimationIndex(state: string): number;
    setAnimation(animation: PIXI.AnimatedSprite, loop: boolean): void;
    setState(state: string, loop?: boolean, stateWhenFinished?: string): string;
    private getExactStateIndex;
    private getFuzzyStateIndex;
}
//# sourceMappingURL=animator.d.ts.map