import { Subject } from "rxjs/internal/Subject";
import { GameObject } from "./game-object";
export interface ILifecycle {
    readonly name: string;
    update$?: Subject<void>;
    destroy$?: Subject<void>;
    update(): void;
    destroy(): void;
}
export declare class Lifecycle implements ILifecycle {
    readonly name: string;
    update$?: Subject<void>;
    destroy$?: Subject<void>;
    gameObject?: GameObject;
    destroy(): void;
    update(): void;
}
//# sourceMappingURL=lifecycle.d.ts.map