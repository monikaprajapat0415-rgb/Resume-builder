import { P, H, L, O, N, C, F, lesson } from './helpers.js';

const LAB = 'claude-api-tool-use';
const S1 = 'Retrieval-Augmented Generation (RAG)';

const BUILD = N("The solution zip contains the whole AI Lab up to this lesson. Unzip it, run npm install, copy .env.example to .env, add your Anthropic API key, then run npm run server and npm start in two terminals. Tools and services in this area change quickly, so check current documentation, licences and prices before you choose one.");

export const lessons = [
  // ------------------------------------------------------------------ 15
  lesson(S1, 'vector-databases-explained', 'Vector Databases: pgvector, Qdrant, Pinecone and Chroma', 'Learn what a vector database really does, how approximate search works, how to choose between the main options, and build a vector store with upsert, delete and filters behind a clean interface.', '', [
    P("In the last lesson you built a search that compares a question vector with every chunk vector. For six small documents that is instant. Now imagine your help center grows to 200,000 chunks. Comparing the question with every single chunk on every request would be slow and wasteful. A **vector database** exists to solve exactly that problem, along with a few others that every real product soon meets: saving data safely, updating one document without rebuilding everything, filtering by user or date, and deleting data when someone asks."),
    P("In this lesson you will learn what a vector database does, how the fast search works in simple words, how to choose between pgvector, Qdrant, Pinecone and Chroma, and then you will build a small vector store of your own with a clean interface. Building it yourself first makes every real database easier to understand."),

    H("The four jobs of a vector store"),
    P("Strip away the marketing and a vector store has four jobs:"),
    O("**Upsert.** Save a chunk with its vector and metadata. “Upsert” means insert it if it is new, or update it if the same id already exists.", "**Query.** Given a vector, return the nearest vectors (the top k), optionally only those that match a filter.", "**Delete.** Remove chunks by id or by filter. This matters for privacy: when a user deletes a file, its vectors must go too.", "**Persist.** Keep everything safe when the server restarts."),
    P("If you can do these four things, you have a vector store. Everything else, such as speed at huge scale, replication and dashboards, is extra."),

    H("Exact search versus approximate search"),
    P("The search in lesson 14 is **exact**: it checks every vector and returns the true best matches. This is perfect and simple, and for up to roughly tens of thousands of chunks it is often fast enough."),
    P("At millions of vectors, checking everything is too slow. Databases use **approximate nearest neighbour** (ANN) search. They build an index that lets them skip most vectors and still find nearly the best ones. The trade-off is small: you may miss a true top result once in a while, in exchange for a search that is hundreds of times faster. The share of true best results that you actually find is called **recall**."),
    P("The index you will hear about most is **HNSW**, which stands for Hierarchical Navigable Small World. A simple way to picture it: think of a country map with motorways, main roads and small streets. To reach a house, you first take the motorway to the right region, then main roads to the right town, then small streets to the right door. HNSW builds layers like that. The top layer has a few points with long links, and each lower layer has more points and shorter links. A search starts at the top, jumps close to the target, and refines on the lower layers. Another common index is **IVF**, which groups vectors into clusters and only searches the clusters closest to the question."),
    P("You do not build these yourself. You switch them on and tune a few settings. What you must remember is the trade-off: more accuracy costs more time and memory."),

    H("Metadata filters"),
    P("A vector alone is not enough. In a real app you often need to say “only search this user's files” or “only documents from 2025”. That is a **metadata filter**. In your lab each chunk has a source field, and you can search only one source file."),
    P("Filters are also a **security tool**. If you run one shared store for many users, every query must carry the user id as a filter, applied on the server, never decided by the browser. Forgetting this is how one user's private data ends up in another user's answer."),

    H("The main options in plain words"),
    L("**pgvector (PostgreSQL).** An extension that adds vector columns and indexes to PostgreSQL. Best when you already use Postgres: your vectors live next to your normal data, you use normal SQL, backups and transactions, and you can filter with ordinary WHERE clauses. It is a very good default for small and medium projects.", "**Qdrant.** A database made only for vectors, available as open source and as a hosted service. It has strong filtering and is fast. A good choice when vector search is the core of your product.", "**Pinecone.** A fully managed cloud service. You do not run any servers. It is quick to start and scales easily, but it is a paid service and your data lives with the provider.", "**Chroma.** An open-source database that is very easy to start with and runs inside your Python or Node program. Excellent for learning and prototypes. For large production systems, check its current deployment options."),
    P("How to choose: if you already have Postgres and fewer than a few million chunks, start with pgvector. If you want no servers to manage, look at a managed service. If you need a dedicated, heavily filtered vector engine, look at Qdrant or similar. If you are only experimenting, use something small like Chroma or the in-memory store from this lesson. Features, limits and prices change, so read the current documentation before you decide."),

    H("Design for change: put the database behind an interface"),
    P("Here is the most useful engineering lesson of this chapter. Today you might choose pgvector. In a year you might move to something else. If your route code calls the database directly in twenty places, moving is painful. So hide the database behind a tiny interface with a few methods. In your lab, the interface is a class with `upsert`, `remove`, `query`, `count` and `list`."),
    P("Here is the whole store. `MemoryStore` keeps vectors in a Map. `FileStore` extends it and saves to a JSON file after every change, so data survives a restart:"),
    F(LAB, 'steps/15/server/rag/store.js'),
    P("Read the last function, `getStore`. When the server starts, it reloads your saved items, then re-chunks and re-embeds the documents in the docs folder, replacing the old copies. This means that when you edit a document and restart the server, the index is updated, while notes that you added yourself are kept. A very common bug in RAG projects is an index that is out of date with the documents. Think about how your own project will keep them in sync."),

    H("The same four jobs in SQL"),
    P("The lab also includes a file, pgvector.sql, that shows how the same four jobs look in PostgreSQL. You can read it as a map for your first migration. Notice three things. The vector column has a fixed size, and it must equal the size of your embedding. The `<=>` operator returns cosine distance, so similarity is `1 - distance`. And the filter is a normal WHERE clause."),
    F(LAB, 'steps/15/server/rag/pgvector.sql'),
    P("Because your routes only call `store.upsert`, `store.query` and so on, switching to pgvector later means writing one new class that runs these SQL statements. The routes, the pages and the lessons do not change."),

    H("Things that surprise people in production"),
    L("**The embedding size is fixed.** If you switch embedding model, the vector size may change and you must re-embed and rebuild the index.", "**Deleting must really delete.** If a user asks you to remove their data, remove the vectors and the original text, and check any backups and logs.", "**Back it up.** A vector index is data. It needs backups like any other database.", "**Test with your own data.** A benchmark on someone else's data does not tell you what happens on yours."),
    BUILD,

    H("Your task: build a vector store with a clean interface"),
    P("Build a store that you can add notes to, search with a filter, and delete from. Then add a page in the AI Lab to use it."),
    P("**What you will build**"),
    L("server/rag/store.js with a MemoryStore class and a FileStore class that saves to server/runtime/vectors.json.", "A getStore function that shares one store and syncs the documents folder when the server starts.", "Routes: GET /api/store, POST /api/store/query, POST /api/store/upsert and DELETE /api/store/:id.", "An Angular Store page where you add a note, search with an optional source filter, and delete a result."),
    P("**Steps**"),
    O("Write MemoryStore with a Map. Each item has id, source, title, text and vector. Write upsert, remove, count, list and query. In query, apply the source filter first, then score the rest with cosine similarity, sort and keep the top k.", "Write FileStore. It loads the file in the constructor if it exists, and calls save() after every upsert or remove.", "Write getStore. Create a single FileStore. Chunk and embed every document, delete old items that come from the same documents, add the fresh ones, and save.", "Write the four routes. Validate the input: the text must have at least 10 characters, limit its length, and return 404 when you delete an id that does not exist.", "Build the Store page. Show the number of items, a text area to add a note, a search box, a select with the sources and a Delete button next to each result.", "Test it. Add a note, search for it with the filter set to my-notes.md, delete it, restart the server and check that your notes are still there."),
    P("**Hints**"),
    L("Never send the vectors to the browser. Strip them out before you return items. They are large and useless to the page.", "Use a Map keyed by id, so an upsert with the same id replaces the old item.", "Add server/runtime/ to .gitignore. It holds generated data."),
    P("**You know it works when** your notes are found with the source filter, deleted notes never come back, and after a restart the notes you added are still there while the documents are refreshed from the folder."),

    H("Solution"),
    P("You have already read store.js and the SQL file above. Here are the routes and the Angular page."),
    F(LAB, 'steps/15/server/routes/store.js'),
    F(LAB, 'steps/15/src/app/pages/store.ts'),
    N("Look at the upsert route: it limits the text to 4,000 characters and refuses very short text. Every input from a browser needs limits like these."),

    H("What you learned"),
    L("A vector store has four jobs: upsert, query, delete and persist.", "Approximate search (such as HNSW) trades a tiny loss in recall for a very large gain in speed.", "Metadata filters are essential, and for multi-user apps they are also a security tool.", "pgvector, Qdrant, Pinecone and Chroma all do these jobs. Hide the choice behind an interface so you can change it later."),
    P("In the next lesson you will make retrieval much better by combining keyword and vector search, reranking the results and making the model cite its sources."),
  ], [
    { q: 'Do I need a vector database for a small project?', a: 'Not always. For up to tens of thousands of chunks, a simple in-memory or file-based store with exact search is usually fast enough. Move to a database when you need scale, persistence across servers or filtering.' },
    { q: 'Which vector database is the best?', a: 'There is no single best one. If you already use PostgreSQL, pgvector is a very good default. If you want zero servers, look at a managed service. Test with your own data and check current prices and limits.' },
    { q: 'What does HNSW mean?', a: 'It stands for Hierarchical Navigable Small World. It is an index that lets a database skip most vectors and still find nearly the best matches, much like using motorways, then main roads, then small streets.' },
    { q: 'How do I keep one user from seeing another user\'s data?', a: 'Store a user id with every chunk and apply it as a filter on the server for every query. Never let the browser choose the filter.' },
  ], 'vector database, pgvector tutorial, qdrant vs pinecone, hnsw explained, vector store node.js'),

  // ------------------------------------------------------------------ 16
  lesson(S1, 'advanced-rag-and-evaluation', 'Advanced RAG: Hybrid Search, Reranking and Citations', 'Combine keyword and vector search, fuse the rankings, rerank the best results, drop weak matches and make the model cite sources that the server checks.', '', [
    P("A basic RAG system works well on easy questions and fails on the rest. Sometimes the user asks with different words than your document, and vector search saves you. Sometimes the user searches for an exact name, code or number, like “Form 16” or “Zendesk”, and keyword search saves you. Neither method wins every time. The best systems use both, check the best results again, and make the final answer prove where it came from."),
    P("In this lesson you will build four upgrades: **hybrid search**, a **similarity threshold**, a simple **reranking** step, and **checked citations**. Then you will compare keyword, vector and hybrid results side by side on one page, so you can see the differences with your own eyes."),

    H("Why one search method is not enough"),
    L("**Keyword search** is excellent at exact words: names, product codes, error messages, rare terms. It cannot match a different word with the same meaning.", "**Vector search** is excellent at meaning: with a good embedding model it can find “how many pages” when the question says “how long”. It can be weak on exact rare terms and numbers, and it always returns something, even when nothing is related.", "**Hybrid search** runs both and merges the lists. It is more robust than either alone, which is why it is the default in many production systems."),

    H("BM25: keyword search done properly"),
    P("In lesson 13 we scored chunks with a simple shared-word score. Search engines use a better formula called **BM25**. It keeps the useful idea (rare words count more) and fixes two problems:"),
    L("**Repetition has a ceiling.** If a chunk says “resume” fifty times, it is not fifty times better than a chunk that says it twice. BM25 lets extra repeats help less and less.", "**Length is balanced.** A very long chunk has more chances to contain the words by accident. BM25 reduces its score a little so short, focused chunks are not unfairly beaten."),
    P("There are two settings, called k1 and b. The defaults (1.5 and 0.75) work well in most cases, so you rarely change them. Here is the code:"),
    F(LAB, 'steps/16/server/rag/bm25.js'),

    H("Merging two rankings: Reciprocal Rank Fusion"),
    P("BM25 gives scores like 4.7. Cosine similarity gives scores like 0.31. These numbers live on different scales, so you cannot just add them. A simple, strong solution is **Reciprocal Rank Fusion** (RRF). It ignores the scores and only uses the **position** in each list. An item that is first in a list gets `1 / (60 + 1)`, the second gets `1 / (60 + 2)`, and so on. You add up what each item earns across all the lists. An item that is high in both lists gets the largest total."),
    P("Think of two judges ranking singers. You do not add their raw marks, because one judge is harsh and the other is generous. You add up each singer's rank from each judge. The singer who is near the top for both wins. The number 60 is a common constant that stops first place from being too dominant."),

    H("The similarity threshold: knowing when nothing is relevant"),
    P("Vector search has a quiet danger. It always returns the nearest chunks, even when none of them is near. If a user asks “What is the capital of Australia?”, the search will still hand you three chunks about resumes, and the model may try to use them. The fix is a **minimum similarity**. Chunks below it are dropped, and if nothing remains, the bot says “I don't have that in my notes.” without calling the model."),
    P("In the lab the cutoff is 0.1. It was found by trying real and unrelated questions: unrelated queries scored around 0.05 to 0.07, while real matches scored 0.12 or more. Your number will be different with a different embedding model, so measure it on your own data. This is a classic example of why you need a test set (lesson 22)."),

    H("Reranking: a second, closer look"),
    P("Search methods are fast but rough. They compare a question with a chunk without reading them together. A **reranker** is a slower, smarter step that looks at the question and each candidate **together** and decides how well the chunk really answers the question. The usual pattern is: retrieve about 20 candidates cheaply, rerank them, and keep the best 3 to 5."),
    P("Production systems use a trained reranker model, often called a cross-encoder, from a provider or an open model. We do not want an account in this lab, so we use a very small stand-in: for each candidate, we count how many of the question's words it contains, and prefer the ones with the highest coverage. It shows you where the reranker sits in the pipeline, and you can swap it for a real model later."),
    F(LAB, 'steps/16/server/rag/hybrid.js'),

    H("Citations that the server checks"),
    P("An answer without sources is hard to trust. We ask the model to put a number like [1] after each sentence that uses source 1. This helps users, because they can check the source, and it helps you, because it makes the model show its work."),
    P("But a model can write [9] when there are only four sources. So the server **checks the citations**. It reads all the [n] marks in the answer, keeps only the numbers that exist, and reports the others as invalid. The Angular page shows a red warning for invalid citations and highlights the sources that were really cited."),
    P("This is a very good pattern, because it moves a check out of the model's “promise” and into your code, which can be tested. Remember it for the whole course: **do not trust, verify**."),
    F(LAB, 'steps/16/server/routes/rag-plus.js'),
    BUILD,

    H("Your task: build the RAG+ page"),
    P("Build a page where the same question can be answered with keyword, vector or hybrid retrieval, and where citations are checked."),
    P("**What you will build**"),
    L("server/rag/bm25.js with a BM25 search.", "server/rag/hybrid.js with rrf, rerank and retrieve, including the minimum similarity.", "A route POST /api/rag-plus that takes a question and a mode, calls Claude with numbered sources, and returns the answer, the valid citations and the invalid ones.", "An Angular page with a mode selector, the answer, and a source list that shows which sources were cited."),
    P("**Steps**"),
    O("Write bm25Search. Compute the average chunk length and how many chunks contain each word. Score each chunk with the BM25 formula and return the best ones that scored above zero.", "Write rrf. Take a list of ranked lists, add 1 / (60 + rank + 1) to each item for each list it appears in, and sort by the total.", "Write retrieve. Run BM25 and vector search. Drop vector results below 0.1. For keyword and vector modes return the list directly. For hybrid mode fuse them, rerank the top six and return four.", "Write the route. Number the sources in the prompt, write the system prompt that asks for [n] after each used sentence, and then check the citations with a regular expression.", "Build the page. Show the answer, show invalid citations in red, and list the sources with their score and a “cited” label.", "Compare modes. Ask the same three questions in each mode and write down which mode found the right document. Add one question with an exact rare word and one with different wording."),
    P("**Hints**"),
    L("To read the citations, use `answer.matchAll(/\\[(\\d+)\\]/g)` and remove duplicates with a Set.", "Do not call Claude when there are no sources.", "Add a way to force a bad citation while testing, so you can prove your check works. A test question that makes your fake or mock model write [9] is enough."),
    P("**You know it works when** keyword mode finds exact words, vector mode finds related words, hybrid mode is at least as good as the better of the two, an unrelated question gets “I don't have that in my notes.” without a model call, and an invented citation is flagged."),

    H("Solution"),
    P("The core files are above. This is the Angular page; the zip holds the whole project."),
    F(LAB, 'steps/16/src/app/pages/rag-plus.ts'),
    N("Check the citation code once more. The model's text is treated as untrusted input that must be verified, just like text from a user."),

    H("What you learned"),
    L("Hybrid search combines keyword strength (exact terms) and vector strength (meaning).", "Reciprocal Rank Fusion merges rankings by position, so you never compare scores from different systems.", "A similarity threshold lets the system say “nothing relevant found”.", "A reranker takes a closer look at a short list. Citations make answers checkable, and the server verifies them."),
    P("Retrieval is done. In the next lessons we move from answering questions to taking actions: AI agents."),
  ], [
    { q: 'What is hybrid search?', a: 'It runs keyword search and vector search at the same time and merges the results, so the system finds both exact terms and related meanings.' },
    { q: 'What is Reciprocal Rank Fusion?', a: 'A simple way to merge several ranked lists. Each item earns 1 divided by (60 plus its position) from each list, and the totals decide the final order. It uses positions, not scores.' },
    { q: 'Do I need a reranker?', a: 'Not at the start. Add one when you can show, with a test set, that the right chunk is often in your top 20 but not your top 4. Then a reranker is likely to help.' },
    { q: 'How do I stop a model from inventing sources?', a: 'Give sources numbers, ask for numbered citations and check them in code. Drop or flag any number that does not exist.' },
  ], 'hybrid search rag, bm25 tutorial, reciprocal rank fusion, rag reranking, rag citations'),
];
