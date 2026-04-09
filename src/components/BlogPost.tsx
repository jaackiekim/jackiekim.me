import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NYCTransitPost from './NYCTransitPost';
import MedicationExtractionPost from './MedicationExtractionPost';

const medicationExtractionPost = `
Aggregate F1 scores are comfortable. They give you one number, you compare it to another number, and you make a decision. The problem is they can hide failures that matter a lot while averaging in successes that don't.

I ran an experiment to see how bad that hiding can get. I compared five medication extraction configurations on clinical notes: a regex + RxNorm rule-based baseline, GPT-4o (zero-shot and few-shot), and BioMistral-7B-DARE (zero-shot and few-shot), a domain-adapted open biomedical language model. Three drug classes: standard oral medications (metformin, lisinopril, that whole crowd), oncology/chemotherapy agents, and PRN (as-needed) medications.

The aggregate numbers looked reasonable. The stratified results were a different situation entirely.

## What I Was Measuring

Clinical medication extraction is a named entity recognition task: given a clinical note, pull out the drug names and their associated doses. Sounds manageable until you read an actual oncology note and see the dose listed as "carboplatin AUC 5."

(That means the dose is calculated based on a target area under the curve rather than a flat milligram amount. Oncology dosing has its own internal logic.)

Two metrics per system, per drug class:

- **Drug F1**: did you find the drug name?
- **Strength F1**: did you get the dose right?

I broke both down by drug class deliberately, because aggregate metrics were exactly what I was skeptical of.

## The Numbers That Look Reassuring

Aggregate Drug F1 across the three systems:

| Model | Overall Drug F1 |
|---|---|
| Regex + RxNorm | 0.739 |
| GPT-4o zero-shot | 0.755 |
| GPT-4o few-shot | 0.627 |
| BioMistral zero-shot | 0.343† |
| BioMistral few-shot | 0.342† |

*† BioMistral recall is underestimated due to output truncation — see below.*

GPT-4o zero-shot leads overall. Read this table and you might conclude the interesting story is the GPT-4o vs BioMistral gap. It isn't.

## What the Breakdown Actually Shows

Drug F1 by drug class:

| Drug Class | Regex | GPT-4o ZS | GPT-4o FS | BioMistral ZS | BioMistral FS |
|---|---|---|---|---|---|
| Standard | 0.948 | 0.904 | 0.834 | 0.516 | 0.511 |
| **Oncology** | **0.643** | **0.463** | **0.278** | **0.197** | **0.092** |
| PRN | 0.828 | 0.846 | 0.789 | 0.409 | 0.381 |

The oncology row is the finding. Every system collapses on oncology relative to its performance everywhere else. The best oncology F1 in the entire comparison is the regex baseline at 0.643 — and that still means the system fails to extract more than a third of oncology drug mentions. Standard and PRN performance, which runs 0.511 to 0.948, is what pulls the oncology failure back up into the aggregate average.

Standard and PRN medications are doing fine across the board. That performance is exactly what obscures the oncology problem in aggregate numbers.

## Why Each System Fails, and Why the Reasons Matter

All three systems fail on oncology. But they fail differently, and that distinction has real implications for what you'd do about it.

**Regex + RxNorm** fails on drug detection because chemotherapy agents are underrepresented in RxNorm's ingredient and brand name vocabulary. The extractor matches text against that vocabulary. If the drug isn't there (and many chemo agents, biosimilars, and regimen abbreviations aren't), it gets missed. The dose patterns for AUC and BSA-based mg/m² are actually in the regex library. The bottleneck is getting to the dose when the drug name match fails upstream.

**GPT-4o zero-shot** does better on drug detection. It recognizes chemo drug names from pretraining. But it breaks down on dose normalization. AUC-based dosing is specific to a small number of drugs and rarely shows up in general pretraining text. So it finds "carboplatin" but returns "450 mg" instead of "AUC 5." It got a number from somewhere, probably a BSA calculation buried in the note, but lost the unit that makes the dose interpretable.

**GPT-4o few-shot** is the most counterintuitive result. Adding five examples makes it *worse*, specifically on recall (0.610 to 0.460). Precision stays high, meaning what it extracts checks out, but it misses substantially more drugs overall. All five in-context examples came from structured medication list sections of notes. Those look like this:

\`\`\`
1. Metformin 500 mg twice daily
2. Lisinopril 10 mg daily
3. Atorvastatin 40 mg at bedtime
\`\`\`

The model latched onto that format. Drugs mentioned in running prose, like "the patient was continued on carboplatin AUC 5 per the oncology team's recommendation," got skipped because they don't match what the examples looked like. This isn't few-shot prompting failing as a technique. It's an example selection problem. If you want the model to extract from narrative prose, you have to show it narrative prose.

## Why This Matters Beyond the Benchmark

Medication extraction outputs get used to build study cohorts. If you're running a real-world evidence study on chemotherapy-exposed patients, you're probably relying on extracted medication data to define who those patients are.

A system with Drug F1 = 0.14 on oncology agents isn't adding noise to your cohort. It's systematically undercounting it. The patients most likely to be missed are those whose documentation is most complex. Complex documentation tracks with complex disease. Complex disease tracks with worse outcomes. You've introduced selection bias at the data layer, and it won't show up anywhere in your aggregate extraction metrics.

Epidemiologists call this differential misclassification. The bias doesn't average out with more data.

The question to ask before using any extraction system isn't "what's the F1 score." It's "for this drug class and this specific analysis, is this system's error rate acceptable?" A system with Oncology Strength F1 = 0.276 might be workable for rough cohort size estimates. It is not workable for dosing-dependent analyses. Aggregate F1 can't tell you which situation you're in.

## Precision and Recall Tell Different Stories

The aggregate F1 numbers obscure the most important pattern. Looking at oncology precision and recall separately across all five configurations:

| Model | Oncology Precision | Oncology Recall |
|---|---|---|
| Regex | 1.000 | 0.474 |
| GPT-4o zero-shot | 1.000 | 0.301 |
| GPT-4o few-shot | 0.547 | 0.186 |
| BioMistral zero-shot | 1.000 | 0.109 |
| BioMistral few-shot | 0.444 | 0.051 |

Three of five configurations achieve perfect oncology precision — when they extract an oncology drug, they're always right. The failure is entirely on the recall side. Regex finds fewer than half. GPT-4o zero-shot finds fewer than a third. BioMistral zero-shot finds roughly one in ten.

This asymmetry matters for downstream use. Precision failures are visible — a reviewer sees the wrong extraction. Recall failures are invisible — no one sees the drug that was never extracted. In a cohort construction pipeline, invisible failures are the dangerous ones.

## Adding BioMistral to the Picture

BioMistral-7B-DARE is a Mistral-7B base model further pretrained on PubMed biomedical literature, then fine-tuned for instruction following. The hypothesis going in was that domain-specific pretraining would help on clinical text — that a model shaped by biomedical literature would recognize clinical drug patterns better than a general-purpose model.

The overall F1 numbers (0.343 zero-shot, 0.342 few-shot) look much worse than GPT-4o. But the raw comparison isn't fair. BioMistral was run with a 512-token output limit due to compute constraints on a free-tier GPU. Discharge summaries with many medications generate JSON output that hits this limit mid-response, producing truncated output that can't be parsed. Approximately 11% of notes produced empty extractions for this reason. The underlying recall is higher than the numbers show.

The precision numbers tell the real story: BioMistral zero-shot achieves 1.000 oncology precision — identical to GPT-4o zero-shot. When it extracts an oncology drug, it's always right. The model recognizes clinical drug names correctly. The failure is generation budget, not model capability. The BioMistral numbers are a lower bound on actual performance.

What BioMistral does reveal is an instruction-following gap. The base BioMistral-7B model failed entirely on real clinical notes — it continued the clinical narrative rather than producing JSON. DARE, the instruction-tuned variant, followed the JSON format reliably on notes within the token budget. This is itself a finding: domain pretraining without instruction tuning is insufficient for structured extraction tasks. You need both.

## The Full Picture

Five configurations, all evaluated on the same 202 n2c2 test notes:

| Model | Overall F1 | Oncology F1 | Oncology Recall |
|---|---|---|---|
| Regex + RxNorm | 0.739 | 0.643 | 0.474 |
| GPT-4o zero-shot | 0.755 | 0.463 | 0.301 |
| GPT-4o few-shot | 0.627 | 0.278 | 0.186 |
| BioMistral zero-shot | 0.343† | 0.197† | 0.109† |
| BioMistral few-shot | 0.342† | 0.092† | 0.051† |

*† BioMistral recall is underestimated due to output truncation. These are lower bounds.*

The best oncology recall in the entire comparison is the regex baseline at 0.474. No configuration achieves acceptable performance on oncology drug detection. That's the finding. The aggregate numbers, which span 0.342 to 0.755, suggest a wide performance gap between systems. The oncology recall numbers, which span 0.051 to 0.474, tell a different story: every system fails on the drug class where failure matters most.

## The More Tractable Fixes

The few-shot example selection problem is fixable. All five current examples are structured medication lists. A better set samples from narrative prose sections, includes at least one oncology note with AUC dosing in running text, and checks that the example distribution matches the note types in the target corpus.

The BioMistral truncation problem is fixable — increasing the output token budget to 1024 would recover most of the truncated extractions.

Neither fix addresses the structural finding: oncology recall is limited across all current approaches because chemotherapy documentation is systematically harder — denser, more narrative, with non-standard dosing notation — than the general medication documentation these systems were designed around. Aggregate F1 hides that entirely.

![Five-model comparison: Drug F1 and Recall by subgroup](/fig_full_comparison.png)

Code, evaluation framework, and full results: [github.com/jaackiekim/clinical-med-extraction](https://github.com/jaackiekim/clinical-med-extraction)

---

*All five configurations were evaluated on n2c2 2018 Track 2 (202 test notes, 10,575 drug mentions). BioMistral-7B-DARE was run in 4-bit NF4 quantization on a T4 GPU with max_new_tokens=512.*
`;

