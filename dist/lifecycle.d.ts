import { Subject } from 'rxjs/internal/Subject';
import { GameObject } from './game-object';
import { Scene } from './scene';
import { SceneBase } from './scene-base';
export interface LifecycleProps {
    /**
     * When Lifecycle Object is updated, it emits this subject.
     * Along with updating his children, which in turn behave the same.
     */
    readonly update$: Subject<number>;
    /**
     * When Lifecycle Object is destroyed, it emits and closes this subject.
     * Along with destroying his children, which in turn behave the same.
     */
    readonly destroy$: Subject<void>;
    /**
     * Parent GameObject is assigned at creation.
     * BaseScene & Scene don't have parent gameObject
     */
    readonly gameObject?: GameObject;
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    label: string;
    /**
     * Lifecycle Object may be added to a Scene Object.
     */
    scene?: SceneBase | Scene;
    /**
     * Updates the Lifecycle Object with actual deltaTime ~60fps
     */
    update(deltaTime: number): void;
    /**
     * Called to destroy can cleanup Lifecycle Object.
     */
    destroy(): void;
}
export declare abstract class Lifecycle implements LifecycleProps {
    /**
     * When Lifecycle Object is updated, it emits this subject.
     * Along with updating his children, which in turn behave the same.
     */
    readonly update$: Subject<number>;
    /**
     * When Lifecycle Object is destroyed, it emits and closes this subject.
     * Along with destroying his children, which in turn behave the same.
     */
    readonly destroy$: Subject<void>;
    /**
     * Each Lifecycle Object has label for pixi debugging.
     */
    label: string;
    static destroy(lifecycle: LifecycleProps): void;
    static update(lifecycle: LifecycleProps, deltaTime: number): void;
    destroy(): void;
    update(deltaTime: number): void;
}
//# sourceMappingURL=lifecycle.d.ts.map