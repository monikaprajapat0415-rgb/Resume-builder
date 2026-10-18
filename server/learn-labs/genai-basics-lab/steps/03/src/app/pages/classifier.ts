import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { evaluate, makeData, split } from '../lib/knn';

@Component({
  selector: 'app-classifier',
  imports: [FormsModule],
  template: `
    <h1>Train, test and overfit</h1>
    <p class="hint">A model learns to guess who gets shortlisted from years of experience and matching skills. Watch the gap between its score on data it has seen and data it has not.</p>

    <div class="card">
      <div class="grid2">
        <div><label for="k">Neighbours that vote (k): {{ k() }}</label><input id="k" type="range" min="1" max="31" step="2" [ngModel]="k()" (ngModelChange)="k.set(+$event)" /></div>
        <div><label for="t">Share kept for testing: {{ (testShare() * 100).toFixed(0) }}%</label><input id="t" type="range" min="0.1" max="0.5" step="0.05" [ngModel]="testShare()" (ngModelChange)="testShare.set(+$event)" /></div>
      </div>
      <div class="grid2">
        <div><label for="n">Noise in the data: {{ noise() }}</label><input id="n" type="range" min="0" max="0.6" step="0.05" [ngModel]="noise()" (ngModelChange)="noise.set(+$event)" /></div>
        <div><label for="s">Random seed: {{ seed() }}</label><input id="s" type="range" min="1" max="20" step="1" [ngModel]="seed()" (ngModelChange)="seed.set(+$event)" /></div>
      </div>
    </div>

    <div class="card">
      <h2>Results ({{ parts().train.length }} training, {{ parts().test.length }} test)</h2>
      <table><tbody>
        <tr><td>Accuracy on training data (seen)</td><td><strong>{{ pct(trainResult().accuracy) }}</strong></td></tr>
        <tr><td>Accuracy on test data (not seen)</td><td><strong>{{ pct(testResult().accuracy) }}</strong></td></tr>
        <tr><td>Gap</td><td [class]="gap() > 0.12 ? 'bad' : 'ok'">{{ pct(gap()) }} {{ gap() > 0.12 ? '(overfitting)' : '' }}</td></tr>
      </tbody></table>
      <h2>Confusion matrix (test data)</h2>
      <table><thead><tr><th></th><th>Predicted: shortlisted</th><th>Predicted: not</th></tr></thead><tbody>
        <tr><td>Really shortlisted</td><td>{{ testResult().matrix.tp }}</td><td>{{ testResult().matrix.fn }}</td></tr>
        <tr><td>Really not</td><td>{{ testResult().matrix.fp }}</td><td>{{ testResult().matrix.tn }}</td></tr>
      </tbody></table>
      <p class="muted">Precision {{ pct(testResult().precision) }}: when it says shortlisted, how often is it right. Recall {{ pct(testResult().recall) }}: of the people really shortlisted, how many it found.</p>
      <p class="muted">Try k = 1. It memorises the training data (100% on seen data) but does worse on new data. A larger k smooths out the noise.</p>
    </div>
  `,
})
export class ClassifierPage {
  k = signal(1);
  testShare = signal(0.3);
  noise = signal(0.25);
  seed = signal(7);

  data = computed(() => makeData(200, this.seed(), this.noise()));
  parts = computed(() => split(this.data(), this.testShare(), this.seed()));
  trainResult = computed(() => evaluate(this.parts().train, this.parts().train, this.k()));
  testResult = computed(() => evaluate(this.parts().train, this.parts().test, this.k()));
  gap = computed(() => Math.max(0, this.trainResult().accuracy - this.testResult().accuracy));

  pct = (x: number) => `${(x * 100).toFixed(1)}%`;
}
