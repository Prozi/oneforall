import { GameObject } from './game-object';
export declare class Prefab extends GameObject {
    private createFunction;
    constructor(label: string, createFunction: (prefab: GameObject) => Promise<void>);
    instantiate(): Promise<GameObject>;
}
//# sourceMappingURL=prefab.d.ts.map