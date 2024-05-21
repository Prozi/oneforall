import { Vector } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { LifecycleParent, LifecycleProps } from './lifecycle';
import { StateMachine } from './state-machine';
export interface AnimatorData {
    animations: Record<string, number[]>;
    cols: number;
    rows: number;
    animationSpeed?: number;
    anchor?: Vector;
}
export declare class Animator extends PIXI.Container implements LifecycleProps {
    /**
     * When Lifecycle Object is updated, it emits this subject.
     * Along with updating his children, which in turn behave the same.
     */
    readonly update$: Subject<number>;
    /**
     * When Lifecycle Object is destroyed, it emits and closes this subject.
     * Along with destroying his children, which in turn behave the same.
     */
    readonly destroy$: Subject<void>;
    /**
     * When animation completes, it emits this subject.
     */
    readonly complete$: Subject<string>;
    /**
     * Inner State Machine Object.
     */
    readonly stateMachine: StateMachine;
    /**
     * Animator has sprite container for animations.
     */
    readonly sprite: PIXI.Container;
    /**
     * Parent GameObject is assigned at creation.
     */
    gameObject: LifecycleParent;
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
     * @param animatorData
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
    /**
     * Reference to inner animation scale.
     */
    get scale(): PIXI.ObservablePoint;
    update(deltaTime: number): void;
    setScale(x?: number, y?: number): void;
    getAnimationIndex(state: string): number;
    setAnimation(animation: PIXI.AnimatedSprite, loop: boolean): void;
    setState(state: string, loop?: boolean, stateWhenFinished?: string): string;
    protected getExactStateIndex(state: string): number;
    protected getFuzzyStateIndex(state: string): number;
}
//# sourceMappingURL=animator.d.ts.map