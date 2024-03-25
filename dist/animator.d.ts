import { Vector } from 'detect-collisions';
import * as PIXI from 'pixi.js';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { Container } from './container';
import { GameObject } from './game-object';
export interface AnimatorData {
    animations: Record<string, (number | string)[]>;
    cols: number;
    rows: number;
    animationSpeed?: number;
    anchor?: Vector;
}
export declare class Animator extends Container {
    label: string;
    readonly complete$: Subject<string>;
    readonly state$: BehaviorSubject<string>;
    states: string[];
    state?: string;
    animation?: PIXI.AnimatedSprite;
    constructor(gameObject: GameObject, { animations, cols, rows, animationSpeed, anchor }: AnimatorData, { width, height, source }: PIXI.Texture);
    setScale(x?: number, y?: number): void;
    getAnimationIndex(state: string): number;
    setAnimation(animation: PIXI.AnimatedSprite): void;
    setState(state: string, loop?: boolean, stateWhenFinished?: string): string;
    private getExactStateIndex;
    private getFuzzyStateIndex;
}
//# sourceMappingURL=animator.d.ts.map