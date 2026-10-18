import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NaiveBayes, ruleVerdict, startExamples, type Example } from '../lib/spam';

@Component({
  selector: 'app-spam',
  imports: [FormsModule],
  template: `
    <h1>Rules or learning?</h1>
    <p class="hint">Paste a job message. One checker uses rules a person wrote. The other learned from the examples below. Add your own examples and watch the learner change.</p>

    <div class="card">
      <label for="m">Message</label>
      <textarea id="m" [ngModel]="message()" (ngModelChange)="message.set($event)" style="min-height:90px"></textarea>
      <div class="grid2">
        <div>
          <h2>Rule-based</h2>
          <p [class]="rules().spam ? 'bad' : 'ok'"><strong>{{ rules().spam ? 'Looks like a scam' : 'No rule fired' }}</strong></p>
          @for (h of rules().hits; track h) { <p class="muted">Rule: {{ h }}</p> }
        </div>
        <div>
          <h2>Learned from examples</h2>
          <p [class]="learned().spam ? 'bad' : 'ok'"><strong>{{ learned().spam ? 'Looks like a scam' : 'Looks normal' }}</strong> ({{ percent() }}% scam)</p>
          @for (t of learned().top; track t.word) { <p class="muted">"{{ t.word }}" pushes towards {{ t.weight > 0 ? 'scam' : 'normal' }} ({{ t.weight.toFixed(1) }})</p> }
        </div>
      </div>
    </div>

    <div class="card">
      <h2>Training examples ({{ examples().length }})</h2>
      <label for="n">Add an example</label>
      <input id="n" [(ngModel)]="newText" placeholder="Type a message..." />
      <button (click)="add(true)" [disabled]="!newText.trim()">Add as scam</button>
      <button class="secondary" (click)="add(false)" [disabled]="!newText.trim()">Add as normal</button>
      <table>
        <tbody>
          @for (e of examples(); track $index) {
            <tr><td [class]="e.spam ? 'bad' : 'ok'">{{ e.spam ? 'scam' : 'normal' }}</td><td>{{ e.text }}</td><td><button class="danger" (click)="remove($index)">x</button></td></tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class SpamPage {
  message = signal('Hurry! Pay a registration fee today and earn 3000 per day from home');
  examples = signal<Example[]>([...startExamples]);
  newText = '';

  rules = computed(() => ruleVerdict(this.message()));
  model = computed(() => new NaiveBayes(this.examples()));
  learned = computed(() => this.model().classify(this.message()));
  percent = computed(() => Math.round(this.learned().probSpam * 100));

  add(spam: boolean) {
    this.examples.update((list) => [{ text: this.newText.trim(), spam }, ...list]);
    this.newText = '';
  }

  remove(i: number) {
    this.examples.update((list) => list.filter((_, j) => j !== i));
  }
}
