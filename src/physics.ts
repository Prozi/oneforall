import { System, ICollider } from 'detect-collisions'
import { Injectable } from '@jacekpietal/dependency-injection'
import { Subject } from 'rxjs'

export interface IBody extends ICollider {
  isTrigger?: boolean
  isStatic?: boolean
}

@Injectable
export class Physics extends System {
  static readonly collision$: Subject<Partial<Response>> = new Subject()

  remove(body: IBody): void {
    this.tree.remove(body)
  }

  getPotentials(body: IBody): IBody[] {
    return super.getPotentials(body).filter(({ isTrigger }: any) => !isTrigger)
  }
}
