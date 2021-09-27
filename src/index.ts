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

  // Invoke each of the event handlers for a given event id with specified data.
  public emit<T extends keyof Events>(eventType: T, ...args: Events[T]): void {
    const eventCallbacks = this.getEventCallbacks(eventType);
    for (const eventCallback of eventCallbacks) {
      eventCallback(...args);
    }

    for (const anyCallback of this.anyEventCallbacks) {
      anyCallback(eventType, ...args);
    }
  }

  // Callback registration
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

  // Callback clean up
  public off(eventType: keyof Events): void {
    this.eventsCallbacks.set(eventType, []);
  }

  // Callback registration for any event
  public onAny(
    cb: <T extends keyof Events>(eventType: T, ...args: Events[T]) => void
  ): void {
    this.anyEventCallbacks.push(cb);
  }

  // Callback clean up for any events
  public offAny(): void {
    this.anyEventCallbacks.length = 0;
  }
}

interface User {
  id: string;
  name: string;
  isAdmin: boolean;
}

// Declare your events
type UserEvents = {
  "user-added": [User];
};

// Create an instance and pass events typings
const events = new BreezeEventEmitter<UserEvents>();

events.on("user-added", (user) => {
  console.log("New user: ", JSON.stringify(user));
});

events.emit("user-added", { id: "id-1", name: "John Doe", isAdmin: false });
// New user: '{"id":"id-1","name":"John Doe","isAdmin":false}'
