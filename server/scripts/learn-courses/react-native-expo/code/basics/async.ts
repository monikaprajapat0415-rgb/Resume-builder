const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function loadUser(id: number): Promise<{ id: number; name: string }> {
  await wait(100);
  if (id < 0) throw new Error("Bad id");
  return { id, name: `User ${id}` };
}

async function main() {
  try {
    const user = await loadUser(7);
    console.log(user.name);
    await loadUser(-1);
  } catch (e) {
    console.log("Failed:", (e as Error).message);
  }
}

main();
