import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { buildChain, copiedShare, generate } from '../lib/markov';

const SAMPLE = `I am a hard working warehouse supervisor with five years of experience. I manage a team of twelve people and keep stock records accurate. I reduced picking errors by twenty percent in one year. I am skilled in inventory control and safety training. I am looking for a supervisor role where I can lead a team and improve daily operations. I am reliable and I work well under pressure. I enjoy training new staff and solving problems on the shop floor.`;

@Component({
  selector: 'app-markov',
  imports: [FormsModule],
  template: `
    <h1>The simplest text generator</h1>
    <p class="hint">This program only remembers the last one or two words. It writes new text that sounds a little like the source. It does not know what any word means.</p>

    <div class="card">
      <label for="t">Training text</label>
      <textarea id="t" [ngModel]="text()" (ngModelChange)="text.set($event)" style="min-height:140px"></textarea>
      <div class="grid2">
        <div><label for="o">Words remembered (order): {{ order() }}</label><input id="o" type="range" min="1" max="3" step="1" [ngModel]="order()" (ngModelChange)="order.set(+$event)" /></div>
        <div><label for="n">Length: {{ count() }} words</label><input id="n" type="range" min="10" max="80" step="5" [ngModel]="count()" (ngModelChange)="count.set(+$event)" /></div>
      </div>
      <button (click)="seed.set(seed() + 1)">Generate again</button>
    </div>

    <div class="card">
      <h2>Generated text</h2>
      <div class="answer">{{ output() }}</div>
      <p class="muted">{{ (copied() * 100).toFixed(0) }}% of it is copied word-for-word from the training text. The chain has {{ chain().next.size }} different "memories".</p>
      <p class="muted">Order 1 is creative but often nonsense. Order 3 is fluent but mostly copies the source. Real language models avoid this trade-off by learning patterns instead of storing exact word sequences.</p>
    </div>
  `,
})
export class MarkovPage {
  text = signal(SAMPLE);
  order = signal(1);
  count = signal(40);
  seed = signal(1);

  chain = computed(() => buildChain(this.text(), this.order()));
  output = computed(() => generate(this.chain(), this.count(), this.seed()));
  copied = computed(() => copiedShare(this.text(), this.output()));
}
