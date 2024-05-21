import { Vector } from 'detect-collisions';
import { Subject } from 'rxjs/internal/Subject';
import { Animator } from './animator';
import { CircleBody } from './circle-body';
import { LifecycleProps } from './lifecycle';
import { Prefab } from './prefab';
import { Scene } from './scene';
import { SceneBase } from './scene-base';
export interface TGameObject<TSprite = Animator, TBody = CircleBody> extends GameObject {
    body: TBody;
    sprite: TSprite;
    target?: Vector;
}
export declare class GameObject implements LifecycleProps {
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
     * Lifecycle Object may be added to a Scene Object.
     */
    gameObject?: SceneBase | Scene | GameObject;
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    label: string;
    /**
     * Each GameObject has children Lifecycle Objects.
     */
    children: LifecycleProps[];
    /**
     * position x
     */
    x: number;
    /**
     * position y
     */
    y: number;
    constructor(label?: string, x?: number, y?: number);
    static instantiate(prefab: Prefab): Promise<GameObject>;
    /**
     * get root scene
     */
    get root(): SceneBase | Scene | undefined;
    update(deltaTime: number): void;
    destroy(): void;
    addChild(...children: LifecycleProps[]): void;
    removeChild(...children: LifecycleProps[]): void;
    getChildOfType(type: string): LifecycleProps;
    getChildrenOfType(type: string): LifecycleProps[];
}
//# sourceMappingURL=game-object.d.ts.map