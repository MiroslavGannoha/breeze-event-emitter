export class BreezeEventEmitter<Events extends Record<string, unknown[]>> {
  // A mapping of event IDs to an array of callbacks.
  private eventsCallbacks: Map<
    keyof Events,
    Array<(...args: Events[keyof Events]) => void>
  > = new Map();

  // An array of callback for any event.
  private anyEventCallbacks: Array<
    <T extends keyof Events>(eventType: T, ...args: Events[T]) => void
  > = [];

  // Retrieve the list of event handlers for a given event id.
  private getEventCallbacks<T extends keyof Events>(
    eventType: T
  ): Array<(...args: Events[T]) => void> {
    const eventCallbacks = this.eventsCallbacks.get(eventType);
    if (eventCallbacks) {
      return eventCallbacks;
    }
    return [];
  }

  // Append the new callback to our list of event handlers.
  private addEventCallback<T extends keyof Events>(
    eventType: T,
    callback: (...args: Events[T]) => void
  ) {
    if (!this.eventsCallbacks.has(eventType)) {
      this.eventsCallbacks.set(eventType, []);
    }
    const eventCallbacks = this.eventsCallbacks.get(eventType);
    if (eventCallbacks) {
      eventCallbacks.push(callback as (...args: Events[keyof Events]) => void);
    }
  }

  /**
   * Invokes each of the event listeners for a given event id with the specified data.
   * @param eventType - event identifier
   * @param data - all arguments to send with this event (can be multiple)
   */
  public emit<T extends keyof Events>(eventType: T, ...args: Events[T]): void {
    const eventCallbacks = this.getEventCallbacks(eventType);
    for (const eventCallback of eventCallbacks) {
      eventCallback(...args);
    }

    for (const anyCallback of this.anyEventCallbacks) {
      anyCallback(eventType, ...args);
    }
  }

  /**
   * Adds event listener for the event
   * @param eventType - event identifier
   * @param callback - function to be called when an event emitted
   * @returns disposer function to cancel the subscription
   */
  public on<T extends keyof Events>(
    eventType: T,
    cb: (...args: Events[T]) => void
  ): () => void {
    this.addEventCallback<T>(eventType, cb);
    return () => {
      const callbacks = this.eventsCallbacks.get(eventType);
      if (!callbacks) return;
      const cbIndex = callbacks.findIndex((callback) => callback === cb);
      callbacks.splice(cbIndex, 1);
    };
  }

  /**
   * Removes all event listeners for the event
   * @param eventType - event identifier
   */
  public off(eventType: keyof Events): void {
    this.eventsCallbacks.set(eventType, []);
  }

  /**
   * Adds event listener for any event
   * @param callback - function to be called when any event emitted
   */
  public onAny(
    cb: <T extends keyof Events>(eventType: T, ...args: Events[T]) => void
  ): void {
    this.anyEventCallbacks.push(cb);
  }

  /**
   * Removes event listener for any event
   * @param callback - function to be called when any event emitted
   */
  public offAny(): void {
    this.anyEventCallbacks.length = 0;
  }
}

