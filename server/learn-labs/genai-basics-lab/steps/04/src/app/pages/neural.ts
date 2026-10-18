import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { XOR, createNet, predict, train, type Net } from '../lib/nn';

@Component({
  selector: 'app-neural',
  imports: [FormsModule],
  template: `
    <h1>A neural network in your browser</h1>
    <p class="hint">XOR means "one or the other, but not both". A single layer of units cannot learn it. Add a hidden layer and it can. Train and see.</p>

    <div class="card">
      <div class="grid2">
        <div><label for="h">Hidden units: {{ hidden() }}</label><input id="h" type="range" min="0" max="8" step="1" [ngModel]="hidden()" (ngModelChange)="hidden.set(+$event)" /></div>
        <div><label for="e">Training rounds: {{ epochs() }}</label><input id="e" type="range" min="500" max="10000" step="500" [ngModel]="epochs()" (ngModelChange)="epochs.set(+$event)" /></div>
      </div>
      <button (click)="run()" [disabled]="busy()">{{ busy() ? 'Training...' : 'Train from scratch' }}</button>
    </div>

    @if (result(); as r) {
      <div class="card">
        <h2>Results with {{ r.hidden }} hidden unit(s)</h2>
        <p>Final error: <strong [class]="r.loss < 0.02 ? 'ok' : 'bad'">{{ r.loss.toFixed(4) }}</strong> {{ r.loss < 0.02 ? '(learned it)' : '(did not learn it)' }}</p>
        <table>
          <thead><tr><th>Input</th><th>Should be</th><th>Network says</th></tr></thead>
          <tbody>
            @for (row of r.rows; track $index) {
              <tr><td>{{ row.input }}</td><td>{{ row.target }}</td><td [class]="row.ok ? 'ok' : 'bad'">{{ row.out.toFixed(2) }}</td></tr>
            }
          </tbody>
        </table>
        <p class="muted">Error over time (each bar is one checkpoint, taller means more wrong):</p>
        <div class="spark">@for (v of r.history; track $index) { <span [style.height.px]="Math.max(2, v * 160)"></span> }</div>
      </div>
    }
  `,
  styles: [`.spark { display:flex; align-items:flex-end; gap:2px; height:80px; } .spark span { flex:1; background:#4f46e5; border-radius:2px 2px 0 0; }`],
})
export class NeuralPage {
  Math = Math;
  hidden = signal(4);
  epochs = signal(4000);
  busy = signal(false);
  result = signal<{ hidden: number; loss: number; history: number[]; rows: { input: string; target: number; out: number; ok: boolean }[] } | null>(null);

  run() {
    this.busy.set(true);
    // setTimeout lets the button update before the browser is busy with training
    setTimeout(() => {
      const net: Net = createNet(this.hidden(), 3);
      const history = train(net, XOR, this.epochs(), 0.8);
      const rows = XOR.map((s) => {
        const out = predict(net, s.input);
        return { input: s.input.join(', '), target: s.target, out, ok: Math.round(out) === s.target };
      });
      this.result.set({ hidden: this.hidden(), loss: history.at(-1) ?? 1, history, rows });
      this.busy.set(false);
    }, 20);
  }
}
