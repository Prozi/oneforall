import { GameObject } from './game-object';
import { Lifecycle } from './lifecycle';
export declare class Component extends Lifecycle {
    label: string;
    readonly gameObject: GameObject;
    constructor(gameObject: GameObject);
}
//# sourceMappingURL=component.d.ts.map