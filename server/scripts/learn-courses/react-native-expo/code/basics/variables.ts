const name: string = "Asha";
let steps = 5000;
const goal = 10000;

steps += 1500;

const percent = Math.round((steps / goal) * 100);
console.log(`${name} walked ${steps} steps`);
console.log(`That is ${percent}% of the goal`);
