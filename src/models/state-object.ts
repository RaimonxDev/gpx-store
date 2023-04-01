import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { checkIfConditionMet } from "../utilities";


export class StateObject<T extends { [key: string]: any }>{
  private state: T;
  readonly observableSubject: BehaviorSubject<T>;

  constructor(state: T) {
    this.state = state;
    this.observableSubject = new BehaviorSubject(state);
  }

  /**
   * @desc returns the observable that contains the state for async operations - it listens for changes
   * @return Observable<State>
   */
  getObservable(): Observable<T> {
    return this.observableSubject.asObservable();
  }

  /**
   * @desc unsubscribes from the observable
   * @return void
   */
  unsubscribe(): void {
    this.observableSubject.unsubscribe();
  }

  /**
   * @desc returns the value of the state at the time of the call
   * @return State
   */
  getStateSnapshot(): T {
    return { ...this.state };
  }

  /**
   * @desc returns the value of a property of the state at the time of the call
   * @param property - the name of the requested property
   * @return any
   */
  getPropertyFromState<K extends keyof T>(property: K): T[K] {
    return this.state[property];
  }

  /**
   * @desc returns the value of a property of the state for async operations - it listens for changes
   * @param property - the name of the requested property
   * @return Observable<any>
   */
  getPropertyFromObservable<K extends keyof T>(property: K): Observable<T[K]> {
    return this.getObservable().pipe(
      map((s) => this.checkIfPropertyExists(s, property))
    );
  }

  /**
   * @desc sets the value for a certain property inside the state, triggers an async event if requested
   * @param value - the value for the requested property
   * @param property - the name of the requested property
   * @param emit - if true it will trigger an async event
   * @return void
   */
  setObservableValues<K extends keyof T>(
    value: T[K],
    property: K | null = null,
    emit = true
  ): void {
    this.setStateValues(value, property);
    if (emit) {
      this.observableSubject.next(this.state);
    }
  }

  /**
   * @desc sets the value for a certain property inside the state, doesn't triggers an async event
   * @param value - the value for the requested property
   * @param property - the name of the requested property, if no property it will try to patch the values into the state
   * @return void
   */
  private setStateValues<K extends keyof T>(
    value: T[K],
    property: K | null
  ): void {
    if (
      property &&
      this.checkIfPropertyExists(this.state, property) !== undefined
    ) {
      this.state[property] = value;
    } else {
      this.state = {
        ...this.state,
        ...value,
      };
    }
  }

  /**
   * @desc resets the state
   * @return void
   */
  resetState(): void {
    this.state = {} as T;
  }

  /**
   * @desc checks if the selected property exists inside the state
   * @param state - the state of the observable, the object that represents what the observable is going to contain
   * @param property - the selected property
   * @return any
   */
  private checkIfPropertyExists<K extends keyof T>(state: T, property: K): T[K] {
    const condition = () => {
      return { met: property in state, value: state[property] };
    };
    return checkIfConditionMet(
      () => condition(),
      `Selected property "${String(property)}" not found in state! Check if the key is correct and exists.`
    );
  }
}
