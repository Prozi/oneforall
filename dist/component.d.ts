import { GameObject } from './game-object';
import { Lifecycle } from './lifecycle';
export declare class Component extends Lifecycle {
    readonly name: string;
    readonly gameObject: GameObject;
    constructor(gameObject: GameObject);
}
//# sourceMappingURL=component.d.ts.map