import { GameObject } from './game-object';
export declare class Prefab extends GameObject {
    protected createFunction: (prefab: GameObject) => Promise<void>;
    constructor(label: string, createFunction: (prefab: GameObject) => Promise<void>);
    instantiate(): Promise<GameObject>;
}
//# sourceMappingURL=prefab.d.ts.map