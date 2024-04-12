import { Vector } from 'detect-collisions';
import { Animator } from './animator';
import { CircleBody } from './circle-body';
import { Lifecycle, LifecycleProps } from './lifecycle';
import { Prefab } from './prefab';
import { Scene } from './scene';
import { SceneBase } from './scene-base';
import { StateMachine } from './state-machine';
export interface TGameObject<TSprite = Animator, TBody = CircleBody> extends GameObject {
    body: TBody;
    sprite: TSprite;
    state?: StateMachine;
    target?: Vector;
}
export declare class GameObject extends Lifecycle {
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    label: string;
    /**
     * Each GameObject has children Lifecycle Objects.
     */
    components: LifecycleProps[];
    /**
     * Lifecycle Object may be added to a Scene Object.
     */
    scene?: SceneBase | Scene;
    constructor(label?: string, x?: number, y?: number);
    static instantiate(prefab: Prefab): Promise<GameObject>;
    update(deltaTime: number): void;
    destroy(): void;
    addComponent(component: LifecycleProps): boolean;
    removeComponent(component: LifecycleProps): boolean;
    getComponentOfType(type: string): LifecycleProps;
    getComponentsOfType(type: string): LifecycleProps[];
}
//# sourceMappingURL=game-object.d.ts.map