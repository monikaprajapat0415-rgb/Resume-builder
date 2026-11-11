import { EventEmitter } from 'node:events';

class OrderService extends EventEmitter {
  place(item) {
    const order = { id: 1, item };
    this.emit('placed', order);   // tell anyone who is listening
    return order;
  }
}

const orders = new OrderService();
orders.on('placed', (order) => console.log('Email sent for', order.item));
orders.on('placed', (order) => console.log('Stock reduced for', order.item));
orders.once('placed', () => console.log('First order ever!'));

orders.place('Keyboard');
orders.place('Mouse');
console.log('Listeners:', orders.listenerCount('placed'));
