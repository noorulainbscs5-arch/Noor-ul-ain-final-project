export interface SampleNote {
  id: string;
  label: string;
  emoji: string;
  topic: string;
  content: string;
}

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: 'ai-basics',
    label: 'AI Basics Notes',
    emoji: '🤖',
    topic: 'Artificial Intelligence Fundamentals',
    content: `Artificial Intelligence (AI) is the field of computer science focused on building systems that perform tasks normally requiring human intelligence.

Machine Learning (ML) is a subset of AI where algorithms learn patterns from data instead of being explicitly programmed. There are three main paradigms:
1. Supervised Learning — trained on labeled input-output pairs (e.g. classifying emails as spam or not spam).
2. Unsupervised Learning — finds hidden structure in unlabeled data (e.g. customer segmentation via clustering).
3. Reinforcement Learning — an agent learns by receiving rewards or penalties for actions in an environment.

Deep Learning is a subset of ML that uses multi-layer artificial neural networks. The "deep" refers to many hidden layers. Each layer learns increasingly abstract features — early layers detect edges, deeper layers detect objects or concepts.

A Neural Network is composed of neurons (nodes) organized in layers: an input layer, one or more hidden layers, and an output layer. Each connection has a weight that is adjusted during training via backpropagation, which uses gradient descent to minimize a loss function.

Key terminology:
- Training set: the data used to fit the model parameters.
- Validation set: used to tune hyperparameters and prevent overfitting.
- Test set: used only once at the end to evaluate final performance.
- Overfitting: the model memorizes training data and generalizes poorly to new data.
- Underfitting: the model is too simple to capture the underlying pattern.
- Epoch: one full pass through the entire training dataset.
- Batch size: number of samples processed before the model weights are updated.

Gradient Descent is the optimization algorithm that iteratively adjusts weights in the direction that reduces the loss. Learning rate controls the step size — too large diverges, too small converges slowly.

Regularization techniques like L1/L2 penalty and dropout reduce overfitting by discouraging overly complex models or randomly disabling neurons during training.

Transformers, introduced in 2017, rely on the self-attention mechanism and have become the backbone of modern Large Language Models (LLMs) like GPT. Unlike RNNs, transformers process all tokens in parallel, enabling much faster training on GPUs.`,
  },
  {
    id: 'cs-fundamentals',
    label: 'Computer Science Notes',
    emoji: '💻',
    topic: 'Computer Science Fundamentals',
    content: `Computer Science is the study of computation, information, and automation. It spans theory (algorithms, complexity) and practice (software engineering, systems).

Data Structures organize and store data efficiently:
- Array: contiguous memory, O(1) index access, O(n) insertion/deletion in the middle.
- Linked List: nodes linked by pointers, O(1) insertion at known position, O(n) search.
- Stack: Last-In-First-Out (LIFO) — push/pop in O(1).
- Queue: First-In-First-Out (FIFO) — enqueue/dequeue in O(1).
- Hash Table: key-value pairs with average O(1) lookup using a hash function; collisions handled by chaining or open addressing.
- Tree: hierarchical structure; a binary search tree keeps left < root < right for O(log n) operations when balanced.
- Graph: nodes (vertices) connected by edges; can be directed or undirected, weighted or unweighted.

Algorithm Complexity is described with Big-O notation, which expresses how runtime grows as input size n grows:
- O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n) linearithmic, O(n²) quadratic, O(2ⁿ) exponential.

Common algorithms:
- Binary search: halves the search space each step — O(log n) on sorted data.
- Merge sort: divide-and-conquer, stable, guaranteed O(n log n).
- Quick sort: average O(n log n), worst case O(n²), in-place.
- BFS / DFS: graph traversal using a queue (BFS) or stack/recursion (DFS).

The Object-Oriented Programming (OOP) paradigm models software as objects with state (attributes) and behavior (methods). Four core principles:
1. Encapsulation — bundling data with the methods that operate on it, restricting direct access.
2. Abstraction — exposing essential features and hiding implementation details.
3. Inheritance — a subclass reuses and extends a parent class.
4. Polymorphism — the same interface can take different forms (method overriding / overloading).

Software Development Life Cycle (SDLC) phases: Planning, Analysis, Design, Implementation (coding), Testing, Deployment, Maintenance. Agile methodologies (Scrum, Kanban) emphasize iterative delivery, continuous feedback, and working software over comprehensive documentation.

A database is an organized collection of data. Relational databases (SQL) store data in tables with rows and columns and enforce ACID properties: Atomicity, Consistency, Isolation, Durability. NoSQL databases (document, key-value, graph) trade some consistency for horizontal scalability and flexible schemas.`,
  },
  {
    id: 'biology',
    label: 'Cell Biology Notes',
    emoji: '🧬',
    topic: 'Cell Biology',
    content: `The cell is the basic structural and functional unit of all living organisms. The Cell Theory states: all living things are made of cells, cells are the basic unit of life, and all cells come from pre-existing cells.

There are two broad cell types:
1. Prokaryotic cells (bacteria, archaea) — no nucleus, no membrane-bound organelles, circular DNA, typically smaller (1-5 µm).
2. Eukaryotic cells (plants, animals, fungi, protists) — have a true nucleus and membrane-bound organelles, linear DNA in chromosomes, typically larger (10-100 µm).

Key organelles and their functions:
- Nucleus: stores genetic material (DNA), controls cell activities via gene expression.
- Mitochondria: "powerhouse of the cell" — site of cellular respiration, produces ATP through oxidative phosphorylation. Has its own DNA (evidence for endosymbiotic theory).
- Ribosomes: synthesize proteins by translating mRNA. Found free in cytoplasm or attached to rough ER.
- Endoplasmic Reticulum (ER): Rough ER has ribosomes and folds proteins; Smooth ER synthesizes lipids and detoxifies.
- Golgi apparatus: modifies, sorts, and packages proteins and lipids for secretion or delivery.
- Lysosomes: contain digestive enzymes that break down waste and foreign material.
- Chloroplasts (plant cells): site of photosynthesis — convert light energy into chemical energy (glucose). Also have their own DNA.
- Cell membrane: phospholipid bilayer with embedded proteins; selectively permeable, controls what enters and exits.

Cellular respiration is the process that converts glucose and oxygen into ATP, water, and CO₂. Its three stages are glycolysis (cytoplasm, produces 2 ATP), the Krebs cycle (mitochondrial matrix), and the electron transport chain (inner mitochondrial membrane, produces ~32-34 ATP). Overall equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP.

Photosynthesis occurs in chloroplasts and converts light energy, CO₂, and water into glucose and oxygen. Light-dependent reactions happen in the thylakoid membranes; the Calvin cycle happens in the stroma. Overall equation: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂.

The cell cycle has phases: G1 (growth), S (DNA synthesis), G2 (more growth), and M (mitosis — division of the nucleus) followed by cytokinesis. Mitosis produces two genetically identical diploid daughter cells. Meiosis produces four genetically different haploid gametes and is the basis of sexual reproduction and genetic variation.`,
  },
];
