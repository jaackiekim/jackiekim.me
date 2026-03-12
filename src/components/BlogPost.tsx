import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NYCTransitPost from './NYCTransitPost';

const medicationExtractionPost = `
Aggregate F1 scores are comfortable. They give you one number, you compare it to another number, and you make a decision. The problem is they can hide failures that matter a lot while averaging in successes that don't.

I ran an experiment to see how bad that hiding can get. I compared three medication extraction systems on clinical notes: a regex + RxNorm rule-based baseline, GPT-4o (zero-shot and few-shot), and BioMistral, a 7B biomedical language model. Three drug classes: standard oral medications (metformin, lisinopril, that whole crowd), oncology/chemotherapy agents, and PRN (as-needed) medications.

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

GPT-4o zero-shot comes out on top, few-shot underperforms (more on why in a minute), regex holds its own. Read this table and you might conclude these systems are roughly comparable.

Keep reading.

## What the Breakdown Actually Shows

Drug F1 by drug class:

| Drug Class | Regex | GPT-4o Zero-Shot | GPT-4o Few-Shot |
|---|---|---|---|
| Standard | 0.723 | 0.737 | 0.592 |
| **Oncology** | **0.141** | **0.354** | **0.223** |
| PRN | 0.648 | 0.846 | 0.786 |

The regex baseline scores **0.141** on oncology drugs. GPT-4o zero-shot, the best overall, scores **0.354**. That's the range where a system is wrong more often than it's right.

Strength extraction on oncology is worse:

| Drug Class | Regex | GPT-4o Zero-Shot | GPT-4o Few-Shot |
|---|---|---|---|
| **Oncology** | **0.000** | **0.276** | **0.213** |

Zero. The regex baseline extracts essentially no chemotherapy doses correctly. GPT-4o gets to 0.276, which is not a number you'd want underpinning a study.

Standard and PRN medications are doing fine, with F1 in the 0.6–0.86 range. That performance is what pulls the oncology collapse back up into the aggregate average.

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

## What's Next

The BioMistral evaluation is still running. A 7B local model on n2c2 2018 is slower than an API call, and I want the numbers right before publishing them. The working hypothesis is that it fails on oncology too, but through output formatting and relation extraction failures rather than the unit normalization problems that trip up GPT-4o.

The more tractable fix is the few-shot example set. The current design is known to be bad. All five examples are structured medication lists. A better version samples from narrative sections, includes at least one oncology example with AUC dosing in prose context, and checks that the example distribution matches the note types in the target corpus. That alone should close a real portion of the recall gap.

Code, evaluation framework, and full results: [github.com/jaackiekim/clinical-med-extraction](https://github.com/jaackiekim/clinical-med-extraction)

---

*Dataset note: GPT-4o was evaluated on MTSamples due to data governance constraints on DUA-restricted corpora. Regex and BioMistral were evaluated on n2c2 2018 Track 2. Cross-model absolute F1 comparisons should be read with that difference in mind.*
`;

const posts: Record<string, { title: string; date: string; content?: string; useMarkdown?: boolean; component?: React.ComponentType }> = {
  'medication-extraction-llm-evaluation': {
    title: 'When Your Medication Extraction Model Gets an A and Still Fails the Patient',
    date: 'January 14, 2026',
    content: medicationExtractionPost,
    useMarkdown: true,
  },
  'nyc-transit-analysis': {
    title: 'Does Heat Change How New Yorkers Take the Subway?',
    date: 'October 25, 2024',
    component: NYCTransitPost,
  },
  'machine-learning-cities': {
    title: 'Machine Learning for Urban Planning',
    date: 'October 20, 2024',
    content: 'Coming soon...'
  }
};

export default function BlogPost() {
  const { theme } = useTheme();
  const { slug } = useParams();
  const post = posts[slug as keyof typeof posts];

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className={`text-4xl mb-8 ${theme === 'dark' ? 'text-white' : ''}`}>Post not found</h1>
        <Link to="/blog" className={`${theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-[#0039D7] hover:text-[#002BB4]'}`}>
          Back to blog
        </Link>
      </div>
    );
  }

  const proseColor = theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]';
  const headingColor = theme === 'dark' ? 'text-white' : 'text-[#1a1a1a]';
  const linkColor = theme === 'dark' ? 'text-blue-300 hover:text-blue-200' : 'text-[#0039D7] hover:text-[#002BB4]';
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
          <span className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-[#0039D7]'}`}>
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
                <hr className={`my-8 ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`} />
              ),
              blockquote: ({ children }) => (
                <blockquote className={`border-l-4 pl-4 my-4 italic ${theme === 'dark' ? 'border-blue-400 text-gray-400' : 'border-[#0039D7] text-gray-600'}`}>{children}</blockquote>
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
