import type { Difficulty, Quiz, QuizQuestion, QuizLength } from './types';

/* ------------------------------------------------------------------ */
/* Topic-keyed pre-built question banks for the sample notes.         */
/* These make the app work 100% reliably with zero setup.             */
/* ------------------------------------------------------------------ */

interface BankQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface QuestionBank {
  match: string[]; // lowercase substrings used to detect the topic
  easy: BankQuestion[];
  medium: BankQuestion[];
  hard: BankQuestion[];
}

const BANKS: QuestionBank[] = [
  {
    match: ['artificial intelligence', 'machine learning', 'neural network', 'deep learning', ' ai ', 'ml ', 'supervised', 'transformer'],
    easy: [
      {
        question: 'What is the defining characteristic of Machine Learning?',
        options: [
          'It uses explicit if-then rules written by programmers',
          'Algorithms learn patterns from data instead of being explicitly programmed',
          'It always requires a quantum computer to run',
          'It can only process numeric data',
        ],
        correctIndex: 1,
        explanation:
          'Machine Learning is a subset of AI in which algorithms learn patterns from data rather than being explicitly programmed with rules. The model improves its predictions as it sees more data.',
      },
      {
        question: 'Which learning paradigm trains on labeled input-output pairs?',
        options: [
          'Unsupervised Learning',
          'Reinforcement Learning',
          'Supervised Learning',
          'Self-supervised Learning',
        ],
        correctIndex: 2,
        explanation:
          'Supervised Learning uses labeled examples (input → known output) so the model learns the mapping. Classifying emails as spam/not-spam is a classic supervised task.',
      },
      {
        question: 'The "deep" in Deep Learning refers to…',
        options: [
          'The depth of the dataset used',
          'The number of hidden layers in a neural network',
          'How deeply the model understands language',
          'The size of the output layer only',
        ],
        correctIndex: 1,
        explanation:
          'Deep Learning uses multi-layer (many hidden layers) neural networks. The "deep" refers to the depth of the network — each layer learns increasingly abstract features.',
      },
      {
        question: 'What does an epoch represent?',
        options: [
          'One update of the model weights',
          'One full pass through the entire training dataset',
          'A single training example',
          'The final evaluation of the model',
        ],
        correctIndex: 1,
        explanation:
          'An epoch is one complete pass through the entire training dataset. Within an epoch the data is usually split into many batches, each of which triggers a weight update.',
      },
    ],
    medium: [
      {
        question: 'Overfitting is best described as…',
        options: [
          'The model is too simple to capture the pattern in the data',
          'The model memorizes training data and generalizes poorly to new data',
          'The model trains too slowly',
          'The loss function never decreases',
        ],
        correctIndex: 1,
        explanation:
          'Overfitting happens when a model fits the training data — including its noise — so closely that it performs poorly on unseen data. Underfitting (option A) is the opposite: the model is too simple.',
      },
      {
        question: 'Which set is used to tune hyperparameters and prevent overfitting?',
        options: ['Training set', 'Validation set', 'Test set', 'Production set'],
        correctIndex: 1,
        explanation:
          'The validation set is used during development to tune hyperparameters and monitor for overfitting. The test set is held out and used only once at the very end to estimate real-world performance.',
      },
      {
        question: 'What is the role of the learning rate in gradient descent?',
        options: [
          'It determines the number of layers in the network',
          'It controls the step size of each weight update',
          'It sets the size of the training dataset',
          'It decides which activation function is used',
        ],
        correctIndex: 1,
        explanation:
          'The learning rate controls how large each weight update is. Too large and training diverges; too small and it converges very slowly. It is one of the most important hyperparameters.',
      },
      {
        question: 'How do Transformers differ from RNNs?',
        options: [
          'Transformers can only process images',
          'Transformers process all tokens in parallel rather than sequentially',
          'Transformers do not use any weights',
          'Transformers require labels for every token',
        ],
        correctIndex: 1,
        explanation:
          'Transformers use the self-attention mechanism to process all tokens in parallel, which is much faster on GPUs than RNNs that process tokens one at a time sequentially. This is why they scale to train Large Language Models.',
      },
      {
        question: 'Which technique helps reduce overfitting by randomly disabling neurons during training?',
        options: ['Batch normalization', 'Dropout', 'Pooling', 'One-hot encoding'],
        correctIndex: 1,
        explanation:
          'Dropout randomly disables a fraction of neurons during each training step, forcing the network to learn redundant representations and reducing reliance on any single neuron — a strong regularizer against overfitting.',
      },
    ],
    hard: [
      {
        question: 'A model has high training accuracy but low test accuracy. The most likely diagnosis is…',
        options: [
          'Underfitting — increase model complexity',
          'Overfitting — add regularization or get more data',
          'A bug in the test set labels',
          'The learning rate is too small',
        ],
        correctIndex: 1,
        explanation:
          'High training accuracy with low test accuracy is the textbook signature of overfitting: the model has memorized the training data instead of learning generalizable patterns. Remedies include regularization (L1/L2, dropout) and collecting more training data.',
      },
      {
        question: 'Which is NOT a valid way to handle hash-table collisions?',
        options: [
          'Separate chaining with linked lists',
          'Open addressing with linear probing',
          'Doubling the learning rate',
          'Open addressing with quadratic probing',
        ],
        correctIndex: 2,
        explanation:
          'Separate chaining and open addressing (linear or quadratic probing) are standard collision-resolution strategies. The learning rate is a machine-learning hyperparameter and has nothing to do with hash tables, so option C is the odd one out.',
      },
      {
        question: 'Why does the mitochondrion having its own DNA support the endosymbiotic theory?',
        options: [
          'It proves mitochondria are the largest organelle',
          'Mitochondria can only exist in plant cells',
          'It suggests mitochondria were once free-living prokaryotes engulfed by a host cell',
          'It shows mitochondria produce oxygen',
        ],
        correctIndex: 2,
        explanation:
          'Mitochondria possess their own circular DNA and ribosomes resembling those of bacteria. This strongly supports endosymbiotic theory: an ancestral eukaryotic cell engulfed a prokaryote that evolved into the modern mitochondrion.',
      },
      {
        question: 'In a neural network, backpropagation is best described as…',
        options: [
          'A way to initialize weights randomly',
          'An algorithm that propagates the error gradient backward to update weights via gradient descent',
          'A technique for increasing the dataset size',
          'A method to convert a model to run on edge devices',
        ],
        correctIndex: 1,
        explanation:
          'Backpropagation computes the gradient of the loss with respect to each weight by applying the chain rule from the output layer backward through the network. Those gradients are then used by gradient descent to update the weights.',
      },
    ],
  },
  {
    match: ['computer science', 'data structure', 'algorithm', 'big-o', 'binary search', 'oop', 'object-oriented', 'database', 'sql'],
    easy: [
      {
        question: 'Which data structure follows Last-In-First-Out (LIFO) order?',
        options: ['Queue', 'Stack', 'Array', 'Tree'],
        correctIndex: 1,
        explanation:
          'A stack is LIFO — the last element pushed is the first one popped. Think of a stack of plates: you add and remove from the top. A queue is FIFO by contrast.',
      },
      {
        question: 'What is the time complexity of accessing an element by index in an array?',
        options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'],
        correctIndex: 2,
        explanation:
          'Arrays store elements in contiguous memory, so the address of any index can be computed directly (base + index × size). This makes indexed access a constant-time O(1) operation.',
      },
      {
        question: 'Which data structure is First-In-First-Out (FIFO)?',
        options: ['Stack', 'Queue', 'Heap', 'Hash Map'],
        correctIndex: 1,
        explanation:
          'A queue is FIFO — the first element enqueued is the first one dequeued, like a line at a counter. Stacks are LIFO instead.',
      },
      {
        question: 'What does encapsulation mean in Object-Oriented Programming?',
        options: [
          'A subclass reusing a parent class',
          'Bundling data with the methods that operate on it and restricting direct access',
          'The same interface taking different forms',
          'Hiding the entire program from the user',
        ],
        correctIndex: 1,
        explanation:
          'Encapsulation bundles an object\'s state (attributes) with the methods that operate on it and restricts outside access (e.g. private fields with public getters/setters), protecting internal integrity.',
      },
    ],
    medium: [
      {
        question: 'What is the average-case time complexity of binary search on a sorted array?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctIndex: 2,
        explanation:
          'Binary search halves the remaining search space on each comparison, so the number of steps grows logarithmically with n — O(log n). It only works on sorted data.',
      },
      {
        question: 'Which sorting algorithm has a worst-case time complexity of O(n²) but is in-place on average?',
        options: ['Merge sort', 'Quick sort', 'Counting sort', 'Bubble sort only'],
        correctIndex: 1,
        explanation:
          'Quick sort averages O(n log n) but degrades to O(n²) when pivot choices are poor (e.g. already-sorted data with a naive pivot). It is in-place, unlike merge sort which needs O(n) extra space.',
      },
      {
        question: 'What do the ACID properties guarantee in a relational database?',
        options: [
          'Atomicity, Consistency, Isolation, Durability',
          'Accuracy, Concurrency, Indexing, Distribution',
          'Atomicity, Caching, Isolation, Deduplication',
          'Availability, Consistency, Integration, Durability',
        ],
        correctIndex: 0,
        explanation:
          'ACID = Atomicity (all-or-nothing transactions), Consistency (valid state to valid state), Isolation (concurrent transactions don\'t interfere), Durability (committed data survives crashes). These are the cornerstone guarantees of relational databases.',
      },
      {
        question: 'Which is NOT one of the four core principles of OOP?',
        options: [
          'Encapsulation',
          'Inheritance',
          'Compilation',
          'Polymorphism',
        ],
        correctIndex: 2,
        explanation:
          'The four pillars of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism. Compilation is a build step unrelated to OOP design principles, so it is the odd one out.',
      },
      {
        question: 'A hash table provides average O(1) lookup. What handles the case when two keys hash to the same slot?',
        options: [
          'The table is automatically resized to infinity',
          'Collision handling such as chaining or open addressing',
          'The duplicate key is silently deleted',
          'Lookup degrades to O(n²) permanently',
        ],
        correctIndex: 1,
        explanation:
          'Collisions (two keys mapping to the same bucket) are resolved with chaining (a linked list per bucket) or open addressing (probe for the next free slot). With a good hash function and load factor, average lookup stays O(1).',
      },
    ],
    hard: [
      {
        question: 'Which statement about BFS and DFS on an unweighted graph is correct?',
        options: [
          'BFS uses a stack; DFS uses a queue',
          'BFS finds the shortest path in terms of number of edges; DFS does not guarantee this',
          'DFS always visits fewer nodes than BFS',
          'BFS can only be implemented recursively',
        ],
        correctIndex: 1,
        explanation:
          'BFS explores level by level using a queue, so on an unweighted graph it finds the shortest path in edge count. DFS uses a stack/recursion and explores deep first, so it does not guarantee the shortest path.',
      },
      {
        question: 'You need guaranteed O(n log n) sorting with stability. Which algorithm fits best?',
        options: ['Quick sort', 'Merge sort', 'Selection sort', 'Insertion sort'],
        correctIndex: 1,
        explanation:
          'Merge sort is divide-and-conquer, stable, and guaranteed O(n log n) in all cases. Quick sort is not stable and can hit O(n²); selection and insertion sorts are O(n²).',
      },
      {
        question: 'A recursive function with no base case most directly causes…',
        options: [
          'A syntax error at compile time',
          'Infinite recursion leading to a stack overflow',
          'The function to return 0 immediately',
          'An automatic conversion into a loop',
        ],
        correctIndex: 1,
        explanation:
          'Without a base case, the recursive calls never stop. Each call consumes a stack frame, so the program eventually hits the call-stack limit and throws a stack-overflow error (in Python, RecursionError).',
      },
      {
        question: 'In the cell cycle, which correctly orders the phases?',
        options: [
          'M → S → G1 → G2',
          'G1 → S → G2 → M',
          'S → G1 → M → G2',
          'G2 → G1 → S → M',
        ],
        correctIndex: 1,
        explanation:
          'Interphase consists of G1 (growth), S (DNA synthesis), then G2 (more growth), followed by the M phase (mitosis + cytokinesis). The correct order is G1 → S → G2 → M.',
      },
    ],
  },
  {
    match: ['cell', 'biology', 'mitochondria', 'photosynthesis', 'organelle', 'respiration', 'mitosis', 'membrane'],
    easy: [
      {
        question: 'Which organelle is known as the "powerhouse of the cell"?',
        options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Golgi apparatus'],
        correctIndex: 1,
        explanation:
          'Mitochondria produce ATP through cellular respiration — the cell\'s usable energy currency — earning them the nickname "powerhouse of the cell."',
      },
      {
        question: 'Which type of cell has NO nucleus and NO membrane-bound organelles?',
        options: ['Plant cell', 'Animal cell', 'Prokaryotic cell', 'Eukaryotic cell'],
        correctIndex: 2,
        explanation:
          'Prokaryotic cells (bacteria and archaea) lack a true nucleus and membrane-bound organelles; their DNA is circular and free in the cytoplasm. Eukaryotic cells (plants, animals, fungi) have both.',
      },
      {
        question: 'Where are proteins synthesized in a cell?',
        options: ['Lysosomes', 'Ribosomes', 'Vacuoles', 'Chloroplasts'],
        correctIndex: 1,
        explanation:
          'Ribosomes translate mRNA into proteins. They may float freely in the cytoplasm or attach to the rough endoplasmic reticulum.',
      },
      {
        question: 'What is the overall equation for cellular respiration?',
        options: [
          '6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂',
          'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
          'C₆H₁₂O₆ → 2 lactate + ATP',
          '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
        ],
        correctIndex: 1,
        explanation:
          'Cellular respiration converts glucose and oxygen into carbon dioxide, water, and ATP: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP. Option A is the photosynthesis equation.',
      },
    ],
    medium: [
      {
        question: 'Which organelle is the site of photosynthesis in plant cells?',
        options: ['Mitochondrion', 'Chloroplast', 'Nucleus', 'Ribosome'],
        correctIndex: 1,
        explanation:
          'Chloroplasts contain chlorophyll and are the site of photosynthesis. Light-dependent reactions occur in the thylakoid membranes; the Calvin cycle occurs in the stroma.',
      },
      {
        question: 'The three stages of cellular respiration, in order, are…',
        options: [
          'Krebs cycle → glycolysis → electron transport chain',
          'Glycolysis → Krebs cycle → electron transport chain',
          'Electron transport chain → glycolysis → Krebs cycle',
          'Glycolysis → electron transport chain → Krebs cycle',
        ],
        correctIndex: 1,
        explanation:
          'Respiration begins with glycolysis in the cytoplasm (2 ATP), then the Krebs cycle in the mitochondrial matrix, then the electron transport chain on the inner mitochondrial membrane (~32-34 ATP).',
      },
      {
        question: 'How does mitosis differ from meiosis?',
        options: [
          'Mitosis produces four haploid gametes; meiosis produces two identical diploid cells',
          'Mitosis produces two genetically identical diploid cells; meiosis produces four genetically different haploid gametes',
          'Both produce identical haploid cells',
          'Mitosis only occurs in prokaryotes',
        ],
        correctIndex: 1,
        explanation:
          'Mitosis (one division) yields two genetically identical diploid daughter cells for growth and repair. Meiosis (two divisions) yields four genetically varied haploid gametes for sexual reproduction.',
      },
      {
        question: 'Which is NOT a function of the Golgi apparatus?',
        options: [
          'Modifying proteins',
          'Sorting and packaging proteins for secretion',
          'Synthesizing ATP via oxidative phosphorylation',
          'Forming lysosomes',
        ],
        correctIndex: 2,
        explanation:
          'The Golgi apparatus modifies, sorts, and packages proteins and lipids and helps form lysosomes. ATP synthesis via oxidative phosphorylation happens in the mitochondria, not the Golgi.',
      },
      {
        question: 'Why is the cell membrane described as "selectively permeable"?',
        options: [
          'It lets all substances pass freely',
          'It controls which substances enter and exit the cell',
          'It is completely impermeable to everything',
          'It only allows water to pass',
        ],
        correctIndex: 1,
        explanation:
          'The phospholipid bilayer with embedded proteins controls the movement of substances in and out of the cell — some cross freely (small nonpolar molecules), others require transport proteins or active transport.',
      },
    ],
    hard: [
      {
        question: 'A student claims mitochondria and chloroplasts evolved from free-living prokaryotes. Which evidence best supports this?',
        options: [
          'Both are found only in animal cells',
          'Both have their own circular DNA and ribosomes resembling bacteria',
          'Both are the largest organelles in any cell',
          'Both produce glucose directly from sunlight',
        ],
        correctIndex: 1,
        explanation:
          'Mitochondria and chloroplasts each have their own circular DNA and 70S ribosomes similar to bacteria, and they reproduce by binary fission. This is the key evidence for endosymbiotic theory.',
      },
      {
        question: 'In which cellular location does glycolysis take place?',
        options: [
          'Mitochondrial matrix',
          'Cytoplasm',
          'Inner mitochondrial membrane',
          'Thylakoid membrane',
        ],
        correctIndex: 1,
        explanation:
          'Glycolysis occurs in the cytoplasm and does not require mitochondria or oxygen. It splits glucose into two pyruvate molecules, yielding a net 2 ATP. The later stages (Krebs, ETC) occur inside the mitochondrion.',
      },
      {
        question: 'Which correctly pairs the cell-cycle phase with its event?',
        options: [
          'G1 — DNA synthesis',
          'S — division of the nucleus',
          'G2 — growth and preparation for mitosis',
          'M — replication of DNA',
        ],
        correctIndex: 2,
        explanation:
          'G1 is growth, S is DNA synthesis (replication), G2 is further growth and preparation for division, and M is mitosis (nuclear division) followed by cytokinesis. Only the G2 pairing is correct.',
      },
      {
        question: 'Which statement about the light-dependent and Calvin cycle reactions is accurate?',
        options: [
          'Both occur in the stroma',
          'Light-dependent reactions occur in the thylakoid membranes; the Calvin cycle occurs in the stroma',
          'The Calvin cycle directly produces oxygen',
          'Light-dependent reactions do not require light',
        ],
        correctIndex: 1,
        explanation:
          'Light-dependent reactions happen in the thylakoid membranes and capture light energy (producing O₂ as a byproduct). The Calvin cycle happens in the stroma and uses that energy to fix CO₂ into glucose — it does not produce oxygen.',
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Generic fallback: builds questions from ANY pasted notes by        */
/* extracting sentence-like statements and turning them into          */
/* fill-in / definition style questions.                              */
/* ------------------------------------------------------------------ */

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, n);
}

function splitSentences(text: string): string[] {
  // Split on whitespace that follows a sentence-ending punctuation and precedes
  // a capital letter or digit. Avoids lookbehind (not supported in ES5 target).
  const raw = text.replace(/\s+/g, ' ');
  const result: string[] = [];
  let buf = '';
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    buf += ch;
    if (ch === '.' || ch === '!' || ch === '?') {
      // peek ahead: if next non-space starts an uppercase/digit, treat as boundary
      let j = i + 1;
      while (j < raw.length && raw[j] === ' ') j++;
      const next = raw[j] || '';
      if (next && /[A-Z0-9]/.test(next)) {
        result.push(buf.trim());
        buf = '';
        i = j - 1; // skip the spaces; loop will land on next token char
      }
    }
  }
  if (buf.trim()) result.push(buf.trim());
  return result.filter(
    (s) => s.split(' ').length >= 4 && s.length <= 220
  );
}

function emphasizeWord(sentence: string): string | null {
  // pick a capitalized or key term to blank out
  const words = sentence.split(' ');
  const candidates = words
    .map((w, i) => ({ w: w.replace(/[^A-Za-z0-9'-]/g, ''), i }))
    .filter(
      ({ w }, i) =>
        w.length >= 4 &&
        /^[A-Za-z]/.test(w) &&
        // avoid common filler words
        !['that', 'this', 'with', 'which', 'their', 'there', 'these', 'those', 'they', 'have', 'from', 'into', 'such', 'when', 'where', 'while'].includes(
          w.toLowerCase()
        ) &&
        // prefer words that appear capitalized or are likely terms
        (w[0] === w[0].toUpperCase() || /[A-Z]/.test(words[i]))
    );
  if (candidates.length === 0) return null;
  const chosen = candidates[Math.floor(Math.random() * candidates.length)];
  return chosen.w;
}

function genericQuestions(
  notes: string,
  difficulty: Difficulty,
  count: number
): BankQuestion[] {
  const sentences = splitSentences(notes);
  if (sentences.length === 0) {
    return [
      {
        question:
          'PrepIQ could not extract clear statements from these notes. Which is the best next step?',
        options: [
          'Paste more detailed notes with full sentences',
          'Delete the app',
          'Only use one-word notes',
          'Switch off the computer',
        ],
        correctIndex: 0,
        explanation:
          'The generator works best on notes written in complete sentences. Paste a few sentences containing definitions or facts and PrepIQ will turn them into a quiz.',
      },
    ];
  }

  const pool = sentences.slice(0, Math.min(sentences.length, 20));
  const questions: BankQuestion[] = [];

  for (const sentence of pool) {
    if (questions.length >= count) break;
    const term = emphasizeWord(sentence);
    if (!term) continue;

    const blanked = sentence.replace(
      new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      '_____'
    );
    if (blanked === sentence) continue; // nothing replaced

    // build distractors from other emphasized words in the notes
    const distractorPool = shuffle(
      Array.from(
        new Set(
          pool
            .map(emphasizeWord)
            .filter(
              (w): w is string =>
                !!w && w.toLowerCase() !== term.toLowerCase()
            )
        )
      )
    ).slice(0, 3);

    // if not enough distractors, pad with generic placeholders
    const genericPool = ['process', 'structure', 'function', 'system', 'method', 'concept'];
    let gi = 0;
    while (distractorPool.length < 3 && gi < genericPool.length) {
      if (
        !distractorPool.includes(genericPool[gi]) &&
        genericPool[gi].toLowerCase() !== term.toLowerCase()
      ) {
        distractorPool.push(genericPool[gi]);
      }
      gi++;
    }

    const options = shuffle([term, ...distractorPool]).slice(0, 4);
    // pad if fewer than 4
    while (options.length < 4) options.push(`Choice ${options.length + 1}`);
    const correctIndex = options.findIndex(
      (o) => o.toLowerCase() === term.toLowerCase()
    );
    if (correctIndex === -1) continue;

    const question =
      difficulty === 'hard'
        ? `Fill in the blank and explain why: ${blanked}`
        : `Fill in the blank: ${blanked}`;

    questions.push({
      question,
      options,
      correctIndex,
      explanation: `The missing term is "${term}". The full statement is: "${sentence}"${
        difficulty === 'hard'
          ? '. The other options do not fit the definition conveyed in the notes.'
          : '.'
      }`,
    });
  }

  return questions;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function mockGenerateQuiz(
  notes: string,
  difficulty: Difficulty,
  count: QuizLength
): Quiz {
  const lower = ` ${notes.toLowerCase()} `;
  const bank =
    BANKS.find((b) => b.match.some((m) => lower.includes(m))) || null;

  let chosen: BankQuestion[];

  if (bank) {
    const pool = bank[difficulty];
    // if the bank doesn't have enough for this difficulty, top up from other difficulties
    chosen = pick(pool, count);
    if (chosen.length < count) {
      const extra = pick(
        [...bank.easy, ...bank.medium, ...bank.hard].filter(
          (q) => !chosen.includes(q)
        ),
        count - chosen.length
      );
      chosen = [...chosen, ...extra];
    }
  } else {
    chosen = genericQuestions(notes, difficulty, count);
  }

  const questions: QuizQuestion[] = chosen.slice(0, count).map((q, i) => ({
    id: i + 1,
    question: q.question,
    options: q.options.slice(0, 4),
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  }));

  const topic = bank ? inferTopic(lower) : 'Your Notes';

  return {
    id: crypto.randomUUID(),
    title: `${topic} — ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz`,
    topic,
    difficulty,
    questions,
    createdAt: Date.now(),
    source: 'mock',
  };
}

function inferTopic(lower: string): string {
  if (lower.includes('artificial intelligence') || lower.includes('machine learning'))
    return 'AI Fundamentals';
  if (lower.includes('computer science') || lower.includes('data structure'))
    return 'CS Fundamentals';
  if (lower.includes('cell') || lower.includes('biology') || lower.includes('mitochondria'))
    return 'Cell Biology';
  return 'Your Notes';
}
