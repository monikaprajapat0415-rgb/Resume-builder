import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MATCH_SCHEMA, checkAttempts } from '../lib/schema';

const SAMPLE = `Sure! Here is the result:
{"score": 140, "verdict": "great", "missing_skills": ["Zendesk"]}
---
\`\`\`json
{"score": 72, "verdict": "partial", "missing_skills": "Zendesk"}
\`\`\`
---
{"score": 72, "verdict": "partial", "missing_skills": ["Zendesk", "billing"]}`;

@Component({
  selector: 'app-json-check',
  imports: [FormsModule],
  template: `
    <h1>Check and repair a model's JSON</h1>
    <p class="hint">Paste model answers, separated by a line with three dashes. Each is parsed and checked against a schema. Failed attempts produce the repair message you would send back to the model.</p>

    <div class="card">
      <label for="a">Model answers (one per attempt)</label>
      <textarea id="a" [ngModel]="text()" (ngModelChange)="text.set($event)" style="min-height:190px"></textarea>
      <p class="muted">Schema: score (whole number 0 to 100), verdict (strong, partial or weak), missing_skills (list of up to 8 short texts).</p>
    </div>

    <div class="card">
      <h2 [class]="result().ok ? 'ok' : 'bad'">{{ result().ok ? 'Valid JSON after ' + result().attempts.length + ' attempt(s)' : 'No valid answer yet' }}</h2>
      @for (a of result().attempts; track $index) {
        <p><strong>Attempt {{ $index + 1 }}</strong> <span [class]="a.errors.length ? 'bad' : 'ok'">{{ a.errors.length ? 'rejected' : 'accepted' }}</span></p>
        @for (e of a.errors; track e) { <p class="muted">- {{ e }}</p> }
        @if (result().repairs[$index]) { <pre class="out">Repair message:\n{{ result().repairs[$index] }}</pre> }
      }
    </div>
  `,
})
export class JsonCheckPage {
  text = signal(SAMPLE);
  result = computed(() => checkAttempts(this.text().split(/^\s*---\s*$/m).map((s) => s.trim()).filter(Boolean), MATCH_SCHEMA));
}
