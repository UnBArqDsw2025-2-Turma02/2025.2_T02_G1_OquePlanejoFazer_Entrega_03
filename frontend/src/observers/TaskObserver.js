class TaskObserverClass {
  constructor() {
    this.subscribers = [];
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter((f) => f !== fn);
  }

  notify(task) {
    this.subscribers.forEach((fn) => fn(task));
  }
}

export const taskObserver = new TaskObserverClass();
