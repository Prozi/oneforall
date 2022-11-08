import { Subject } from "rxjs/internal/Subject";
import { Scene } from "./scene";
import { ILifecycle, Lifecycle } from "./lifecycle";
import { Prefab } from "./prefab";
import { SceneBase } from "./scene-base";
export declare class GameObject extends Lifecycle {
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    components: ILifecycle[];
    parent?: Scene | SceneBase;
    name: string;
    x: number;
    y: number;
    constructor(name?: string, x?: number, y?: number);
    static instantiate(prefab: Prefab): Promise<GameObject>;
    update(): void;
    destroy(): void;
    addComponent(component: ILifecycle): boolean;
    removeComponent(component: ILifecycle): boolean;
    getComponentOfType(type: string): ILifecycle;
    getComponentsOfType(type: string): ILifecycle[];
}
//# sourceMappingURL=game-object.d.ts.map