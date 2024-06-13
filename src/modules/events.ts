export interface IEvents {
  on<T extends object>(eventName: string, callback: (data?: T) => void): void;
  emit<T extends object>(eventName: string, data?: T): void;
}

export class EventEmitter implements IEvents {
  protected _events: Map<string, Set<Function>>;

  constructor() {
    this._events = new Map<string, Set<Function>>();
  }

  on<T extends object>(eventName: string, callback: (event?: T) => void) {
    if (!this._events.has(eventName)) {
      this._events.set(eventName, new Set<Function>());
    }
    this._events.get(eventName)?.add(callback);
  }

  emit<T extends object>(eventName: string, data?: T) {
    this._events.forEach((subscribers, name) => {
      if (name === eventName) {
        subscribers.forEach(callback => callback(data));
      }
    });
  }
}