const posts: Record<string, { title: string; date: string; content?: string; useMarkdown?: boolean; component?: React.ComponentType }> = {
  'minitorch-pytorch-from-scratch': {
    title: 'What I Learned Building PyTorch from Scratch',
    date: 'March 12, 2026',
    useMarkdown: true,
    content: `*Machine Learning Engineering, Cornell Tech, taught by Sasha Rush (Hugging Face)*

Before I took this class, \`loss.backward()\` was magic. I knew, abstractly, that PyTorch walked backward through some kind of graph and computed gradients. I could not have told you what that graph looked like, how it got built, or what happened when it had cycles or shared nodes. I used it every day. I had no idea what it was doing.

The course is called MiniTorch. Over five modules, you rebuild the core of PyTorch in pure Python. Automatic differentiation, tensors with broadcasting, GPU-style parallel operators, and convolutional neural networks. You do not read a textbook. You fill in function signatures and make the unit tests pass. The first time a test goes green is the first time you actually understand what you were doing.

This is a post about the parts that stuck with me.

## Autodiff is a graph, not a derivative

The thing that surprised me most in the entire course was the autodiff module. I started it expecting to implement the chain rule. The chain rule is the easy part. Writing the formula for the derivative of a composed function is a line of math. The hard part is the bookkeeping around it.

When you compute a function like \`loss = (a * b) + (a * c)\`, the variable \`a\` appears twice. Backpropagation has to accumulate the gradient flowing back through both paths. If you just walk the graph and assign, you overwrite. If you walk it in the wrong order, you compute with stale values. And if you recurse naively on a graph with shared nodes, you do exponential work.

What actually clicked for me was writing the topological sort. You walk from the output backward through parents, marking what you have already visited. You insert each node at the front of a list, so by the end the list is in the right order for gradients to flow through. Then you walk that list once, keep a dictionary of accumulated derivatives keyed by each variable, and add to it whenever a new path arrives at that variable. One dictionary and one sorted list. That is the whole trick.

I drew the whole thing out on paper before the code started making sense. The moment I stopped thinking about "derivatives" and started thinking about "how do I visit each node exactly once in the right order while remembering what I have seen," the problem stopped being a calculus problem and became a data structures problem that happens to compute math.

That reframing is the single most useful thing I took from the course. Autodiff is not about derivatives. It is about graphs. PyTorch is a very efficient graph walker with a really nice API on top.

## Broadcasting is where elegance lives

The tensor module felt deceptively simple at first. Implement add. Implement multiply. Reshape. Transpose. How hard could it be?

Broadcasting is where it gets hard. When you add a \`(3, 4)\` tensor to a \`(4,)\` tensor, PyTorch silently stretches the smaller one along the missing dimension. This is convenient. It is also a carefully designed abstraction that I had never thought about until I had to write it.

The elegant move is that you do not actually copy data when you broadcast. You lie to the indexing function about the shape. If the input tensor is size \`(4,)\` and the output is size \`(3, 4)\`, every "row" of the output reads from the same underlying row of the input. The broadcast rule becomes a set of stride and shape rules that tell the indexing function which input position to read for each output position.

Writing this was the first time I thought of a tensor as something different from a NumPy array. A tensor is a view into a flat block of memory, plus a set of rules for how to walk through that memory. Shape, stride, and position translation are the whole operation. Everything else is built on top.

## The log-sum-exp trick is not optional

In the deep learning module, you implement softmax. The naive version is three lines. Exponentiate the inputs, sum them, divide. It works on a tiny test input. Then you run it on a real batch and start seeing \`inf\` and \`nan\` and wonder what you did wrong.

The issue is that softmax involves \`exp(x)\`. If any \`x\` in your input is large, say 800, then \`exp(800)\` overflows to infinity. Divide infinity by infinity and you get \`nan\`. Your whole model breaks on one bad input.

The fix is that you subtract the max value from the input before you exponentiate. Mathematically this is a no-op. \`softmax(x)\` equals \`softmax(x - c)\` for any constant \`c\`. Numerically, it rescues you. Subtract the max, and now the largest input is zero, which exponentiates to one. Nothing overflows. The output is identical.

I had seen this trick mentioned in papers. I had never understood why it was such a big deal. After an hour of watching my own softmax produce \`nan\` on a perfectly reasonable input, I understood. Numerical stability is not a polish you add at the end. It is a correctness property.

## Pooling is the easiest hard thing

The last module implements convolutional neural networks, including 2D max pooling. My expectation was that pooling would be hard because convolution is hard. I was wrong about which part was hard.

2D max pooling is conceptually simple. Take non-overlapping squares of your input, return the max of each one. The hard part is implementing it without writing a loop. You want it to run on the parallel tensor operators you built earlier, which means you need to reshape the input so that the pooling dimension becomes a reducible axis.

The reshape goes through a sequence of view, permute, view operations. You reinterpret the input as a tensor with an extra dimension per kernel cell, you swap axes so the kernel cells land in the right place, you reinterpret again. By the end, max pooling becomes a one-line reduction over the new axis.

The first time I got it working, I wrote the permute in the wrong order and the output looked scrambled but not obviously wrong. It took me twenty minutes of printing shapes to find the bug. The lesson I took from it was that when your tensor operation compiles and runs and produces the wrong answer, the bug is almost always in the shape choreography, not in the math.

## What I can do now that I could not do before

I can read a PyTorch error message and know which part of the stack it came from. Before, \`RuntimeError: one of the variables needed for gradient computation has been modified by an inplace operation\` was a wall of text. Now I know it means I wrote to a tensor that is on the autograd tape, which means the saved value for backward is gone, which means the chain rule has nothing to chain. I can fix it in two seconds.

I can look at a model training run that is producing \`nan\` and guess, within a few tries, where the numerical instability lives. I can read a paper that mentions "we use the log-sum-exp trick" without having to look up what that means.

More than any of that, I learned that the gap between "I use this" and "I understand this" is much wider than I thought. The second one takes real work. The first time I watched my own backprop propagate a gradient through a graph I built by hand, I finally understood what PyTorch had been doing for me every day for two years. That is the kind of understanding you cannot get from reading documentation.

---

*Built with Sasha Rush's [MiniTorch](https://minitorch.github.io/) as part of Cornell Tech's Machine Learning Engineering course. Code is in a private repo. Happy to share with interviewers on request.*`,
  },
  'medication-extraction-llm-evaluation': {
    title: 'Structured missingness in medication extraction and its implications for cohort construction',
    date: 'January 14, 2026',
    component: MedicationExtractionPost,
  },
  'nyc-transit-analysis': {
    title: 'Does Heat Change How New Yorkers Take the Subway?',
    date: 'October 25, 2024',
    component: NYCTransitPost,
  },
};

