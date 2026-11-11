// A function with a bug. Use it to practise the debugger:  node --inspect-brk d41-bug.js
export function averageOrderValue(orders) {
  let total = 0;
  for (const order of orders) {
    total += order.amount;          // set a breakpoint here and watch "total" and "order"
  }
  return total / orders.length;
}

const orders = [{ amount: 100 }, { amount: '250' }, { amount: 50 }];   // BUG: one amount is a string
console.log(averageOrderValue(orders));
