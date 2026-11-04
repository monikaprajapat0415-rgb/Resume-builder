const person = { name: "Meera", city: "Pune", skills: ["React", "TypeScript"] };
const { name, city } = person;
const [first, ...others] = person.skills;
const updated = { ...person, city: "Delhi" };

console.log(name, city);
console.log(first, others);
console.log(updated.city, person.city);
