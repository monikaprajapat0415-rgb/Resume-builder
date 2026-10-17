import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { errorText } from '../util';

type Parsed = { name: string | null; skills: string[]; jobs: { title: string; company: string | null }[] };

@Component({
  selector: 'app-documents',
  template: `
    <h1>Read a resume file</h1>
    <p class="hint">Upload a PDF or a photo of a resume. Claude reads it and we show the details it found.</p>

    <div class="card">
      <label for="f">Resume file (PDF, PNG, JPG, WebP; up to 5 MB)</label>
      <input id="f" type="file" accept="application/pdf,image/png,image/jpeg,image/webp" (change)="pick($event)" />
      <button (click)="upload()" [disabled]="busy() || !file">{{ busy() ? 'Reading...' : 'Read file' }}</button>
      <p class="muted">Privacy: the file is sent to the AI service for reading. This lab does not store it. In your own product, tell users what you do with their files.</p>
      @if (error()) { <div class="err">{{ error() }}</div> }
    </div>

    @if (result(); as r) {
      <div class="card">
        <h2>{{ r.name || 'Name not found' }}</h2>
        <h2>Skills</h2>
        <div class="chips">@for (s of r.skills; track s) { <span>{{ s }}</span> } @empty { <span class="muted">None found</span> }</div>
        <h2>Jobs</h2>
        <ul>@for (j of r.jobs; track $index) { <li>{{ j.title }}@if (j.company) { at {{ j.company }} }</li> } @empty { <li class="muted">None found</li> }</ul>
      </div>
    }
  `,
})
export class DocumentsPage {
  private http = inject(HttpClient);

  file: File | null = null;
  busy = signal(false);
  error = signal('');
  result = signal<Parsed | null>(null);

  pick(event: Event) {
    this.file = (event.target as HTMLInputElement).files?.[0] ?? null;
  }

  async upload() {
    if (!this.file) return;
    const body = new FormData();
    body.append('file', this.file);
    this.busy.set(true);
    this.error.set('');
    this.result.set(null);
    try {
      const r = await firstValueFrom(this.http.post<{ data: Parsed }>('/api/read-document', body));
      this.result.set(r.data);
    } catch (e) {
      this.error.set(errorText(e));
    } finally {
      this.busy.set(false);
    }
  }
}
