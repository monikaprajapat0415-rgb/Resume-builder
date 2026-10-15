# AI fallback setup

When the main AI model is busy, rate-limited, down or times out, the server automatically tries the next one.
Used by: CV builder, ATS checker, resume import, cover letters, and the "enhance with AI" buttons.

Order tried: **primary** (your current GEMINI_API_KEY / OPENAI_* settings) -> extra Gemini models -> your other providers.
A provider that just failed is skipped for a short cool-down (30 s - 30 min depending on the error) so users do not wait on it.

## Add fallbacks in `server/.env` on the VPS (all optional)

### 1. Other Gemini models on the same key (easiest, no new account)
```
GENAI_FALLBACK_MODELS=gemini-2.5-flash-lite,gemini-2.0-flash
```
Use model names that exist for your key (check Google AI Studio).

### 2. Other services (any OpenAI-compatible API), numbered 1 to 8
```
AI_FALLBACK_1_NAME=groq
AI_FALLBACK_1_BASE_URL=https://api.groq.com/openai/v1
AI_FALLBACK_1_KEY=your-groq-key
AI_FALLBACK_1_MODEL=llama-3.3-70b-versatile

AI_FALLBACK_2_NAME=openrouter
AI_FALLBACK_2_BASE_URL=https://openrouter.ai/api/v1
AI_FALLBACK_2_KEY=your-openrouter-key
AI_FALLBACK_2_MODEL=<a model id from openrouter.ai/models>
```
Other compatible services: Cerebras, DeepSeek, Mistral, OpenAI, Together. Check each provider's current free limits and model names on their site.
All three of BASE_URL, KEY and MODEL are required for an entry to be used.

### Optional tuning
```
AI_TIMEOUT_MS=25000   # per provider attempt
AI_TOTAL_MS=55000     # give up after this long in total (nginx default timeout is 60 s)
```

## Fix first
- `OPENAI_BASE_URL` / `GENAI_BASE_URL` must start with `https://` (the log showed `https//...`, which is ignored).
- If the log shows "API key not valid", replace GEMINI_API_KEY. The router will skip a bad key, but you want it working.

## Check it works
After `pm2 restart project-backend --update-env`:
- `pm2 logs project-backend | grep "\[ai\]"` shows `providers in fallback order: ...`.
- Admin only: `GET /api/admin/ai-status` shows each provider's state and failures.
  `POST /api/admin/ai-status/test` pings every provider so you can confirm each key/model works.
- Log line `served by X after N failure(s)` means a fallback saved a request.
