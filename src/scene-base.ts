import { Subject } from "rxjs/internal/Subject";
import { System, Body } from "detect-collisions";
import { GameObject } from "./game-object";
import { Lifecycle } from "./lifecycle";
import { IStage, StageBase } from "./stage-base";

export interface SceneOptions {
  name?: string;
  visible?: boolean;
  autoSize?: boolean;
  autoSort?: boolean;
  scale?: number;
  nodeMaxEntries?: number;
}

export class SceneBase<TBody extends Body = Body> extends Lifecycle {
  readonly name: string = "Scene";

  children$: Subject<void> = new Subject();
  children: GameObject[] = [];
  stage: IStage = new StageBase();
  physics: System<TBody>;
  scale: number;
  destroy$: Subject<void> = new Subject();
  animationFrame: number;

  constructor(options: SceneOptions = {}) {
    super();

    this.physics = new System<TBody>(options.nodeMaxEntries);
    this.scale = options.scale || 1;
  }

  stop(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  start(): void {
    const loop = () => {
      this.update();

      this.animationFrame = requestAnimationFrame(loop);
    };

    loop();
  }

  update(): void {
    this.physics.update();
    this.children.forEach((child: GameObject) => {
      child.update();
    });
    super.update();
  }

  destroy(): void {
    this.stop();
    while (this.children.length) {
      this.children.pop().destroy();
    }
    super.destroy();
    this.children$.complete();
    this.children$ = undefined;
  }

  addChild(child: GameObject): void {
    const index = this.children.indexOf(child);
    if (index !== -1) {
      return;
    }

    child.parent = this;

    this.children.push(child);
    this.children$.next();
  }

  removeChild(child: GameObject): void {
    const index = this.children.indexOf(child);
    if (index === -1) {
      return;
    }

    child.parent = null;

    this.children.splice(index, 1);
    this.children$.next();
  }

  getChildOfType(type: string): GameObject {
    return this.children.find(({ name }) => name === type);
  }

  getChildrenOfType(type: string): GameObject[] {
    return this.children.filter(({ name }) => name === type);
  }
}
