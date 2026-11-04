export type Meal = { id: string; name: string; thumb: string };
export type MealDetail = Meal & { category: string; area: string; instructions: string; ingredients: string[] };

const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function searchMeals(query: string): Promise<Meal[]> {
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return (data.meals ?? []).map((m: any) => ({ id: m.idMeal, name: m.strMeal, thumb: m.strMealThumb }));
}

export async function getMeal(id: string): Promise<MealDetail> {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`);
  if (!res.ok) throw new Error("Could not load the recipe");
  const m = (await res.json()).meals?.[0];
  if (!m) throw new Error("Recipe not found");
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const name = (m[`strIngredient${i}`] ?? "").trim();
    const measure = (m[`strMeasure${i}`] ?? "").trim();
    if (name) ingredients.push(`${measure} ${name}`.trim());
  }
  return {
    id: m.idMeal, name: m.strMeal, thumb: m.strMealThumb,
    category: m.strCategory, area: m.strArea, instructions: m.strInstructions, ingredients,
  };
}
