import { Subject } from 'rxjs/internal/Subject';
import { Lifecycle, LifecycleProps } from './lifecycle';
import { Prefab } from './prefab';
import { Scene } from './scene';
import { SceneBase } from './scene-base';
export declare class GameObject extends Lifecycle {
    label: string;
    components: LifecycleProps[];
    scene?: Scene | SceneBase;
    readonly update$: Subject<void>;
    readonly destroy$: Subject<void>;
    constructor(label?: string, x?: number, y?: number);
    static instantiate(prefab: Prefab): Promise<GameObject>;
    update(): void;
    destroy(): void;
    addComponent(component: LifecycleProps): boolean;
    removeComponent(component: LifecycleProps): boolean;
    getComponentOfType(type: string): LifecycleProps;
    getComponentsOfType(type: string): LifecycleProps[];
}
//# sourceMappingURL=game-object.d.ts.map