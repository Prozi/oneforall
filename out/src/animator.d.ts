import * as PIXI from 'pixi.js';
import { GameObject } from './game-object';
import { Container } from './container';
import { BehaviorSubject, Subject } from 'rxjs';
export interface IAnimatorData {
    animations: {
        [name: string]: Array<number | string>;
    };
    width: number;
    height: number;
    tilewidth: number;
    tileheight: number;
}
export declare class Animator extends Container {
    readonly name: string;
    readonly complete$: Subject<string>;
    readonly state$: BehaviorSubject<string>;
    states: string[];
    state?: string;
    animation?: PIXI.AnimatedSprite;
    /**
     * create animated container
     * @param animations
     * @param textures
     * @param radius
     */
    constructor(gameObject: GameObject, data: IAnimatorData, { baseTexture }: PIXI.Texture);
    setScale(x?: number, y?: number): void;
    /**
     * set character animation
     * @param animation
     * @param loop
     * @param stateWhenFinished
     */
    setState(state: string, loop?: boolean, stateWhenFinished?: string): void;
}
//# sourceMappingURL=animator.d.ts.map