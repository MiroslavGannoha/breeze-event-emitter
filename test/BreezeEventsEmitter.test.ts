import { BreezeEventEmitter } from '../src';

interface TestClientEventModule {
  id: string;
  name: string;
  age: number;
}
export type Events = {
  'user-connect': [TestClientEventModule, string];
  'user-disconnect': [TestClientEventModule];
};

const testUser: TestClientEventModule = { id: 'some-id', name: 'Test User Name', age: 123 };
const testMessage = 'some test message';

describe('Events Module', () => {
  test('tests the event callback when not published', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.on('user-connect', mockCallback);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('tests the any event callback when not published', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.onAny(mockCallback);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('tests the event callback when not subscribed', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.emit('user-connect', testUser, testMessage);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('tests the event callback when published with args', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.on('user-connect', mockCallback);

    events.emit('user-connect', testUser, testMessage);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(testUser, testMessage);
  });

  test('tests any event callback when published with args', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.onAny(mockCallback);

    events.emit('user-connect', testUser, testMessage);

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('user-connect', testUser, testMessage);
  });

  test('tests the event callback when published "n" times', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.on('user-connect', mockCallback);

    events.emit('user-connect', testUser, testMessage);
    events.emit('user-connect', testUser, testMessage);

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  test('tests any event callback when published "n" times', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.onAny(mockCallback);

    events.emit('user-connect', testUser, testMessage);
    events.emit('user-connect', testUser, testMessage);

    expect(mockCallback).toHaveBeenCalledTimes(2);
  });

  test('tests the event callback when subscribed "n" times', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.on('user-connect', mockCallback);
    events.on('user-connect', mockCallback);
    events.on('user-connect', mockCallback);

    events.emit('user-connect', testUser, testMessage);

    expect(mockCallback).toHaveBeenCalledTimes(3);
  });

  test('tests any event callback when subscribed "n" times', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.onAny(mockCallback);
    events.onAny(mockCallback);
    events.onAny(mockCallback);

    events.emit('user-connect', testUser, testMessage);

    expect(mockCallback).toHaveBeenCalledTimes(3);
  });

  test('tests disabling the event', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.on('user-connect', mockCallback);
    events.off('user-connect');
    events.emit('user-connect', testUser, testMessage);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('tests disabling any event', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback = jest.fn();
    events.onAny(mockCallback);
    events.offAny();
    events.emit('user-connect', testUser, testMessage);
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test('tests disabling particular subscription', () => {
    const events = new BreezeEventEmitter<Events>();
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    const mockCallback3 = jest.fn();
    events.on('user-connect', mockCallback1);
    const disposer = events.on('user-connect', mockCallback2);
    events.on('user-connect', mockCallback3);
    disposer();
    events.emit('user-connect', testUser, testMessage);
    expect(mockCallback1).toHaveBeenCalled();
    expect(mockCallback2).not.toHaveBeenCalled();
    expect(mockCallback3).toHaveBeenCalled();
  });
});
