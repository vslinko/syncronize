import {synchronizeFunction} from '../lib';

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
