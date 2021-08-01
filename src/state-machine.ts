import { Subject } from 'rxjs'
import { Component } from './component'

export class StateMachine extends Component {
  readonly name: string = 'StateMachine'
  readonly state$: Subject<string> = new Subject()
  readonly change$: Subject<string[]> = new Subject()

  state: string = 'INITIAL_STATE'

  private validators: {
    [fromState: string]: Array<(newState: string) => boolean>
  } = {}

  setState(newState: string): void {
    if (!this.validateStateChange(newState)) {
      return
    }

    this.change$.next([this.state, newState])

    this.state = newState
    this.state$.next(this.state)
  }

  setValidators(
    fromState: string,
    validators: Array<(newState: string) => boolean>
  ): void {
    this.validators[fromState] = validators
  }

  getValidators(fromState: string): Array<(newState: string) => boolean> {
    return this.validators[fromState]
  }

  private validateStateChange(newState: string): boolean {
    const transitionValidators: Array<(newState: string) => boolean> =
      this.validators[this.state] || []

    return transitionValidators.every(
      (transitionValidator: (newState: string) => boolean) =>
        transitionValidator(newState)
    )
  }
}
