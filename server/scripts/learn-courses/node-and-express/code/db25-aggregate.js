import mongoose from 'mongoose';

// An aggregation pipeline is a list of stages. Each stage reads the output of the one before it.
// "Total sales and order count per customer, for paid orders this year, top 5."
export function topCustomersPipeline(year) {
  return [
    { $match: { status: 'paid', createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
    { $group: { _id: '$customer', total: { $sum: '$amountCents' }, orders: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'customer' } },
    { $unwind: '$customer' },
    { $project: { _id: 0, name: '$customer.name', total: 1, orders: 1 } },
  ];
}
// const rows = await Order.aggregate(topCustomersPipeline(2026));

// A transaction makes several writes succeed together or not at all.
// It needs a replica set (MongoDB Atlas always is one; a plain local mongod is not unless you start it as one).
export async function transferStock(Product, fromId, toId, quantity) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const from = await Product.findOneAndUpdate(
        { _id: fromId, stock: { $gte: quantity } },        // only if enough stock: the check and the update are one step
        { $inc: { stock: -quantity } },
        { session, new: true },
      );
      if (!from) throw new Error('Not enough stock');
      await Product.updateOne({ _id: toId }, { $inc: { stock: quantity } }, { session });
    });
  } finally {
    await session.endSession();
  }
}
