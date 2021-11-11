import { System, ICollider } from 'detect-collisions'
import { Injectable } from '@jacekpietal/dependency-injection'

export interface IBody extends ICollider {
  isTrigger?: boolean
  isStatic?: boolean
}

@Injectable
export class Physics extends System {}
