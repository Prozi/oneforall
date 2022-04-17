import { Subject } from 'rxjs'
import { GameObject } from './game-object'
import { Component } from './component'

export type TStateValidator = (newState: string) => boolean

export class StateMachine extends Component {
  readonly name: string = 'StateMachine'
  readonly state$: Subject<string> = new Subject()
  readonly change$: Subject<string[]> = new Subject()

  state: string

  constructor(gameObject: GameObject, initialState = 'INITIAL_STATE') {
    super(gameObject)

    this.state = initialState
  }

  private validators: {
    [fromState: string]: TStateValidator[]
  } = {}

  setState(newState: string): void {
    if (!this.validateStateChange(newState)) {
      return
    }

    this.change$.next([this.state, newState])

    this.state = newState
    this.state$.next(this.state)
  }

  setValidators(fromState: string, validators: TStateValidator[]): void {
    this.validators[fromState] = validators
  }

  getValidators(fromState: string): TStateValidator[] {
    return this.validators[fromState]
  }

  destroy(): void {
    this.state$.complete()
    this.change$.complete()

    super.destroy()
  }

  private validateStateChange(newState: string): boolean {
    if (!this.state) {
      return true
    }

    const fromAllStates = this.validators['*'] || []
    const fromCurrentState = this.validators[this.state] || []

    return [...fromAllStates, ...fromCurrentState].every(
      (validator: TStateValidator) => validator(newState)
    )
  }
}
