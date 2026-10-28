const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
console.log('1 start');
setTimeout(() => console.log('3 timer'), 0);
Promise.resolve().then(() => console.log('2.5 promise'));
console.log('2 end of script');
async function getUser(id) {
  await sleep(50);
  if (id !== 1) throw new Error('No user ' + id);
  return { id, name: 'Asha' };
}
try {
  console.log(await getUser(1));
  console.log(await getUser(2));
} catch (e) { console.log('caught:', e.message); }
const t = Date.now();
const [a, b] = await Promise.all([getUser(1), getUser(1)]);
console.log('parallel ok', Date.now() - t < 120, a.name, b.name);
