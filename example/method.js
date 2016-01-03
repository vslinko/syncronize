import synchronize from '../lib';

class Example {
  constructor() {
    this.start = new Date();
  }

  @synchronize()
  async syncedDelayLog(msg, time, lock) {
    await lock;
    await this.delayLog(msg, time);
  }

  async delayLog(msg, time) {
    await new Promise(resolve => setTimeout(resolve, time));
    this.log(msg);
  }

  log(...args) {
    console.log(Math.floor((new Date() - this.start) / 1000) + 's:', ...args);
  }
}

const e = new Example();

e.delayLog('async 1', 1000); // outputs after 1s
e.delayLog('async 2', 1000); // outputs after 1s
e.delayLog('async 3', 1000); // outputs after 1s

e.syncedDelayLog('sync 1', 3000); // outputs after 3s
e.syncedDelayLog('sync 2', 2000); // outputs after 5s
e.syncedDelayLog('sync 3', 1000); // outputs after 6s
