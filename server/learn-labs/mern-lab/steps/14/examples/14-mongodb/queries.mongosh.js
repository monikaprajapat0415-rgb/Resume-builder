// Lesson 14: MongoDB in the shell.
// Run with mongosh (comes with MongoDB):   mongosh "<your connection string>" examples/14-mongodb/queries.mongosh.js
// This uses a database called job_tracker_demo and drops it at the end, so it is safe to run.
const db = db.getSiblingDB('job_tracker_demo');

// INSERT: a collection is created the first time you write to it
db.jobs.insertMany([
  { company: 'Northwind Bank', role: 'Teller', status: 'applied', salary: { min: 20000, max: 26000 }, tags: ['bank', 'day shift'] },
  { company: 'Acme Logistics', role: 'Dispatcher', status: 'interview', salary: { min: 18000, max: 24000 }, tags: ['night shift'] },
  { company: 'Greenfield Foods', role: 'Line Supervisor', status: 'saved', tags: ['factory'] },
]);

// FIND: filter, project (choose fields), sort, limit
print('--- applied or interview');
printjson(db.jobs.find({ status: { $in: ['applied', 'interview'] } }, { _id: 0, company: 1, status: 1 }).sort({ company: 1 }).toArray());

print('--- nested field and array');
printjson(db.jobs.find({ 'salary.min': { $gte: 19000 }, tags: 'bank' }, { _id: 0, role: 1 }).toArray());

// UPDATE: $set changes fields, $push adds to an array
db.jobs.updateOne({ company: 'Greenfield Foods' }, { $set: { status: 'applied' }, $push: { tags: 'full time' } });

// AGGREGATE: group and count (this is how the stats screen will work)
print('--- jobs per status');
printjson(db.jobs.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }, { $sort: { count: -1 } }]).toArray());

// DELETE
db.jobs.deleteOne({ company: 'Acme Logistics' });
print('--- left:', db.jobs.countDocuments());

db.dropDatabase();
