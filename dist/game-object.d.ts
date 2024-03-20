import { Subject } from 'rxjs/internal/Subject';
import { Scene } from './scene';
import { Lifecycle } from './lifecycle';
import { Prefab } from './prefab';
import { SceneBase } from './scene-base';
export declare class GameObject extends Lifecycle {
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    components: Lifecycle[];
    scene?: Scene | SceneBase;
    name: string;
    constructor(name?: string, x?: number, y?: number);
    static instantiate(prefab: Prefab): Promise<GameObject>;
    update(): void;
    destroy(): void;
    addComponent(component: Lifecycle): boolean;
    removeComponent(component: Lifecycle): boolean;
    getComponentOfType(type: string): Lifecycle;
    getComponentsOfType(type: string): Lifecycle[];
}
//# sourceMappingURL=game-object.d.ts.map