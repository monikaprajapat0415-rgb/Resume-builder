type User = { name: string; age?: number };

function greet(user: User, greeting = "Hello"): string {
  return `${greeting}, ${user.name}!`;
}

const double = (n: number) => n * 2;

const scores = [40, 75, 90, 55];
const passed = scores.filter((s) => s >= 50);
const doubled = passed.map(double);
const total = scores.reduce((sum, s) => sum + s, 0);

console.log(greet({ name: "Ravi" }));
console.log(greet({ name: "Ravi" }, "Welcome"));
console.log(passed);
console.log(doubled);
console.log(total);
