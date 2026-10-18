import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { mockModel, runChain, type Step } from '../lib/chain';

@Component({
  selector: 'app-chain',
  imports: [FormsModule],
  template: `
    <h1>Prompt chains</h1>
    <p class="hint">Each step has its own small prompt. The output of one step flows into the next as {{ '{{prev}}' }}. The "model" here is a tiny offline fake so you can study how the chain works; swap in a real model call later.</p>

    <div class="card">
      <label for="i">Input text</label>
      <textarea id="i" [ngModel]="input()" (ngModelChange)="input.set($event)" style="min-height:80px"></textarea>
    </div>

    @for (s of steps(); track $index) {
      <div class="card">
        <label [attr.for]="'s' + $index">Step {{ $index + 1 }}: name</label>
        <input [id]="'s' + $index" [ngModel]="s.name" (ngModelChange)="update($index, 'name', $event)" />
        <label [attr.for]="'t' + $index">Prompt template</label>
        <textarea [id]="'t' + $index" [ngModel]="s.template" (ngModelChange)="update($index, 'template', $event)" style="min-height:70px"></textarea>
        <button class="danger" (click)="remove($index)">Remove step</button>
        @if (results()[$index]; as r) {
          <p class="muted">Prompt sent:</p><pre class="out">{{ r.prompt }}</pre>
          <p><strong>Output:</strong> {{ r.output }}</p>
        }
      </div>
    }
    <button class="secondary" (click)="add()">+ add step</button>
  `,
})
export class ChainPage {
  input = signal('Responsible for stock and loading at the warehouse. Used a forklift every day and trained new staff in safety training. The team handled 300 orders a day.');
  steps = signal<Step[]>([
    { name: 'skills', template: 'TASK: extract_skills\n{{input}}' },
    { name: 'summary', template: 'TASK: summarise\n{{input}}' },
    { name: 'check', template: 'TASK: critique\n{{summary}}' },
  ]);

  results = computed(() => runChain(this.steps(), this.input(), mockModel));

  update(i: number, key: keyof Step, value: string) {
    this.steps.update((list) => list.map((s, j) => (j === i ? { ...s, [key]: value } : s)));
  }

  add() {
    this.steps.update((list) => [...list, { name: `step${list.length + 1}`, template: 'TASK: rewrite\n{{prev}}' }]);
  }

  remove(i: number) {
    this.steps.update((list) => list.filter((_, j) => j !== i));
  }
}
