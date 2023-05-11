import * as PIXI from 'pixi.js';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Container } from './container';
export interface IAnimatorData {
    animations: {
        [name: string]: (number | string)[];
    };
    cols: number;
    rows: number;
    animationSpeed?: number;
    anchor?: {
        x: number;
        y: number;
    };
}
export declare class Animator extends Container {
    readonly name: string;
    readonly complete$: Subject<string>;
    readonly state$: BehaviorSubject<string>;
    states: string[];
    state?: string;
    animation?: PIXI.AnimatedSprite;
    constructor(gameObject: GameObject, { animations, cols, rows, animationSpeed, anchor }: IAnimatorData, { width, height, baseTexture }: PIXI.Texture);
    setScale(x?: number, y?: number): void;
    getAnimationIndex(state: string): number;
    setAnimation(animation: PIXI.AnimatedSprite): void;
    setState(state: string, loop?: boolean, stateWhenFinished?: string): string;
    private getExactStateIndex;
    private getFuzzyStateIndex;
}
//# sourceMappingURL=animator.d.ts.map