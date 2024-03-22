import * as PIXI from 'pixi.js';
import { Subject } from 'rxjs/internal/Subject';
import { System, Body } from 'detect-collisions';
import { GameObject } from './game-object';
import { Lifecycle } from './lifecycle';

export interface SceneOptions {
  label?: string;
  visible?: boolean;
  autoSort?: boolean;
  scale?: number;
  nodeMaxEntries?: number;
}

export class SceneBase<TBody extends Body = Body> extends Lifecycle {
  readonly label: string = 'Scene';

  children$: Subject<void> = new Subject();
  physics: System<TBody>;
  destroy$: Subject<void> = new Subject();
  animationFrame: number;

  constructor(options: SceneOptions = {}) {
    super();

    this.physics = new System<TBody>(options.nodeMaxEntries);
    this.scale = options.scale || 1;
  }

  // tslint:disable-next-line
  async init(_options?: Record<string, any>): Promise<void> {}

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
      if (child instanceof Lifecycle) {
        child.update();
      }
    });

    super.update();
  }

  destroy(): void {
    this.stop();

    while (this.children.length) {
      const component = this.children.pop() as Lifecycle;

      // will also gameObject.removeComponent(component)
      component.destroy();
    }

    this.children$.complete();
    this.children$ = undefined;
    super.destroy();
  }

  addChild(...children: PIXI.Container[]): PIXI.Container {
    const result = super.addChild(...children);

    children.forEach((child: Lifecycle) => {
      child.scene = this;
    });

    this.children$.next();

    return result;
  }

  removeChild(...children: PIXI.Container[]): PIXI.Container {
    const result = super.removeChild(...children);

    children.forEach((child: Lifecycle) => {
      child.scene = null;
    });

    this.children$.next();

    return result;
  }

  getChildOfType(type: string): PIXI.Container {
    return (this.children as Lifecycle[]).find(({ label }) => label === type);
  }

  getChildrenOfType(type: string): PIXI.Container[] {
    return (this.children as Lifecycle[]).filter(({ label }) => label === type);
  }
}
