import { GameObject } from '../game-object';
import { CircleBody } from '../circle-body';
import { Animator } from '../animator';
import { Vector } from 'detect-collisions';
export type TGameObject = GameObject & {
    body: CircleBody;
    sprite: Animator;
    target?: Vector;
};
export declare function createSprite({ scene, data, texture }: {
    scene: any;
    data: any;
    texture: any;
}): TGameObject;
export declare function updateSprite(gameObject: TGameObject): void;
//# sourceMappingURL=sprite.prefab.d.ts.map