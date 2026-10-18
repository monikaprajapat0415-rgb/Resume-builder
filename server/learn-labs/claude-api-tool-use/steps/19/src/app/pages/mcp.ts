import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Tool = { name: string; description: string; inputSchema: unknown };
type Srv = { name: string; tools: Tool[] };

@Component({
  selector: 'app-mcp',
  imports: [FormsModule],
  template: `
    <h1>MCP servers and tools</h1>
    <p class="hint">Our Node server starts each MCP server as a child process, asks what tools it offers and can call them.</p>

    @if (error()) { <div class="err">{{ error() }}</div> }
    @for (s of servers(); track s.name) {
      <div class="card">
        <h2>Server: {{ s.name }}</h2>
        @for (t of s.tools; track t.name) {
          <p><strong>{{ t.name }}</strong><br /><span class="muted">{{ t.description }}</span></p>
          <pre class="out">{{ pretty(t.inputSchema) }}</pre>
          <label [attr.for]="'a-' + t.name">Arguments (JSON)</label>
          <textarea [id]="'a-' + t.name" [(ngModel)]="args[t.name]" style="min-height:70px"></textarea>
          <button (click)="call(s.name, t.name)" [disabled]="busy()">Call {{ t.name }}</button>
          @if (results[t.name]) { <pre class="out">{{ results[t.name] }}</pre> }
        }
      </div>
    } @empty {
      <p class="muted">{{ busy() ? 'Starting MCP servers...' : 'No servers found.' }}</p>
    }
  `,
})
export class McpPage implements OnInit {
  private http = inject(HttpClient);

  busy = signal(false);
  error = signal('');
  servers = signal<Srv[]>([]);
  args: Record<string, string> = {};
  results: Record<string, string> = {};

  pretty(v: unknown) {
    return JSON.stringify(v, null, 2);
  }

  async ngOnInit() {
    this.busy.set(true);
    try {
      const r = await firstValueFrom(this.http.get<{ servers: Srv[] }>('/api/mcp/servers'));
      for (const s of r.servers) for (const t of s.tools) this.args[t.name] ??= '{}';
      this.servers.set(r.servers);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }

  async call(server: string, tool: string) {
    this.busy.set(true);
    this.error.set('');
    try {
      const parsed = JSON.parse(this.args[tool] || '{}');
      const r = await firstValueFrom(this.http.post<{ result: unknown }>('/api/mcp/call', { server, tool, args: parsed }));
      this.results[tool] = JSON.stringify(r.result, null, 2);
    } catch (e) {
      this.error.set(e instanceof SyntaxError ? 'The arguments are not valid JSON.' : errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
