import LogAbstract from './LogAbstract';

class ActionLog extends LogAbstract {
  constructor() {
    super();
    this.queue = [];
  }
  push(data) {
    this.queue.push(data);
  }

  getAll() {
    return this.queue;
  }

  clearAll() {
    this.queue = [];
  }
}

export default new ActionLog();
