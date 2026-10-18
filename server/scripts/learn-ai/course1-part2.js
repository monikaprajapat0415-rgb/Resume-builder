import { P, H, L, O, N, C, F, lesson } from './helpers.js';

const LAB = 'genai-basics-lab';
const S2 = 'Generative AI and LLMs';
const S3 = 'Prompt engineering';

const BUILD = N("These exercises live in the GenAI Basics Lab, an Angular app that runs completely in your browser. You need no API key, no account and no server. Unzip the solution zip for the lesson, run npm install, then npm start and open http://localhost:4200. Each zip contains the whole lab up to that lesson. The models in the exercises are tiny teaching models. They show how the ideas work, but they are not real language models, and their numbers are not what a real model would give.");

export const lessons = [
  // ------------------------------------------------------------------ 5
  lesson(S2, 'introduction-to-generative-ai', 'Introduction to Generative AI', 'Learn what generative AI is, how it differs from predictive AI, what it can create and where it fails, and build a tiny text generator that shows the core idea.', '', [
    P("Until a few years ago, most AI products were built to judge or predict: is this email spam, will this customer leave, which job fits this resume best. Today, many AI products are built to create: they write an email, draw a picture, compose a tune, or write computer code. This second kind is called **generative AI**. In this lesson you will learn what makes it different, what it can make, how the simplest possible text generator works, and where generative AI goes wrong. You will build that simplest generator yourself, in a few lines of code, and see why it is a good first picture of how a large language model behaves."),

    H("Predictive AI and generative AI"),
    P("**Predictive AI**, sometimes called discriminative AI, looks at an input and chooses from a small set of answers. A spam filter says “spam” or “not spam”. A resume screener gives a score from 0 to 100. The output is a label or a number."),
    P("**Generative AI** produces something new that was not in the input: a paragraph, an image, a song, a piece of code. The output is open-ended. There is no short list of correct answers. If you ask a generative model for “a cover letter for a warehouse job”, there are millions of acceptable letters."),
    P("Underneath, both kinds learn patterns from data. A generative model learns the patterns of how things look: how sentences are built, how pictures are arranged. Then it uses those patterns to produce new examples that look similar to what it learned from. It does not copy and paste a stored example. It produces new output one small piece at a time."),

    H("What generative AI can create"),
    L("**Text.** Emails, summaries, translations, stories, explanations and answers. This is where large language models (LLMs) work.", "**Code.** Programs, tests, and fixes for bugs, often from a plain-English description.", "**Images.** Pictures from a written description, or edits to an existing photo.", "**Audio and music.** Speech in a chosen voice, sound effects, songs.", "**Video.** Short clips from a description or a still image.", "**Structured data.** Tables, JSON and database queries. You will use this in the prompt engineering lessons."),
    P("This course focuses on text, because text models are the base of most business tools: chat assistants, resume writers, search with answers, and support bots."),

    H("The core idea: predict the next piece"),
    P("A language model has one basic skill. Given some text, it estimates which piece of text is likely to come next. A **piece** is usually a word or part of a word, called a token (lesson 6 explains tokens). Write “Thank you for your” and the model finds that “time”, “help” and “application” are likely, while “banana” is not. It picks one of them, adds it to the text, and repeats. That loop, repeated hundreds of times, produces a whole paragraph."),
    P("It may sound too simple to produce useful answers, but there is a catch: to predict the next word well across all kinds of text, the model must learn a lot about grammar, facts, style and even some reasoning. Predicting the next word in a maths textbook rewards knowing some maths. Predicting the next word in a polite email rewards knowing how polite emails sound."),
    P("The simplest version of this idea needs no neural network at all. It is called a **Markov chain**. You look at the last one or two words, find every place in your training text where those words appeared, and note which word came next each time. To generate, you pick one of those next words at random, add it, shift forward by one word, and repeat. Words that followed more often are picked more often."),
    P("Example: suppose the training text contains “the manager reviews the resume” and “the manager calls the candidate”. After the words “the manager” the possible next words are “reviews” and “calls”. The chain picks one. If it picks “calls”, then looks at “manager calls”, the next word can only be “the”, and so on. The output can combine pieces in ways that never appeared as a whole in the training text."),

    H("Why a Markov chain is not enough"),
    P("Your tiny generator will sound a little like the text it was trained on, but it has no real idea of meaning. It sees only the last one or two words. With a short memory it writes nonsense that drifts away from any topic. With a long memory (many words) it simply copies whole pieces of the original, because there is only one thing that ever followed those words. You will measure this in the exercise: a number that shows what share of the output is copied from the source."),
    P("A large language model solves this by looking at thousands of previous words at once, by using attention (lesson 4) and by learning from a vast amount of text. Instead of counting exact word matches, it learns a smooth sense of similarity, so it can handle sentences it has never seen. But the loop is the same: look at the text so far, estimate the likely next token, pick one, repeat."),

    H("Where generative AI fails"),
    P("Because the model produces what is likely, not what is true, it has a few typical weaknesses. Learn them now, because later lessons show how to reduce each one."),
    L("**Hallucination.** The model states something false in a confident voice. A made-up quotation, a wrong date, a fake web address. It happens because a fluent guess looks the same as a fact from the model’s point of view.", "**Out-of-date knowledge.** The model learned from text up to a certain date and knows nothing after it, unless you give it new information.", "**Bias.** The training text came from people, so the model can repeat stereotypes found there.", "**Inconsistency.** Ask the same question twice and you may get two different answers, because the choice of the next token has some randomness.", "**Prompt sensitivity.** Small changes to the wording of a request can change the quality of the answer. This is why prompt engineering exists."),
    P("None of this means generative AI is useless. It means you should use it the way you would use a quick, well-read, over-confident assistant: great for drafts, ideas and summaries, but needing a check before important facts go out under your name."),

    H("Using generative AI responsibly"),
    P("Three simple habits help. First, **check facts** that matter: numbers, names, dates, links and anything legal or medical. Second, **protect private data**: do not paste passwords, ID numbers or other people’s personal details into a tool unless you know how it stores them. Third, **be honest** about where text came from when it matters, for example in school or in a professional setting. A resume written with AI help is fine, but every claim in it must still be true."),
    BUILD,

    H("Your task: build a Markov text generator"),
    P("You will write the simplest text generator and a page that lets you change how much it remembers. You will see the difference between nonsense and copying with your own eyes."),
    P("**What you will build**"),
    L("A buildChain function that reads a training text and records which words follow each group of words.", "A generate function that starts at the beginning of a sentence and produces a chosen number of words.", "A copiedShare function that measures how much of the output is a straight copy from the training text.", "A page with a text area for the training text, sliders for memory and length, and a Generate again button."),
    P("**Steps**"),
    O("Create lib/markov.ts. Write a small tokens helper that splits text into words on spaces.", "Write buildChain(text, order). For every position in the text, take the previous order words as a key (joined with a space) and store the word that came next in a list for that key. Also remember which keys start a sentence.", "Write generate(chain, count, seed). Pick a starting key, then repeat: look up the possible next words, pick one with the seeded random generator from lesson 3, add it, and slide the key forward. When a key has no next word, start a new sentence.", "Write copiedShare(source, output): take every run of four words in the output and check whether it appears in the source. Return the share that does.", "Build the page. Show the generated text and the copied share as a percentage. Let the seed change so that Generate again gives a new text."),
    P("**Hints**"),
    L("Start with a training text of five or six sentences on one topic, such as job interviews.", "Use memory 1 and look at the text. Then try 2 and 3. Notice what happens to the copied share.", "The seed makes the output repeatable. The same seed gives the same text, which is very useful for testing.", "Keep a list for each key, with repeated words included. That is what makes common words more likely, with no extra code."),
    P("**You know it works when** memory 1 gives odd but varied text with a low copied share, memory 3 gives smooth text that is mostly copied, and pressing Generate again gives a different text each time."),

    H("Solution"),
    P("The Markov chain, with building, generating and measuring the copied share:"),
    F(LAB, 'steps/05/src/app/lib/markov.ts'),
    P("And the page:"),
    F(LAB, 'steps/05/src/app/pages/markov.ts'),
    N("Notice the trade-off: a short memory gives creativity without sense, and a long memory gives sense without creativity. Large language models get both, thanks to their size and to attention."),

    H("What you learned"),
    L("Predictive AI chooses a label or a number. Generative AI creates new content.", "A language model repeatedly estimates the likely next piece of text and picks one.", "A Markov chain is the simplest version of this idea and shows the trade-off between creativity and copying.", "Generative AI can hallucinate, be out of date, be biased and be inconsistent, so important output needs checking."),
    P("In the next lesson you will look inside this loop: tokens, the context window, and the settings (temperature, top-k, top-p) that control how the next token is chosen."),
  ], [
    { q: 'What is the difference between generative AI and a chatbot?', a: 'Generative AI is the technology that creates new content. A chatbot is one application that uses it, wrapped in a chat window. Many chatbots use a large language model to generate their replies.' },
    { q: 'Does generative AI copy existing text?', a: 'It does not look up and paste stored text, but it can reproduce passages that appeared many times in its training data. It generates output one token at a time based on learned patterns.' },
    { q: 'Why does generative AI sometimes say false things?', a: 'It produces text that is likely given the patterns it learned, and it has no built-in way to check facts. A fluent false sentence can be as likely as a true one, so the model may write it with confidence.' },
    { q: 'Is a Markov chain a real language model?', a: 'Yes, it is the oldest and simplest type of statistical language model. Modern models are far larger and use neural networks and attention, but they share the idea of predicting the next piece of text.' },
  ], 'introduction to generative ai, generative ai vs predictive ai, what can generative ai create, markov chain text generator, ai hallucination'),

  // ------------------------------------------------------------------ 6
  lesson(S2, 'how-large-language-models-work', 'How Large Language Models Work', 'Understand tokens, the context window, training and sampling settings like temperature, top-k and top-p, with a hands-on page that shows how the next word is chosen.', '', [
    P("A large language model, or LLM, is a very big neural network trained on a very large amount of text to predict the next token. You met that idea in the last lesson. In this lesson we open the box a little. You will learn what a token is, what the context window limits, how the model is trained in stages, and how settings such as temperature change the way the model picks its next word. By the end you will be able to explain why the same question can give different answers, and you will have a page where you can see the effect of every setting."),

    H("Tokens: the pieces a model reads"),
    P("A model does not read letters or whole words. It reads **tokens**. A token is a piece of text, often a common word, part of a longer word, or a bit of punctuation. A simple word such as “job” is usually one token. A rare word such as “unemployability” may be split into several pieces. The splitting method is learned from data so that common pieces get their own token, which keeps text short."),
    P("As a rough guide for English, one token is about four characters, or three quarters of a word. So 100 words are around 130 tokens. Other languages often need more tokens for the same meaning, because the tokenizer saw less text in them. Numbers, code and unusual names can use many tokens too."),
    P("Tokens matter for three reasons. They decide the **cost**, because most AI services charge by the token for input and output. They decide the **limit**, because a model can only handle a fixed number of tokens at once. And they explain some odd behaviour: a model that sees “strawberry” as a few pieces rather than ten letters can find it hard to count letters."),

    H("The context window"),
    P("The **context window** is the maximum number of tokens the model can look at in one go. It includes everything: your instructions, earlier messages in the chat, any documents you pasted, and the answer being written. Think of it as the model’s desk. Anything on the desk can be used. Anything that does not fit is simply not there."),
    P("Windows have grown from a few thousand tokens to hundreds of thousands, and some models handle more than a million. But a bigger window is not magic. Longer input costs more and runs slower. Models can also pay less attention to the middle of very long text. A good habit is to put only what the model needs into the window, and to place the most important instructions clearly, near the start or the end."),
    P("The model has no memory between separate conversations unless the application stores and re-sends earlier messages. When a chat seems to “remember” you, the app is putting the earlier text back into the context window each time."),

    H("How a model is trained"),
    O("**Pre-training.** The model reads a huge collection of text (books, websites, code, articles) and learns to predict the next token. It makes a guess, compares it with the real next token, and adjusts its weights, billions of times. This is the most expensive stage and builds the broad knowledge and language skill.", "**Instruction tuning.** The pre-trained model only continues text. It is then trained on examples of questions with good answers, so that it learns to follow instructions and to behave like an assistant.", "**Preference training.** People compare answers and say which one is better. The model is adjusted towards answers people prefer: more helpful, more honest, and less harmful. Methods in this stage include reinforcement learning from human feedback."),
    P("After training, the weights are fixed. When you use the model, it does not learn from your chat. This is why a model cannot know about last week’s news, unless a tool provides it."),

    H("Choosing the next token"),
    P("At each step the model produces one raw score for every token in its vocabulary, which can have 100 thousand entries or more. Softmax (lesson 2) turns the scores into probabilities. Then the program must pick one token. How it picks is controlled by a few settings."),
    P("**Greedy choice** always takes the most likely token. The output is steady and repeatable but can be dull and repetitive. **Sampling** picks randomly in proportion to the probabilities, so a token with 20 percent chance is chosen about one time in five. This gives variety."),
    L("**Temperature** reshapes the probabilities before sampling. The scores are divided by the temperature. A low temperature, such as 0.2, makes the favourite token dominate, so answers are focused and consistent. A high temperature, such as 1.5, flattens the probabilities, so unlikely tokens get a real chance and answers become more varied and sometimes strange. Temperature 0 means always the top token.", "**Top-k** keeps only the k most likely tokens and drops the rest. With top-k = 3 the model chooses among the three best candidates.", "**Top-p**, also called nucleus sampling, keeps the smallest group of top tokens whose probabilities add up to p. With top-p = 0.9 it keeps just enough tokens to cover 90 percent of the probability. The group is small when the model is sure and large when it is not."),
    P("After top-k or top-p removes some tokens, the remaining probabilities are scaled up to add to 1 again, and one token is sampled. For facts, extraction and code, use a low temperature. For brainstorming and creative writing, a medium or higher temperature helps. Not every model or service lets you set all of these, so read the documentation of the one you use."),
    P("Even at a low temperature, the same prompt may not give exactly the same answer every time, because of small differences in how the calculations run. If you need exact repeatability, test your prompt many times and check the results, rather than trusting one run."),

    H("Why the model sounds so sure"),
    P("The model produces a fluent answer whether or not it knows the facts, because fluency is exactly what it was trained for. Its internal probabilities are not a reliable measure of truth. So treat confident wording as style, not as proof. You can reduce the risk by giving the model the source text to work from, asking it to say when it does not know, and checking claims that matter."),
    BUILD,

    H("Your task: see how the next word is chosen"),
    P("You will build a page with a toy model: a list of candidate next words with raw scores. Sliders for temperature, top-k and top-p show the resulting probabilities, and a column shows how often each word was chosen in 1,000 draws. A second card estimates tokens and shows how much of a context window your text uses."),
    P("**What you will build**"),
    L("A probabilities function that applies temperature and softmax to a list of scores.", "A filterProbs function that applies top-k and top-p and scales the rest back to 1.", "A sampleMany function that draws many samples with a seeded random generator and counts the results.", "An estimateTokens function that guesses the token count from words and from characters.", "A page with sliders, a table of probabilities and counts, and a text box with a context window check."),
    P("**Steps**"),
    O("Create lib/sampling.ts and define a Candidate type with a token and a logit (raw score). Add a toy list of 8 candidates for the sentence “Thank you for your ...”.", "Write probabilities(candidates, temperature): divide each score by the temperature (never below a small minimum, to avoid dividing by zero), then use softmax.", "Write filterProbs(probs, topK, topP): sort the probabilities from high to low, keep tokens until you have topK of them or the total reaches topP, set the others to 0 and divide the rest by their sum.", "Write sampleMany(probs, times, seed): for each draw, take a random number and subtract probabilities from a random number until it drops to zero or below to pick an index. Count how often each index is chosen.", "Write estimateTokens(text): words × 1.3, and characters ÷ 4. Show both, since they are only guesses.", "Build the page with the three sliders, bars, a column that shows the result of 1,000 draws, and a context window check with a size you can change."),
    P("**Hints**"),
    L("At temperature 0.1 the top word should have nearly all the probability. At 2 the bars should look almost flat.", "Top-k = 1 makes the model greedy. Compare it with top-k = 8.", "Lower top-p until only one or two words remain, and see how the others vanish.", "Check that the filtered probabilities always add up to 1."),
    P("**You know it works when** the bars change smoothly as you move the sliders, the 1,000 draws roughly match the probabilities, words removed by top-k or top-p never appear in the draws, and the token estimate rises as you paste more text."),

    H("Solution"),
    P("The sampling logic, with temperature, top-k, top-p and the token estimate:"),
    F(LAB, 'steps/06/src/app/lib/sampling.ts'),
    P("And the page:"),
    F(LAB, 'steps/06/src/app/pages/sampling.ts'),
    N("The token estimate in this lab is a rough rule of thumb. Real tokenizers differ between models, so for exact counts use the counting tool provided by the service you use."),

    H("What you learned"),
    L("A model reads tokens, about four characters or three quarters of a word each in English, and tokens decide cost and limits.", "The context window is everything the model can see at once. Chat memory is the app re-sending earlier messages.", "Training has three stages: pre-training, instruction tuning and preference training. The weights do not change while you chat.", "Temperature, top-k and top-p control how the next token is picked: low is steady, high is varied."),
    P("In the next lesson you will look at the architecture and the practical side of running models: memory, quantization, speed and cost."),
  ], [
    { q: 'What is a token in an LLM?', a: 'A token is a small piece of text that the model reads and writes: a short word, part of a longer word, or punctuation. In English one token is about four characters or three quarters of a word.' },
    { q: 'What does temperature do?', a: 'Temperature controls randomness in choosing the next token. A low value makes the model pick the most likely tokens and give steady answers. A high value gives more varied and sometimes less accurate answers.' },
    { q: 'Does the model learn from my conversation?', a: 'Not in the moment. The weights are fixed after training. Apps may seem to remember by sending earlier messages back into the context window, and some providers may use data for future training under their own policies, so check the privacy settings.' },
    { q: 'Should I use top-k and top-p together?', a: 'You can, but changing one of them is usually enough. Many guides suggest adjusting either temperature or top-p, not both at once, so that you can see the effect of each change.' },
  ], 'how llms work, what is a token, context window explained, temperature top-k top-p, llm training stages'),

  // ------------------------------------------------------------------ 7
  lesson(S2, 'llm-architecture-and-optimization', 'LLM Architecture and Optimization', 'Learn the parts of a transformer, parameters, the cache and mixture of experts, and how quantization, batching and smaller models cut memory, cost and delay. Includes a model size calculator.', '', [
    P("In lesson 4 you met the transformer. In this lesson you will look at its parts in a little more detail, and then at a very practical question: what does it take to run a model? A model with billions of parameters needs memory, and it needs to read that memory for every token it writes. Understanding this explains why some models run on a phone and others need a data centre, why long chats cost more, and why people talk about quantization, caching and small models. At the end you will build a calculator that estimates whether a model fits on a device and how fast it can run."),

    H("The parts of a transformer"),
    P("A modern language model is a stack of identical **blocks**. The number of blocks, often between 20 and 100 or more, is the model’s depth. Each block has two main parts."),
    L("**Self-attention.** Every token looks at the other tokens before it and collects the information it needs, weighted by importance. Many attention “heads” run side by side, and each can focus on a different kind of relation: grammar, names, topic, position.", "**A feed-forward network.** A small neural network applied to each token on its own. Much of the model’s stored knowledge is thought to sit here."),
    P("Around those parts are a few helpers. The first step turns each token into a vector, the **embedding**, and adds information about its **position**, because attention alone does not know which word came first. **Normalisation** layers keep the numbers in a healthy range. **Residual connections** add each block’s input back to its output, which lets very deep networks train without losing the signal. At the top, a final layer turns the last vector into one score for every token in the vocabulary, and softmax produces the probabilities you saw in lesson 6."),

    H("What are parameters?"),
    P("The **parameters** of a model are its weights: all the numbers adjusted during training. When you read “a 7 billion parameter model”, it means 7,000,000,000 numbers. More parameters usually give more capacity to store knowledge and skill, but they also need more memory and more calculation. Size is not everything: a smaller model trained on better data, for longer, can beat a bigger one."),
    P("Parameters are not the same as the context window or the amount of training text. Parameters are the model’s size. The context window is how much it can read at once. The training data is what it learned from."),

    H("How much memory does a model need?"),
    P("Each parameter is a number that must be stored, and the space it takes depends on its **precision**. The common choices are:"),
    L("**32-bit floating point (fp32)** takes 4 bytes per parameter. It is precise and was used for training in the past.", "**16-bit floating point (fp16 or bf16)** takes 2 bytes. It is the usual choice for serving models.", "**8-bit integer (int8)** takes 1 byte.", "**4-bit integer (int4)** takes half a byte."),
    P("The memory for the weights is simply the number of parameters multiplied by the bytes per parameter. A 7 billion parameter model in 16-bit takes 7 billion × 2 bytes = 14 gigabytes. In 4-bit it takes about 3.5 gigabytes. You also need extra space for working data. A rough rule is to add about 20 percent, and more for long conversations."),

    H("Quantization: smaller numbers, smaller model"),
    P("**Quantization** means storing the weights with fewer bits. It is like saving a photo at lower quality: the file is much smaller, and if you do it with care you hardly see the difference. Going from 16-bit to 8-bit halves the memory, and to 4-bit cuts it to a quarter. The model also runs faster, as we will see next. The cost is a small loss of quality, which grows as you use fewer bits. Many everyday tasks are fine at 8-bit or even 4-bit, but you should test your own task, especially for maths, code and non-English languages."),

    H("Why speed depends on memory"),
    P("When a model writes text it produces one token at a time. For each token it needs to use all of its weights, so the chip must read the whole model from memory again and again. For this reason, the writing speed is usually limited by **memory bandwidth**, how many gigabytes per second the chip can read, and not by how fast it can multiply."),
    P("A rough upper limit is: tokens per second ≈ memory bandwidth ÷ size of the weights. With a model of 14 GB and a chip that reads 900 GB per second, the limit is about 64 tokens per second. Quantize the same model to 4-bit (3.5 GB) and the limit rises to about 257. These are only estimates. Real speed depends on the software, how many requests are handled together, and the hardware. But the estimate shows an important truth: smaller weights mean both less memory and more speed."),

    H("The cache: why long chats get expensive"),
    P("When a model has already processed your earlier tokens, it does not want to redo the work for each new token. It keeps the intermediate results of attention for all earlier tokens, called the **KV cache** (keys and values). This saves a lot of calculation but uses memory that grows with the length of the conversation and with the number of users served at once. That is one reason why very long contexts are slow and costly, and why services may charge differently for cached and uncached input."),

    H("More ways to make models cheaper and faster"),
    L("**Batching.** Serve many users at the same time, so that one read of the weights helps many requests.", "**Smaller models and distillation.** Train a small “student” model to copy the behaviour of a big “teacher” model. You get much of the quality at a fraction of the cost.", "**Mixture of experts (MoE).** The model contains many specialist sub-networks, and for each token only a few are used. The model has many parameters in total but uses only part of them per token, which saves calculation.", "**Efficient attention methods.** Software tricks that compute attention faster and with less memory.", "**Caching prompts and answers.** If many requests start with the same long instructions, or ask the same question, reuse the earlier work or answer."),
    P("Choosing a model is a trade-off between quality, speed, cost and privacy. A small model on your own device is private and free per use but less capable. A large hosted model is more capable but costs money per token and sends your data to a provider. A good engineer picks the smallest model that does the job well, and tests that claim."),
    BUILD,

    H("Your task: a model size calculator"),
    P("Build a page that takes the size of a model and a precision, and tells you how much memory the weights need, which example devices can hold it, and an upper limit for the speed on each."),
    P("**What you will build**"),
    L("A table of bytes per parameter for fp32, fp16, int8 and int4.", "Functions for the memory of the weights, the memory with 20 percent working space, the speed limit, and the saving compared with 16-bit.", "A list of example hardware with memory and bandwidth numbers. Label them clearly as examples.", "A page with a slider for model size from 1 to 200 billion parameters, a precision selector and a table with a Fits column."),
    P("**Steps**"),
    O("Create lib/memory.ts. Define the Precision type and a BYTES table: fp32 4, fp16 2, int8 1, int4 0.5.", "Write weightsGB(paramsBillions, precision): parameters in billions times bytes gives gigabytes directly.", "Write neededGB with the overhead factor 1.2.", "Write maxTokensPerSecond(paramsBillions, precision, bandwidthGBs) as bandwidth divided by the weights size.", "Write savingVsFp16 so the page can say how much memory a lower precision saves.", "Define four example devices, such as a phone with 8 GB and a laptop with 16 GB, and build the page with a table that shows yes or no for each."),
    P("**Hints**"),
    L("Check your numbers by hand: 7 billion parameters in fp16 should show 14 GB, and about 16.8 GB with working space.", "Notice that a 7 billion model needs 4-bit precision to fit comfortably on the 8 GB phone example.", "Remember the speed limit is an upper bound. Real systems are usually slower.", "Do not claim the example hardware is a real product. The numbers are only round examples."),
    P("**You know it works when** moving the slider updates the table at once, lowering the precision makes more rows say yes and raises the speed limits, and your hand calculation matches the page."),

    H("Solution"),
    P("The memory and speed calculations:"),
    F(LAB, 'steps/07/src/app/lib/memory.ts'),
    P("And the page:"),
    F(LAB, 'steps/07/src/app/pages/memory.ts'),
    N("Treat every number from this calculator as a first estimate for planning. Before you choose hardware or a model, measure with the real software you plan to use."),

    H("What you learned"),
    L("A transformer is a stack of blocks, each with attention and a feed-forward network.", "Parameters are the weights. Memory for the weights is parameters times bytes per parameter.", "Quantization stores weights with fewer bits, saving memory and increasing speed, at a small cost in quality.", "Text generation is usually limited by memory bandwidth, and the cache grows with the conversation.", "Batching, distillation, mixture of experts and caching reduce cost."),
    P("From the next lesson on we move from understanding models to using them well. First: how to write prompts that give reliable answers."),
  ], [
    { q: 'What does 7B mean in a model name?', a: 'It means about 7 billion parameters, the number of weights in the model. Larger numbers usually mean more capability but also more memory and cost.' },
    { q: 'Does quantization make a model worse?', a: 'Slightly, and the loss grows as you use fewer bits. At 8-bit the change is often tiny. At 4-bit it is usually acceptable for many tasks. Always test your own task to be sure.' },
    { q: 'Why is a long chat slower and more expensive?', a: 'The model must keep and attend to the cache of every earlier token. That uses more memory and more calculation, and many services charge for all input tokens each time.' },
    { q: 'Is a bigger model always better?', a: 'No. A smaller model with better training data can do well on a specific task, and it is cheaper and faster. Choose the smallest model that meets your quality needs after testing.' },
  ], 'llm architecture, transformer blocks, model parameters explained, llm quantization, kv cache, mixture of experts, llm memory requirements'),

  // ------------------------------------------------------------------ 8
  lesson(S3, 'prompt-engineering-basics', 'Prompt Engineering Basics', 'Learn how to write clear prompts with a role, task, context, rules, examples and an output format, and build a prompt builder with a checker.', '', [
    P("A **prompt** is the text you give a model. **Prompt engineering** is the skill of writing prompts so that the model gives answers that are useful, correct and in the shape you need. It sounds fancy, but at its heart it is clear writing. If you can explain a job to a new colleague so that they do it well the first time, you can write good prompts. In this lesson you will learn a simple structure that works for most tasks, see a weak prompt turn into a strong one, and build a prompt builder in the lab that assembles the parts and warns you about common gaps."),

    H("Why prompts matter"),
    P("A model cannot read your mind. It sees only the text you send. If your request is vague, the model fills the gaps with the most likely guess, which may not be what you want. Ask for “a good resume summary” and you will get a generic summary that could be about anybody. Ask for “a two-sentence resume summary for a warehouse supervisor with five years of experience who reduced picking errors by 20 percent, in simple English, with no buzzwords” and the result will fit."),
    P("Prompting is not a trick to fool the model. It is a way to remove guessing. Every detail you add is one less thing the model must invent."),

    H("The six parts of a good prompt"),
    P("Most strong prompts contain some or all of these six parts. You do not need all of them every time. Use the ones that matter for the task."),
    O("**Role.** Who the model should act as. “You are a careful career coach for factory and warehouse workers.” A role sets the tone and the level of detail.", "**Task.** What exactly to do, starting with a verb. “Rewrite the resume bullet below so that it starts with an action verb and shows a result.”", "**Context.** The material to work on, and any background the model needs: the resume text, the job description, the customer email. Put it between clear markers, such as <context> tags, so the model can tell data from instructions.", "**Rules.** The limits: “Do not invent numbers.” “Use simple English.” “Keep it under 25 words.” Rules prevent the most common problems before they happen.", "**Examples.** One to three pairs of input and output that show the style you want. Examples are often the strongest way to communicate a format. Use different examples so that the model does not copy a single one too closely.", "**Output format.** How the answer should look: bullets, a table, a number of sentences, or JSON. If a program will read the answer, the format must be exact (lesson 10)."),

    H("A weak prompt and a strong prompt"),
    P("Weak prompt:"),
    C("text", "Improve this: Responsible for stock and loading at the warehouse"),
    P("The model must guess what “improve” means, who the reader is, how long the result should be, and whether it may add facts. It may add invented numbers or write a long paragraph."),
    P("Strong prompt:"),
    C("text", "You are a careful career coach for factory and warehouse workers.\n\nTask: Rewrite the resume bullet below so it starts with an action verb and shows a result.\n\nContext:\n<context>\nResponsible for stock and loading at the warehouse\n</context>\n\nRules:\n- Do not invent numbers.\n- Use simple English.\n\nExamples:\n<example n=\"1\">\nInput: Did customer calls\nOutput: Handled 40 customer calls a day and solved 90% of issues on the first call\n</example>\n\nOutput format: One bullet under 25 words. No extra text."),
    P("This takes a minute longer to write. But the result is much more predictable, and when it is not right you can see which part to fix. Notice one more detail: the rule “do not invent numbers” sits right next to an example that contains numbers. If the example contains numbers, the model may copy that style and invent some. This kind of clash between rules and examples is a common cause of errors, so read your own prompt the way the model will."),

    H("Habits that make prompts better"),
    L("**Be specific.** Replace words like “good”, “nice”, “some” and “etc” with something you can measure: “three bullets, each under 20 words”.", "**Say what to do, not only what to avoid.** “Write in plain sentences” works better than “don’t be fancy”.", "**Give the reader.** “Explain it for a factory worker who has never used a computer” changes the whole answer.", "**Separate instructions from data.** Use tags or clear markers around pasted text. This also protects you from text that tries to give the model new instructions (lesson 11).", "**Allow “I don’t know”.** Add “If the answer is not in the text, say so.” This reduces made-up answers.", "**Ask for the steps when the task is complex.** For maths or multi-step problems, ask the model to work through the steps before giving the answer. Lesson 9 covers this.", "**Iterate.** Your first prompt is a draft. Run it on several real inputs, find where it fails, and change one thing at a time."),

    H("Zero-shot, one-shot and few-shot"),
    P("A prompt with no examples is called **zero-shot**. One example makes it **one-shot**, and several make it **few-shot**. Start zero-shot with clear instructions. If the format or style is still wrong, add examples. Few-shot prompting is especially helpful for tasks like classification (“positive”, “negative”, “neutral”) and for matching a house style."),

    H("Prompts are not the whole story"),
    P("Prompt engineering has limits. A model cannot know facts it was never given. If you need answers about your own documents, give it those documents (this is called retrieval, covered in the RAG course). If you need a guaranteed format, validate the answer in code. If an answer matters, a person should check it. Good prompts raise the quality, and testing and checking keep it there."),
    BUILD,

    H("Your task: build a prompt builder"),
    P("You will build a page with a form for the six parts of a prompt. As you type, the page assembles the full prompt, estimates its length in tokens, and shows tips about gaps such as a vague task or a missing format."),
    P("**What you will build**"),
    L("A PromptParts type and a buildPrompt function that joins the parts in a clear order and skips empty ones.", "A lint function that returns warnings. Each warning is either a tip or a problem.", "A page with inputs for each part, a live preview, a token estimate (reuse estimateTokens from lesson 6) and a Copy button."),
    P("**Steps**"),
    O("Create lib/prompt.ts and define PromptParts: role, task, context, rules (a list), examples (a list of input and output pairs) and format.", "Write buildPrompt. Start with the role sentence, then Task, then the context inside <context> tags, then the rules as a bullet list, then the examples inside <example> tags, then the output format. Skip any part that is empty.", "Write lint. Add a problem when there is no task. Add tips for a very short task, for vague words like “good” or “some”, for a missing format, for no rules, and for exactly one example. Add a problem when the prompt is extremely long.", "Build the page in pages/prompt-builder.ts with signals for the parts. Compute the prompt, the warnings and the token estimate from them.", "Add a Copy button that uses the clipboard, and handle the case where the browser blocks it."),
    P("**Hints**"),
    L("Test with a good prompt (no warnings) and a bad one (task: “make it good”). The checker should react to both.", "The checker cannot judge quality. It only catches common gaps, so say so on the page.", "Keep the order of the parts the same every time, so you can compare prompts easily.", "Use the starting values from the lesson’s strong prompt to check your output."),
    P("**You know it works when** the preview changes as you type, an empty format field produces a tip, a task like “make it good” produces a tip about vague words, and the copied prompt works in any AI chat."),

    H("Solution"),
    P("The prompt builder and the checker:"),
    F(LAB, 'steps/08/src/app/lib/prompt.ts'),
    P("And the page:"),
    F(LAB, 'steps/08/src/app/pages/prompt-builder.ts'),
    N("Paste your assembled prompt into an AI chat, change one part at a time, and compare the answers. This is the fastest way to learn what each part does."),

    H("What you learned"),
    L("A prompt works best when it removes guesswork: role, task, context, rules, examples and output format.", "Be specific, separate instructions from data, allow “I don’t know”, and iterate.", "Examples are powerful, but watch for clashes between the rules and the examples.", "Prompts raise quality, but testing, validation and human checks keep it reliable."),
    P("In the next lesson you will learn more advanced techniques: step-by-step reasoning, prompt chains, and ways to combine several small prompts."),
  ], [
    { q: 'Do longer prompts always give better results?', a: 'No. A prompt should be as long as it needs to be. Extra, unclear or repeated instructions can confuse the model and cost more. Add only the details that change the answer.' },
    { q: 'Should I say please and thank you to the model?', a: 'It does not matter much for quality. A clear and polite tone is fine, but the facts, the task and the format are what make the difference.' },
    { q: 'What is the difference between zero-shot and few-shot prompting?', a: 'Zero-shot gives only instructions. Few-shot also includes a small number of examples of the input and the output you want, which helps the model copy the format and style.' },
    { q: 'Is prompt engineering a real job?', a: 'Writing and testing good prompts is a real skill, and it is part of many roles, such as developer, analyst and content specialist. Most of it is clear writing, careful testing and knowing what the task needs.' },
  ], 'prompt engineering basics, how to write a good prompt, zero shot few shot prompting, prompt structure role task context format, prompt builder'),
];
