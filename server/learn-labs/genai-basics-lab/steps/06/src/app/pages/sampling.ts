import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TOY, estimateTokens, filterProbs, probabilities, sampleMany } from '../lib/sampling';

@Component({
  selector: 'app-sampling',
  imports: [FormsModule],
  template: `
    <h1>How a model picks the next word</h1>
    <p class="hint">Text so far: <strong>"I am applying for the"</strong>. The model scores every possible next token. Temperature, top-k and top-p decide how it chooses among them. (The scores are invented to show the mechanics.)</p>

    <div class="card">
      <div class="grid2">
        <div><label for="t">Temperature: {{ temperature() }}</label><input id="t" type="range" min="0.1" max="2" step="0.1" [ngModel]="temperature()" (ngModelChange)="temperature.set(+$event)" /></div>
        <div><label for="k">Top-k: {{ topK() }}</label><input id="k" type="range" min="1" max="7" step="1" [ngModel]="topK()" (ngModelChange)="topK.set(+$event)" /></div>
      </div>
      <label for="p">Top-p: {{ topP() }}</label><input id="p" type="range" min="0.1" max="1" step="0.05" [ngModel]="topP()" (ngModelChange)="topP.set(+$event)" />
      <table>
        <thead><tr><th>Next token</th><th>Probability</th><th>Chosen in 1000 tries</th></tr></thead>
        <tbody>
          @for (c of cands; track c.token) {
            <tr>
              <td>"{{ c.token }}"</td>
              <td><div class="bar"><span [style.width.%]="final()[$index]! * 100"></span></div>{{ (final()[$index]! * 100).toFixed(1) }}%</td>
              <td>{{ counts()[$index] }}</td>
            </tr>
          }
        </tbody>
      </table>
      <p class="muted">Low temperature (near 0.1) always picks the favourite: safe and repeatable. High temperature spreads the choice and lets odd words in. Top-k and top-p cut off the unlikely tail so nonsense like "banana" cannot appear.</p>
    </div>

    <div class="card">
      <h2>Tokens and the context window</h2>
      <label for="x">Paste some text</label>
      <textarea id="x" [ngModel]="text()" (ngModelChange)="text.set($event)" style="min-height:90px"></textarea>
      <label for="w">Context window size (tokens): {{ windowSize() }}</label>
      <input id="w" type="range" min="1000" max="200000" step="1000" [ngModel]="windowSize()" (ngModelChange)="windowSize.set(+$event)" />
      <p>About <strong>{{ tokens().byWords }}</strong> tokens (by words) or <strong>{{ tokens().byChars }}</strong> (by characters). These are rough guesses; each model has its own tokenizer.</p>
      <div class="bar"><span [style.width.%]="used()"></span></div>
      <p class="muted">{{ used().toFixed(2) }}% of the context window. The prompt, the conversation history and the model's own answer all share this space.</p>
    </div>
  `,
  styles: [`.bar { height:8px; background:#e2e8f0; border-radius:99px; margin:2px 0 4px; } .bar span { display:block; height:100%; background:#4f46e5; border-radius:99px; max-width:100%; }`],
})
export class SamplingPage {
  cands = TOY;
  temperature = signal(1);
  topK = signal(7);
  topP = signal(1);
  text = signal('We are looking for a customer support executive who can answer calls and solve billing problems in Zendesk.');
  windowSize = signal(8000);

  base = computed(() => probabilities(this.cands, this.temperature()));
  final = computed(() => filterProbs(this.base(), this.topK(), this.topP()));
  counts = computed(() => sampleMany(this.final(), 1000, 11));
  tokens = computed(() => estimateTokens(this.text()));
  used = computed(() => Math.min(100, (this.tokens().byWords / this.windowSize()) * 100));
}
