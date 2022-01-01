import * as PIXI from 'pixi.js';
import { GameObject, Prefab } from '..';
import { IAnimatorData } from '../animator';
export declare function createPrefab(data: IAnimatorData, texture: PIXI.Texture): Prefab;
export declare function stateChangeAllowed(gameObject: GameObject & {
    [prop: string]: any;
}): boolean;
export declare function update(gameObject: GameObject & {
    [prop: string]: any;
}, gameObjects: GameObject[]): () => void;
//# sourceMappingURL=sprite.prefab.d.ts.map