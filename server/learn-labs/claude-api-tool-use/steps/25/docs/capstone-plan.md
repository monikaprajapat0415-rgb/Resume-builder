# My AI project plan

Copy this file, fill in every line, and keep it with your code.

## 1. The problem
Who has the problem? What do they do today? What would "better" look like in one sentence?

## 2. The data
What documents or records will the AI use? Who owns them? Do they contain personal data? How will I keep them up to date?

## 3. The design (tick what you need)
- [ ] Plain prompt (no extra data)
- [ ] Structured output (JSON with validation)
- [ ] RAG over my documents
- [ ] Tools or MCP (list them and mark each read / write / destructive)
- [ ] An agent loop (list the limits: steps, tokens, time)

## 4. Safety
- Which tool needs human approval?
- Which text is untrusted, and how is it marked?
- Which personal data is removed before it leaves my server?
- What does the app say when the AI is wrong or unavailable?

## 5. Evaluation
List 10 test questions with the answer or source you expect. Say how you will run them after every change.

## 6. Cost and operations
Estimated calls per day, tokens per call, price per call, monthly cost. Cache, rate limit, timeout, fallback, metrics.

## 7. First milestone
What can I show a real user within two weeks?
