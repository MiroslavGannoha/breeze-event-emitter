# 💨 Breeze Event Emitter 💨

Simple & type safe event emitter.

## Install

```
$ npm install breeze-event-emitter
```

## Usage
### Typescript
```ts
import { BreezeEventEmitter }  from 'breeze-event-emitter';

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

const userAddedOff = events.on("user-added", (user) => {
  console.log("New user: ", JSON.stringify(user));
});

events.emit("user-added", { id: "id-1", name: "John Doe", isAdmin: false });
// New user: '{"id":"id-1","name":"John Doe","isAdmin":false}'

// Cleanup
userAddedOff(); // particular listener
events.off("user-added"); // all listeners
```

### In React
```tsx
...
React.useEffect(() => {
  const userAddedOff = events.on("user-added", (user) => {
    console.log("New user: ", JSON.stringify(user));
  });

  return () => {
    userAddedOff();
  }
}, [])
```

### Add styled logging
```tsx
...
this.events.onAny((event, ...args) => {
	info(
		'Fired an event: ' + `%c${event}`,
		'background: #222; color: #fff; font-size: 11px; padding: 2px; margin: 2px; font-style: italic;',
		'with args: ',
		args,
	);
});
```

## API

### .emit('event', data1, data2)
Invokes each of the event listeners for a given event id with the specified data.

### .on('event', listener)
Adds event listener for the event. Returns a disposer function.

### .off('event')
Removes all event listeners for the event.

### .onAny('event', listener)
Adds event listener for any event.

### .offAny('event', data1, data2)
Removes event listener for any event.
