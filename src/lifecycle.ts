import { Subject } from "rxjs/internal/Subject";
import { GameObject } from "./game-object";

export interface ILifecycle {
  readonly name: string;

  update$?: Subject<void>;
  destroy$?: Subject<void>;

  update(): void;
  destroy(): void;
}

export class Lifecycle implements ILifecycle {
  readonly name: string = "Lifecycle";

  update$?: Subject<void> = new Subject();
  destroy$?: Subject<void> = new Subject();
  gameObject?: GameObject;

  destroy(): void {
    this.update$?.complete();
    this.destroy$?.next();
    this.destroy$?.complete();
    this.update$ = undefined;
    this.destroy$ = undefined;
    this.gameObject = undefined;
  }

  update(): void {
    this.update$.next();
  }
}
