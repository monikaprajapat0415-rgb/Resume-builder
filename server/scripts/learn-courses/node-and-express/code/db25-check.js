import { topCustomersPipeline } from './db25-aggregate.js';
const stages = topCustomersPipeline(2026).map((s) => Object.keys(s)[0]);
console.log(stages.join(' -> '));