export default function BlogPost() {
  const { theme } = useTheme();
  const { slug } = useParams();
  const post = posts[slug as keyof typeof posts];

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-4xl mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>Post not found</h1>
        <Link to="/blog" className={`${theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'}`}>
          Back to blog
        </Link>
      </div>
    );
  }

  const proseColor = theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-[#1a1a1a]';
  const linkColor = theme === 'dark' ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]';
  const tableStyle = theme === 'dark'
    ? 'border-gray-600 text-gray-300'
    : 'border-gray-300 text-[#1a1a1a]';
  const codeStyle = theme === 'dark'
    ? 'bg-gray-800 text-gray-200'
    : 'bg-gray-100 text-[#1a1a1a]';

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">
      <Link
        to="/blog"
        className={`inline-flex items-center space-x-2 ${linkColor} mb-8`}
      >
        <ArrowLeft size={18} />
        <span>Back to blog</span>
      </Link>

      <article>
        <div className="mb-2">
          <span className={`text-sm ${theme === 'dark' ? 'text-[#e05555]' : 'text-[#cc2222]'}`}>
            {post.date}
          </span>
        </div>
        <h1 className={`text-4xl font-normal mb-8 ${headingColor}`}>
          {post.title}
        </h1>

        {post.component ? (
          <post.component />
        ) : post.useMarkdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => (
                <p className={`text-lg mb-4 leading-relaxed ${proseColor}`}>{children}</p>
              ),
              h2: ({ children }) => (
                <h2 className={`text-2xl font-semibold mt-10 mb-4 ${headingColor}`}>{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className={`text-xl font-semibold mt-8 mb-3 ${headingColor}`}>{children}</h3>
              ),
              ul: ({ children }) => (
                <ul className={`list-disc list-inside mb-4 space-y-1 text-lg ${proseColor}`}>{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className={`list-decimal list-inside mb-4 space-y-1 text-lg ${proseColor}`}>{children}</ol>
              ),
              li: ({ children }) => (
                <li className={`text-lg ${proseColor}`}>{children}</li>
              ),
              strong: ({ children }) => (
                <strong className={`font-semibold ${headingColor}`}>{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic">{children}</em>
              ),
              a: ({ href, children }) => (
                <a href={href} className={`underline ${linkColor}`} target="_blank" rel="noopener noreferrer">{children}</a>
              ),
              hr: () => (
                <hr className={`my-8 ${theme === 'dark' ? 'border-[#3a2022]' : 'border-gray-200'}`} />
              ),
              blockquote: ({ children }) => (
                <blockquote className={`border-l-4 pl-4 my-4 italic ${theme === 'dark' ? 'border-[#e05555] text-gray-400' : 'border-[#cc2222] text-gray-600'}`}>{children}</blockquote>
              ),
              code: ({ inline, children }: { inline?: boolean; children?: React.ReactNode }) =>
                inline ? (
                  <code className={`px-1 py-0.5 rounded text-sm font-mono ${codeStyle}`}>{children}</code>
                ) : (
                  <pre className={`rounded-lg p-4 mb-4 overflow-x-auto text-sm font-mono ${codeStyle}`}>
                    <code>{children}</code>
                  </pre>
                ),
              table: ({ children }) => (
                <div className="overflow-x-auto mb-6">
                  <table className={`w-full border-collapse text-sm ${tableStyle}`}>{children}</table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>{children}</thead>
              ),
              th: ({ children }) => (
                <th className={`border px-4 py-2 text-left font-semibold ${tableStyle}`}>{children}</th>
              ),
              td: ({ children }) => (
                <td className={`border px-4 py-2 ${tableStyle}`}>{children}</td>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        ) : (
          <div className={`text-lg whitespace-pre-line blog-content ${proseColor}`}>
            {post.content}
          </div>
        )}
      </article>
    </div>
  );
}
