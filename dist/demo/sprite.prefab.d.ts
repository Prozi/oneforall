import { Vector } from 'detect-collisions';
import { Animator } from '../animator';
import { CircleBody } from '../circle-body';
import { GameObject } from '../game-object';
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