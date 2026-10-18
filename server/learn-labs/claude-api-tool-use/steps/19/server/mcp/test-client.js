// Run with:  npm run mcp:test
// Connects to every server in servers.json, lists its tools and prints them.
import { listServers } from './client.js';

for (const s of await listServers()) {
  console.log(`\n${s.name}`);
  for (const t of s.tools) console.log(`  - ${t.name}: ${t.description}`);
}
