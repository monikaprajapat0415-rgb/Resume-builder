import { P, H, L, O, N, C, F, lesson } from './helpers.js';

const LAB = 'claude-api-tool-use';
const S1 = 'Retrieval-Augmented Generation (RAG)';

const BUILD = N("This course builds on the Angular AI Lab from the Claude API course. You do not need to have finished that course: every solution zip below contains the whole lab up to this lesson. Unzip it, run npm install, copy .env.example to .env, add your Anthropic API key, then run npm run server and npm start in two terminals. Model names and prices change, so check docs.anthropic.com.");

export const lessons = [
  // ------------------------------------------------------------------ 13
  lesson(S1, 'what-is-rag', 'What Is RAG (Retrieval-Augmented Generation)?', 'Learn why models need your own data, how RAG works from question to answer, and build a help-center bot that answers only from your documents.', '', [
    P("Imagine you start a new job at a company that sells resume tools. On the first day, a customer calls and asks, “Can I use a Word file, or must I upload a PDF?” You do not know the answer from memory. But you are not stuck. You open the company help center, search for “file type”, read the right paragraph, and answer in your own words. You did not memorise the help center. You looked it up and then explained it."),
    P("That is exactly what **Retrieval-Augmented Generation**, or **RAG**, does for an AI model. The model is the person on the phone. Your documents are the help center. The “retrieval” part is the search. The “generation” part is the model writing a clear answer from what the search found."),
    P("In this lesson you will understand why RAG exists, learn the six steps of a RAG system, and build the first version in your AI Lab: a help-center bot that finds the right paragraphs in six small documents and answers only from them."),

    H("The problem: a model only knows what it was trained on"),
    P("A language model like Claude learned from a huge amount of text, but that learning stopped at a certain date. After that it does not know anything new. It also never saw your private files: your price list, your company rules, your customers' contracts, or the PDF a user uploaded five minutes ago."),
    P("If you ask a model about something it does not know, it may do something dangerous: it can write a confident, smooth, wrong answer. This is called a **hallucination**. The model is not lying on purpose. It is built to continue text in a believable way, and a believable answer is not always a true one."),
    P("There are three ways to give a model knowledge it does not have:"),
    L("**Put everything in the prompt.** This works for a short document. It fails when you have hundreds of pages, because the prompt has a size limit and you pay for every token every time.", "**Fine-tune the model.** You train it further on your examples. This is good for teaching a style or a format. It is a poor way to teach facts, it is slow and costly, and you cannot easily remove or update one fact later.", "**Retrieve and then ask (RAG).** For each question, find the few pieces of your data that matter and put only those in the prompt. This is cheap, easy to update, and it lets you show your sources."),
    P("For most business apps with changing knowledge, RAG is the first thing to try."),

    H("The six steps of RAG"),
    P("Every RAG system, from a weekend project to a large product, does these six jobs. Learn them by name, because the next lessons improve one step at a time."),
    O("**Ingest.** Load your documents: text, Markdown, PDF, Word, web pages. Clean them.", "**Chunk.** Cut each document into small pieces, called chunks, so that you can retrieve just the useful part.", "**Embed.** Turn each chunk into a list of numbers (a vector) that represents its meaning. We cover this in lesson 14.", "**Store.** Save the chunks and their vectors in a place that can search them quickly. Lesson 15 covers vector databases.", "**Retrieve.** When a question arrives, find the chunks that are most related to it.", "**Generate.** Build a prompt with the question and those chunks, and ask the model to answer using only that text."),
    P("Steps 1 to 4 happen before any user asks anything. Steps 5 and 6 happen on every question. In this first lesson we keep it very simple on purpose. We chunk by paragraph and retrieve by plain keywords, with no vectors at all. A simple version that works end to end teaches you more than a clever version you cannot see inside."),

    H("A worked example"),
    P("Suppose our help center has this paragraph in a file called resume-basics.md:"),
    N("Use one simple font such as Arial or Calibri at size 10 or 11. Save the file as a PDF unless the job post asks for Word."),
    P("A user asks: “Which file type should I upload?” The system searches, finds that paragraph (the words “file” and “PDF” and “Word” are close to the question), and builds this prompt for the model:"),
    C("text", "<context>\n<chunk id=\"1\" source=\"resume-basics.md\">\nUse one simple font such as Arial or Calibri at size 10 or 11.\nSave the file as a PDF unless the job post asks for Word.\n</chunk>\n</context>\n\nQuestion: Which file type should I upload?"),
    P("The model answers: “Upload a PDF, unless the job post asks for Word.” The answer is short, correct, and it came from your own text, not from the model's memory."),
    P("Notice the tags like `<context>` and `<chunk>`. They are not magic. They are a clear way to tell the model, “this part is data, that part is the question.” This habit becomes very important in the security lessons later in this course."),

    H("The most important sentence in a RAG prompt"),
    P("Retrieval gives the model the facts. But the model still needs rules about how to use them. Our system prompt says three things:"),
    L("Answer using ONLY the context provided.", "If the context does not contain the answer, say exactly: “I don't have that in my notes.”", "Keep the answer short and in plain English."),
    P("The second rule is the one that protects you. Without it, when the search finds nothing useful, the model quietly falls back on its own memory and may invent an answer. With it, the bot admits it does not know. An honest “I don't know” is much better than a confident mistake."),
    P("There is a second layer of protection in our code. If the search finds no chunk at all, we do not call the model. We return the “I don't have that in my notes.” message directly. This saves money and removes any chance of a made-up answer for that case."),

    H("How keyword retrieval works"),
    P("Our first retrieval method is simple. We break the question into words, throw away tiny common words like “the” and “is” (called stop words), and give each chunk a score. A chunk gets points for every question word that it also contains. A rare word gets more points than a common word. If the question says “Zendesk” and only one chunk contains it, that chunk should win. If the question says “resume” and every chunk contains it, the word tells us almost nothing."),
    P("This idea is called **inverse document frequency**: the fewer chunks contain a word, the more valuable the word is. The code uses `Math.log(1 + total / count)`. You do not need to remember the formula. You only need to remember the idea: rare shared words matter most."),
    P("Keyword search is fast, free and easy to understand. Its weakness is vocabulary. If the user asks “How long should my resume be?” and your document says “one or two pages”, the words “long” and “pages” do not match, and keyword search misses it. Lessons 14 and 16 show ways to reduce this problem. For now, remember that retrieval is the step where most RAG systems fail. If the right paragraph is not found, the best model in the world cannot answer well."),

    H("Where RAG goes wrong"),
    L("**The right chunk is not retrieved.** The most common problem. Fix it by improving chunking, search and documents.", "**The chunk is found but cut in half.** An idea is split across two chunks and neither has the full answer.", "**Too many chunks.** If you send ten chunks, the model may get lost or mix them up. Three to five good chunks usually beat ten average ones.", "**The model ignores the context.** A clear system prompt and tags help. Testing (lesson 22) tells you if it still happens.", "**The documents are old or wrong.** RAG repeats what your documents say. If a document is out of date, the answer is out of date."),
    BUILD,

    H("Your task: build the help-center bot"),
    P("In this task you add your first RAG feature to the AI Lab: a page where a user asks a question, and the answer comes only from six small help-center documents."),
    P("**What you will build**"),
    L("A folder server/rag/docs with six short Markdown help articles (the solution zip has ready-made ones; you can write your own).", "A loader that reads the documents and cuts them into paragraph chunks.", "A keyword search that scores chunks and returns the best three.", "A route POST /api/rag that retrieves, builds a prompt with the chunks inside tags, and asks Claude to answer from them only.", "An Angular page called Ask docs that shows the answer and the sources it used."),
    P("**Steps**"),
    O("Create server/rag/docs and add at least four Markdown files. Each file starts with a title line that begins with # and has three or four short paragraphs. Write them about any topic you know, for example resume tips.", "Write server/rag/load.js with a function that reads every .md file and returns a list of chunks. One paragraph is one chunk. Give each chunk an id like resume-basics.md#2 and remember its source file.", "Write server/rag/keyword.js. Split text into lower-case words, remove stop words, and score each chunk by the shared rare words. Return the best three chunks that scored above zero.", "Write server/routes/rag.js. If there are no chunks, return the “I don't have that in my notes.” message without calling Claude. Otherwise put the chunks in a <context> block and call Claude with the rules from the lesson as the system prompt.", "Build the Angular page. It needs one input, one button, the answer, and a list of sources with their scores. Add the page to the menu and routes.", "Test four questions: two that your documents answer, one that they do not (for example “What is the capital of Australia?”), and one where your wording is different from the document. Write down what happens in each case."),
    P("**Hints**"),
    L("Keep the system prompt short and strict. Say what to do when the context has no answer.", "Cut the question to 500 characters on the server so nobody can send a huge prompt.", "Show the score next to each source. Seeing the scores teaches you how the search thinks.", "Do not forget to handle an empty question with a clear 400 message."),
    P("**You know it works when** a question in your documents gets a short, correct answer with the right source listed, an unrelated question gets “I don't have that in my notes.” without any model call, and the page shows a friendly message if the server key is wrong."),
    P("Try to build it yourself first. The struggle is where the learning happens. Then compare with the solution."),

    H("Solution"),
    P("The solution zip contains the full AI Lab after this lesson. These are the new files. First the loader, which reads the documents and makes paragraph chunks:"),
    F(LAB, 'steps/13/server/rag/load.js'),
    P("The keyword search:"),
    F(LAB, 'steps/13/server/rag/keyword.js'),
    P("The route. Notice the three stages in the comments: retrieve, augment, generate."),
    F(LAB, 'steps/13/server/routes/rag.js'),
    P("And the Angular page:"),
    F(LAB, 'steps/13/src/app/pages/rag.ts'),
    N("Read the route again. If no chunk matches, the model is never called. This single early return saves money and prevents invented answers for questions your documents cannot answer."),

    H("What you learned"),
    L("A model only knows its training data. RAG gives it your data at question time.", "RAG has six steps: ingest, chunk, embed, store, retrieve, generate.", "A strict prompt (“answer only from the context, otherwise say you do not know”) matters as much as retrieval.", "Keyword search is simple and useful, but it misses answers when the words differ."),
    P("In the next lesson you will cut documents into better chunks and meet embeddings, which help the search understand more than exact words."),
  ], [
    { q: 'Is RAG better than fine-tuning?', a: 'They solve different problems. RAG is better for giving a model facts, keeping them up to date and showing sources. Fine-tuning is better for teaching a consistent style or output format.' },
    { q: 'Does RAG stop hallucinations completely?', a: 'No. It lowers them a lot, but the model can still ignore the context or mix in its own memory. A strict prompt, good retrieval and regular testing keep the risk small.' },
    { q: 'How many chunks should I send to the model?', a: 'Start with three to five good chunks. More is not always better, because extra text costs money and can distract the model.' },
    { q: 'Do I need a vector database for RAG?', a: 'No. For a few hundred paragraphs, keyword search or an in-memory index is enough. Vector databases matter when you have many thousands of chunks.' },
  ], 'what is rag, retrieval augmented generation, rag tutorial, rag vs fine-tuning, rag angular node'),

  // ------------------------------------------------------------------ 14
  lesson(S1, 'chunking-embeddings-vector-search', 'Chunking, Embeddings and Vector Search', 'Cut documents into overlapping chunks, understand embeddings and cosine similarity, and build a vector search page where you can change chunk size and see the results change.', '', [
    P("In lesson 13 we cut documents into paragraphs and searched by exact words. It worked, but you saw the weak spot: if the user's words are different from the document's words, the search can miss the answer. In this lesson you improve two things. First, you learn to **chunk** well, because bad chunks hide good answers. Second, you meet **embeddings**, the idea that lets a search compare meaning instead of only spelling."),
    P("By the end you will build a Search page in your AI Lab where you can move two sliders, chunk size and overlap, and watch the results change. That page will teach you more about retrieval than any amount of reading."),

    H("Why chunking matters"),
    P("A chunk is the unit of retrieval. The search finds chunks, and the model reads chunks. So the shape of your chunks controls everything."),
    L("**Chunks that are too big** carry many ideas at once. The search score gets blurred, and you send extra text to the model that it does not need. You pay for it too.", "**Chunks that are too small** may not contain a complete answer. A chunk that only says “as shown above” is useless on its own.", "**Chunks cut in the wrong place** split a sentence or a list in half. The first half goes to one chunk and the second half to another, and neither one answers the question."),
    P("There is no perfect size. Common starting points are about 200 to 500 tokens per chunk (roughly 150 to 400 words), with a small overlap. Short, direct documents like FAQs do well with smaller chunks. Long, flowing articles do better with larger ones. The right way to choose is to try, measure and compare. Lesson 22 shows you how to measure."),

    H("Overlap: a safety net at the borders"),
    P("**Overlap** means that the end of one chunk is repeated at the start of the next. Imagine a sentence that sits exactly on the border between chunk 3 and chunk 4. Without overlap, it is cut. With an overlap of 20 words, the last 20 words of chunk 3 also appear at the start of chunk 4, so at least one of the two chunks holds the sentence whole."),
    P("A typical overlap is 10 to 20 percent of the chunk size. More overlap means safer borders but more chunks, more storage and more duplicate results. Here is our chunking function. It moves a window of `size` words across the text, and each step moves forward by `size - overlap` words:"),
    F(LAB, 'steps/14/server/rag/chunk.js'),
    P("Smarter chunkers split on structure first: headings, then paragraphs, then sentences, and only cut inside a sentence as a last choice. They also keep the heading with each chunk so that the chunk knows what it is about. Our lab adds the document title in front of each chunk before embedding for the same reason."),
    P("Also keep **metadata** with every chunk: the source file, the title, the page number, the date. Metadata lets you show sources to the user, filter results (“only the interview guide”) and debug."),

    H("What is an embedding?"),
    P("A computer cannot compare meaning directly. It can compare numbers. An **embedding** is a way to turn a piece of text into a list of numbers, called a **vector**, so that texts with similar meaning get similar vectors."),
    P("Here is a simple picture. Imagine a big map. On this map, “doctor” and “nurse” are close together, and “banana” is far away. Every piece of text is a point on the map. A real embedding map does not have 2 directions like a paper map. It has hundreds or thousands of directions, so a vector might be 1,024 numbers long. But the idea is the same: **close points mean related meaning**."),
    P("To search, you embed the question too. That puts the question on the same map. Then you look for the chunk points that are nearest to the question point. This is **vector search**, also called semantic search."),

    H("Measuring closeness: cosine similarity"),
    P("The most common way to measure closeness is **cosine similarity**. It looks at the angle between two vectors. If they point the same way, the score is close to 1. If they have nothing in common, it is near 0. The code is short. When both vectors are scaled to length 1, cosine similarity is just a dot product: multiply the numbers in pairs and add them up."),
    C("javascript", "// a and b are vectors of the same length, already scaled to length 1\nconst cosine = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);"),
    P("Use cosine scores to rank, not as percentages. A score of 0.3 is not “30 percent sure”. What matters is that chunk A scored higher than chunk B, and how far above the noise level the best score is."),

    H("A real embedding model versus our teaching embedding"),
    P("Real embeddings come from a trained model. The model has read huge amounts of text and learned that “car” and “automobile” belong close together. You call an embedding service with your text, and it returns the vector. Anthropic's Claude models generate text, and at the time of writing Anthropic does not sell its own embedding model. Anthropic's documentation points to other providers, for example Voyage AI, and many teams also use open models they run themselves. Check the current documentation and pricing before you choose."),
    P("To keep this lab free and key-less, we use a tiny embedding that we wrote ourselves. It hashes words and pairs of words into 1,024 slots. Look at how short it is:"),
    F(LAB, 'steps/14/server/rag/embed.js'),
    P("Be honest about what this does. It matches shared words and word pairs, so it is smoother than exact keyword matching, but it **does not understand synonyms**. “Car” and “automobile” look unrelated to it. We use it because it lets you see every part of vector search with no account and no cost. In a real project you replace the function `embed()` with a call to an embedding model, and everything else in the lab stays the same. That is the reason we keep `embed()` in its own file."),
    N("Two rules for real embeddings. First, always embed your chunks and your questions with the same model. Vectors from different models cannot be compared. Second, if you change the embedding model, you must re-embed everything."),

    H("The search page"),
    P("The server builds an index: it chunks each document, adds the title, embeds the chunk and keeps the vector. To answer a query it embeds the query, scores every chunk with cosine similarity and returns the best ones. For a few hundred chunks, checking every chunk is fast enough. Vector databases (lesson 15) use clever indexes so that this stays fast with millions."),
    F(LAB, 'steps/14/server/rag/index.js'),
    P("Notice that nothing in this lesson calls Claude. Retrieval is your own code, and testing it separately is cheap and fast. This is a good habit: **test retrieval on its own before you test the whole RAG system.** If retrieval is bad, no prompt can save you."),

    H("Your task: build the Search page"),
    P("Add a page where you can change chunk size and overlap and see which chunks come back for a question."),
    P("**What you will build**"),
    L("server/rag/chunk.js with the overlapping word chunker.", "server/rag/embed.js with a local embedding and a cosine function.", "server/rag/index.js that builds the index (cached for each size and overlap) and searches it.", "A route POST /api/search that accepts query, size, overlap and k, and keeps all numbers inside safe limits.", "An Angular Search page with two sliders and a results list with similarity bars."),
    P("**Steps**"),
    O("Write the chunker. Test it in the Node console with a text of 200 words, size 50 and overlap 10. You should get chunks that start at word 0, 40, 80 and so on.", "Write the embedding function. Check that embed(\"resume\") has length 1024 and that the sum of its squares is about 1.", "Write the index and search. Print the top three chunks for the query “what should go in the skills section for the ATS”.", "Write the route. Clamp size to between 20 and 300 words, overlap to between 0 and size minus 1, and k to between 1 and 10. Return the number of chunks too.", "Build the Angular page with two range inputs, a query box and a button. Show each hit with its id, its score and a small bar.", "Experiment. Try size 20, 80 and 200. Which setting finds the right chunk for each of your test questions? Write down your finding."),
    P("**Hints**"),
    L("Cache the index in a Map using a key like \"80:20\" so a slider move does not re-embed everything each time.", "Convert numbers with Number() and check them with Number.isFinite before you use them.", "Remember to include the title in the text you embed. It helps a chunk that does not repeat its topic."),
    P("**You know it works when** moving the chunk size slider changes the number of chunks and the ranking, a very long chunk size gives few chunks with blurry scores, and a nonsense query gives low scores."),

    H("Solution"),
    P("The files you have just read are the heart of the solution. Here are the route and the Angular page. The zip contains everything together."),
    F(LAB, 'steps/14/server/routes/search.js'),
    F(LAB, 'steps/14/src/app/pages/search.ts'),
    N("The route clamps every number it receives. Never trust numbers from the browser. A request with size 99999999 or a negative overlap must not crash the server or use all its memory."),

    H("What you learned"),
    L("Chunk size and overlap decide what your search can find. There is no perfect value, so test.", "An embedding turns text into a vector so that similar meanings are close together.", "Cosine similarity measures closeness. Use it to rank, not as a percentage.", "Our local embedding is a teaching tool. Real systems call an embedding model, and always embed questions and chunks with the same model."),
    P("In the next lesson you will put these vectors into a store with a clear interface, learn what vector databases do, and see how to move from this lab to PostgreSQL with pgvector, Qdrant or Pinecone."),
  ], [
    { q: 'What chunk size should I use?', a: 'A common starting point is 200 to 500 tokens with 10 to 20 percent overlap. Then test with your own questions and adjust.' },
    { q: 'What is cosine similarity?', a: 'It is a score for how closely two vectors point in the same direction. Higher means more similar. Use it to rank results rather than read it as a percentage.' },
    { q: 'Does Anthropic offer an embedding model?', a: 'At the time of writing, Anthropic does not offer its own embedding model and points to other providers such as Voyage AI. Check the current Anthropic documentation, because this can change.' },
    { q: 'Can I mix embeddings from two different models?', a: 'No. Vectors from different models live in different spaces and cannot be compared. If you change the model, embed all chunks again.' },
  ], 'chunking rag, text embeddings explained, cosine similarity, vector search tutorial, semantic search node.js'),
];
