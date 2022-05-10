import { Subject } from 'rxjs';
import { Scene } from '.';
import { IComponent, ILifecycle } from './lifecycle';
import { Prefab } from './prefab';
import { SceneBase } from './scene-base';
export declare class GameObject implements ILifecycle {
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    readonly components: IComponent[];
    parent: Scene | SceneBase;
    name: string;
    x: number;
    y: number;
    constructor(name?: string, x?: number, y?: number);
    static instantiate(prefab: Prefab): Promise<GameObject>;
    update(): void;
    destroy(): void;
    addComponent(component: IComponent): boolean;
    removeComponent(component: IComponent): boolean;
    getComponentOfType(type: string): IComponent;
    getComponentsOfType(type: string): IComponent[];
}
//# sourceMappingURL=game-object.d.ts.map