import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { cosine, dot, gradientSteps, mean, norm, parseVector, softmax, stdDev } from '../lib/math';

@Component({
  selector: 'app-vectors',
  imports: [FormsModule],
  template: `
    <h1>The maths of AI, one number at a time</h1>
    <p class="hint">Change any box and every result updates. Try to predict the answer before you look.</p>

    <div class="card">
      <h2>Vectors and similarity</h2>
      <div class="grid2">
        <div><label for="a">Vector A</label><input id="a" [ngModel]="a()" (ngModelChange)="a.set($event)" /></div>
        <div><label for="b">Vector B</label><input id="b" [ngModel]="b()" (ngModelChange)="b.set($event)" /></div>
      </div>
      <table><tbody>
        <tr><td>Length of A</td><td>{{ norm(va()).toFixed(3) }}</td></tr>
        <tr><td>Dot product A . B</td><td>{{ dot(va(), vb()).toFixed(3) }}</td></tr>
        <tr><td>Cosine similarity</td><td><strong>{{ cosine(va(), vb()).toFixed(3) }}</strong></td></tr>
      </tbody></table>
      <p class="muted">Try A = 1, 2 and B = 2, 4 (same direction), then B = 2, -1 (right angle), then B = -1, -2 (opposite).</p>
    </div>

    <div class="card">
      <h2>Averages and spread</h2>
      <label for="n">Numbers (for example monthly salaries or response times)</label>
      <input id="n" [ngModel]="nums()" (ngModelChange)="nums.set($event)" />
      <table><tbody>
        <tr><td>Average</td><td>{{ mean(vn()).toFixed(2) }}</td></tr>
        <tr><td>Standard deviation (spread)</td><td>{{ stdDev(vn()).toFixed(2) }}</td></tr>
      </tbody></table>
    </div>

    <div class="card">
      <h2>Softmax: scores to probabilities</h2>
      <label for="s">Scores</label>
      <input id="s" [ngModel]="scores()" (ngModelChange)="scores.set($event)" />
      <table><tbody>
        @for (p of probs(); track $index) {
          <tr><td>Score {{ vs()[$index] }}</td><td>{{ (p * 100).toFixed(1) }}%</td></tr>
        }
      </tbody></table>
      <p class="muted">The probabilities always add up to 100%. Models use this to turn scores into a choice of the next word.</p>
    </div>

    <div class="card">
      <h2>Learning is walking downhill</h2>
      <div class="grid2">
        <div><label for="r">Step size: {{ rate() }}</label><input id="r" type="range" min="0.01" max="1.05" step="0.01" [ngModel]="rate()" (ngModelChange)="rate.set(+$event)" /></div>
        <div><label for="t">Target value: {{ target() }}</label><input id="t" type="range" min="-10" max="10" step="1" [ngModel]="target()" (ngModelChange)="target.set(+$event)" /></div>
      </div>
      <p>Start at 0, aim for {{ target() }}. After 8 steps: <strong>{{ path()[8].toFixed(3) }}</strong></p>
      <p class="muted">Path: {{ pathText() }}</p>
      <p class="muted">A tiny step crawls. A step of 0.5 lands on the target at once. A step above 1 overshoots more and more, and the number flies away.</p>
    </div>
  `,
})
export class VectorsPage {
  a = signal('1, 2, 3');
  b = signal('2, 4, 6');
  nums = signal('25000, 27000, 26000, 90000, 24000');
  scores = signal('2.0, 1.0, 0.1');
  rate = signal(0.3);
  target = signal(6);

  va = computed(() => parseVector(this.a()));
  vb = computed(() => parseVector(this.b()));
  vn = computed(() => parseVector(this.nums()));
  vs = computed(() => parseVector(this.scores()));
  probs = computed(() => softmax(this.vs()));
  path = computed(() => gradientSteps(0, this.target(), this.rate(), 8));
  pathText = computed(() => this.path().map((x) => x.toFixed(2)).join(' → '));

  dot = dot;
  norm = norm;
  cosine = cosine;
  mean = mean;
  stdDev = stdDev;
}
