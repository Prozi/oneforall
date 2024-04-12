import { Vector } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { Container } from './container';
import { GameObject } from './game-object';
import { StateMachine } from './state-machine';
export interface AnimatorData {
    animations: Record<string, (number | string)[]>;
    cols: number;
    rows: number;
    animationSpeed?: number;
    anchor?: Vector;
}
export declare class Animator extends Container {
    readonly complete$: Subject<string>;
    readonly stateMachine: StateMachine;
    label: string;
    states: string[];
    animation?: PIXI.AnimatedSprite;
    constructor(gameObject: GameObject, { animations, cols, rows, animationSpeed, anchor }: AnimatorData, { width, height, source }: PIXI.Texture);
    get state(): string;
    get state$(): Subject<string>;
    setScale(x?: number, y?: number): void;
    getAnimationIndex(state: string): number;
    setAnimation(animation: PIXI.AnimatedSprite, loop: boolean): void;
    setState(state: string, loop?: boolean, stateWhenFinished?: string): string;
    private getExactStateIndex;
    private getFuzzyStateIndex;
}
//# sourceMappingURL=animator.d.ts.map