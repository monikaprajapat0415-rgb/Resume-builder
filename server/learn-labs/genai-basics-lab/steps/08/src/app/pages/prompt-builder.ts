import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { buildPrompt, lint, type PromptParts } from '../lib/prompt';
import { estimateTokens } from '../lib/sampling';

@Component({
  selector: 'app-prompt-builder',
  imports: [FormsModule],
  template: `
    <h1>Build a clear prompt</h1>
    <p class="hint">Fill in the parts. The prompt on the right is assembled for you, and a checker points out common gaps. Copy the result into any AI chat to try it.</p>

    <div class="grid2">
      <div class="card">
        <label for="r">Role</label><input id="r" [ngModel]="parts().role" (ngModelChange)="set('role', $event)" />
        <label for="t">Task</label><textarea id="t" [ngModel]="parts().task" (ngModelChange)="set('task', $event)" style="min-height:70px"></textarea>
        <label for="c">Context (paste the material to work on)</label><textarea id="c" [ngModel]="parts().context" (ngModelChange)="set('context', $event)" style="min-height:90px"></textarea>
        <label for="ru">Rules (one per line)</label><textarea id="ru" [ngModel]="rulesText()" (ngModelChange)="rulesText.set($event)" style="min-height:70px"></textarea>
        <label for="f">Output format</label><input id="f" [ngModel]="parts().format" (ngModelChange)="set('format', $event)" />
        <h2>Examples</h2>
        @for (e of parts().examples; track $index) {
          <input [ngModel]="e.input" (ngModelChange)="setExample($index, 'input', $event)" placeholder="Example input" />
          <input [ngModel]="e.output" (ngModelChange)="setExample($index, 'output', $event)" placeholder="Example output" />
        }
        <button class="secondary" (click)="addExample()">+ example</button>
      </div>

      <div class="card">
        <h2>Your prompt (about {{ tokens() }} tokens)</h2>
        <pre class="out">{{ prompt() }}</pre>
        <button (click)="copy()">{{ copied() ? 'Copied' : 'Copy prompt' }}</button>
        <h2>Checker</h2>
        @for (w of warnings(); track w.text) { <p [class]="w.level === 'problem' ? 'bad' : 'muted'">{{ w.level === 'problem' ? 'Problem' : 'Tip' }}: {{ w.text }}</p> } @empty { <p class="ok">No gaps found. Now test it with real examples.</p> }
      </div>
    </div>
  `,
})
export class PromptBuilderPage {
  parts = signal<PromptParts>({
    role: 'a careful career coach for factory and warehouse workers',
    task: 'Rewrite the resume bullet below so it starts with an action verb and shows a result.',
    context: 'Responsible for stock and loading at the warehouse',
    rules: [],
    examples: [{ input: 'Did customer calls', output: 'Handled 40 customer calls a day and solved 90% of issues on the first call' }],
    format: 'One bullet under 25 words. No extra text.',
  });
  rulesText = signal('Do not invent numbers.\nUse simple English.');
  copied = signal(false);

  full = computed<PromptParts>(() => ({ ...this.parts(), rules: this.rulesText().split('\n') }));
  prompt = computed(() => buildPrompt(this.full()));
  warnings = computed(() => lint(this.full()));
  tokens = computed(() => estimateTokens(this.prompt()).byChars);

  set<K extends keyof PromptParts>(key: K, value: PromptParts[K]) {
    this.parts.update((p) => ({ ...p, [key]: value }));
  }

  setExample(i: number, key: 'input' | 'output', value: string) {
    this.parts.update((p) => ({ ...p, examples: p.examples.map((e, j) => (j === i ? { ...e, [key]: value } : e)) }));
  }

  addExample() {
    this.parts.update((p) => ({ ...p, examples: [...p.examples, { input: '', output: '' }] }));
  }

  async copy() {
    try {
      await navigator.clipboard.writeText(this.prompt());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1500);
    } catch { /* clipboard can be blocked; the text is still on the screen */ }
  }
}
