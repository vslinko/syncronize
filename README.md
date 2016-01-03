# synchronize-calls

Decorator that synchronizes asynchronous methods :-)

## Method Decorator Example

```js
import synchronize from 'synchronize-calls';

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
```

## Function Decorator Example

```js
import {synchronizeFunction} from 'synchronize-calls';

let item;

async function saveItem(newItem) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  item = newItem;
  console.log('Saved item with price:', item.price);
}

function increment() {
  return saveItem({price: item.price + 1});
}

const syncedIncrement = synchronizeFunction(async function syncedIncrement(lock) {
  await lock;
  await saveItem({price: item.price + 1});
});

async function testAsync() {
  item = {price: 0};

  await* [
    increment(), // Saved item with price: 1
    increment(), // Saved item with price: 1
    increment(), // Saved item with price: 1
  ];
}

async function testSync() {
  item = {price: 0};

  await* [
    syncedIncrement(), // Saved item with price: 1
    syncedIncrement(), // Saved item with price: 2
    syncedIncrement(), // Saved item with price: 3
  ];
}

async function test() {
  await testAsync();
  await testSync();
}

test();
```
