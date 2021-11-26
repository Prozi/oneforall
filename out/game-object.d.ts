import { Subject } from 'rxjs';
import { IComponent, ILifecycle } from './component';
import { Prefab } from './prefab';
import { Scene } from './scene';
export declare class GameObject implements ILifecycle {
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    readonly components: Set<IComponent>;
    readonly components$: Subject<void>;
    parent: Scene;
    name: string;
    x: number;
    y: number;
    constructor(name?: string, x?: number, y?: number);
    static instantiate(prefab: Prefab): Promise<GameObject>;
    update(): void;
    destroy(): void;
    addComponent(component: IComponent, key?: string): IComponent;
    removeComponent(component: IComponent, key?: string): void;
    getComponentOfType(type: string): IComponent;
    getComponentsOfType(type: string): IComponent[];
}
//# sourceMappingURL=game-object.d.ts.map