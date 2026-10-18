import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Found = { type: string; count: number }[];

@Component({
  selector: 'app-privacy',
  imports: [FormsModule],
  template: `
    <h1>Privacy: redact before you send</h1>
    <p class="hint">Personal data is replaced with placeholders on the server before any text reaches the AI. Preview is free and makes no AI call.</p>

    <div class="card">
      <label for="t">Resume text</label>
      <textarea id="t" [(ngModel)]="text" style="min-height:190px"></textarea>
      <button (click)="preview()" [disabled]="busy() || !text.trim()">Preview what would be sent</button>
      <button class="secondary" (click)="summarise()" [disabled]="busy() || !text.trim()">Summarise with Claude</button>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (sent()) {
      <div class="card">
        <h2>What the model sees</h2>
        <pre class="out">{{ sent() }}</pre>
        <div class="chips">@for (f of found(); track f.type) { <span>{{ f.type }} x{{ f.count }}</span> } @empty { <p class="muted">Nothing sensitive found.</p> }</div>
      </div>
    }
    @if (summary()) {
      <div class="card"><h2>Summary (real values restored for you)</h2><div class="answer">{{ summary() }}</div></div>
    }
  `,
})
export class PrivacyPage {
  private http = inject(HttpClient);

  text = `Asha Verma, Accounts Assistant\nEmail: asha.verma@example.com  Phone: +91 98765 43210\nPAN: ABCDE1234F  Aadhaar: 2345 6789 0123\n\nThree years of invoice entry in Tally for ABC Traders. Reduced payment delays by 20%.`;
  busy = signal(false);
  error = signal('');
  sent = signal('');
  summary = signal('');
  found = signal<Found>([]);

  async preview() {
    this.busy.set(true);
    this.error.set('');
    this.summary.set('');
    try {
      const r = await firstValueFrom(this.http.post<{ redacted: string; found: Found }>('/api/privacy/preview', { text: this.text }));
      this.sent.set(r.redacted);
      this.found.set(r.found);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }

  async summarise() {
    this.busy.set(true);
    this.error.set('');
    try {
      const r = await firstValueFrom(this.http.post<{ summary: string; sentToModel: string; found: Found }>('/api/privacy/summarise', { text: this.text }));
      this.summary.set(r.summary);
      this.sent.set(r.sentToModel);
      this.found.set(r.found);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
