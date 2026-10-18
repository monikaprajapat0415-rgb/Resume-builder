import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HARDWARE, PRECISIONS, maxTokensPerSecond, neededGB, savingVsFp16, weightsGB, type Precision } from '../lib/memory';

@Component({
  selector: 'app-memory',
  imports: [FormsModule],
  template: `
    <h1>Will this model fit, and how fast will it run?</h1>
    <p class="hint">Rough estimates for planning. Real speed depends on the software, the batch size and the hardware. The hardware numbers are examples, not product specifications.</p>

    <div class="card">
      <label for="p">Model size: {{ params() }} billion parameters</label>
      <input id="p" type="range" min="1" max="200" step="1" [ngModel]="params()" (ngModelChange)="params.set(+$event)" />
      <label for="pr">Precision</label>
      <select id="pr" [ngModel]="precision()" (ngModelChange)="precision.set($event)">
        @for (p of precisions; track p.id) { <option [value]="p.id">{{ p.label }}</option> }
      </select>
    </div>

    <div class="card">
      <h2>Weights: {{ weights().toFixed(1) }} GB &nbsp; <span class="muted">(about {{ need().toFixed(1) }} GB with working space)</span></h2>
      <p class="muted">Quantising to this precision saves {{ (saving() * 100).toFixed(0) }}% of the memory compared with 16-bit, and may cost a little quality.</p>
      <table>
        <thead><tr><th>Hardware</th><th>Memory</th><th>Fits?</th><th>Speed limit</th></tr></thead>
        <tbody>
          @for (h of rows(); track h.id) {
            <tr>
              <td>{{ h.label }}</td>
              <td>{{ h.memoryGB }} GB</td>
              <td [class]="h.fits ? 'ok' : 'bad'">{{ h.fits ? 'yes' : 'no' }}</td>
              <td>{{ h.fits ? '~' + h.tps.toFixed(0) + ' tokens/second' : '-' }}</td>
            </tr>
          }
        </tbody>
      </table>
      <p class="muted">The speed limit is memory bandwidth divided by the size of the weights, because each new token needs the chip to read the model once. A smaller (quantised) model is both smaller and faster.</p>
    </div>
  `,
})
export class MemoryPage {
  precisions = PRECISIONS;
  params = signal(7);
  precision = signal<Precision>('fp16');

  weights = computed(() => weightsGB(this.params(), this.precision()));
  need = computed(() => neededGB(this.params(), this.precision()));
  saving = computed(() => savingVsFp16(this.precision()));
  rows = computed(() =>
    HARDWARE.map((h) => ({ ...h, fits: this.need() <= h.memoryGB, tps: maxTokensPerSecond(this.params(), this.precision(), h.bandwidthGBs) })),
  );
}
