import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

const MODELS = ['Regex', 'GPT-4o ZS', 'GPT-4o FS', 'BioMistral ZS†', 'BioMistral FS†'];
const COLORS = ['#378ADD', '#1D9E75', '#5DCAA5', '#888780', '#B4B2A9'];
const ONCOLOGY_WARN = '#C0392B';

const DATA = {
  f1: {
    overall:       [0.739, 0.755, 0.627, 0.343, 0.342],
    standard_oral: [0.948, 0.904, 0.834, 0.516, 0.511],
    oncology:      [0.643, 0.463, 0.278, 0.197, 0.092],
    prn:           [0.828, 0.846, 0.789, 0.409, 0.381],
    other:         [0.677, 0.706, 0.545, 0.295, 0.303],
  },
  recall: {
    overall:       [0.630, 0.610, 0.460, 0.210, 0.208],
    standard_oral: [0.902, 0.826, 0.715, 0.349, 0.346],
    oncology:      [0.474, 0.301, 0.186, 0.109, 0.051],
    prn:           [0.710, 0.735, 0.653, 0.258, 0.237],
    other:         [0.567, 0.550, 0.377, 0.176, 0.180],
  },
  precision: {
    overall:       [0.893, 0.990, 0.986, 0.946, 0.955],
    standard_oral: [0.999, 0.998, 1.000, 0.985, 0.975],
    oncology:      [1.000, 1.000, 0.547, 1.000, 0.444],
    prn:           [0.994, 0.998, 0.998, 0.995, 0.966],
    other:         [0.842, 0.986, 0.984, 0.917, 0.952],
  },
};

type Metric = 'f1' | 'recall' | 'precision';
type Subgroup = 'overall' | 'standard_oral' | 'oncology' | 'prn' | 'other';

const SUBGROUPS: { key: Subgroup; label: string; n: number }[] = [
  { key: 'overall',       label: 'Overall',        n: 10575 },
  { key: 'standard_oral', label: 'Standard oral',  n: 1342  },
  { key: 'oncology',      label: 'Oncology',        n: 156   },
  { key: 'prn',           label: 'PRN',             n: 1657  },
  { key: 'other',         label: 'Other',           n: 7420  },
];

function makeChartData(metric: Metric, subgroup: Subgroup) {
  return MODELS.map((model, i) => ({
    model,
    value: DATA[metric][subgroup][i],
    color: subgroup === 'oncology' && DATA[metric][subgroup][i] < 0.5
      ? ONCOLOGY_WARN
      : COLORS[i],
  }));
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--color-background-primary)',
        border: '0.5px solid var(--color-border-secondary)',
        borderRadius: 6,
        padding: '6px 10px',
        fontSize: 12,
        color: 'var(--color-text-primary)',
      }}>
        <div style={{ fontWeight: 500 }}>{label}</div>
        <div>{payload[0].value.toFixed(3)}</div>
      </div>
    );
  }
  return null;
};

function SubgroupChart({ subgroup, metric, label, n, dark }: {
  subgroup: Subgroup; metric: Metric; label: string; n: number; dark: boolean;
}) {
  const isOncology = subgroup === 'oncology';
  const data = makeChartData(metric, subgroup);
  const labelColor = isOncology ? ONCOLOGY_WARN : 'var(--color-text-secondary)';

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color: labelColor,
        marginBottom: 4,
      }}>
        {label} <span style={{ fontWeight: 400, opacity: 0.6 }}>N={n.toLocaleString()}</span>
      </div>
      <div style={{ width: '100%', height: 56 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke={dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} />
            <XAxis
              type="number"
              domain={[0, 1]}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickFormatter={v => v.toFixed(2)}
              tick={{ fontSize: 9, fill: '#888780' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis type="category" dataKey="model" hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }} />
            {isOncology && <ReferenceLine x={0.5} stroke={ONCOLOGY_WARN} strokeDasharray="3 3" strokeWidth={1} />}
            <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={8}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function MedicationExtractionPost() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [metric, setMetric] = useState<Metric>('f1');

  const prose = dark ? 'text-gray-300' : 'text-[#1a1a1a]';
  const heading = dark ? 'text-white' : 'text-[#1a1a1a]';
  const muted = dark ? 'text-gray-500' : 'text-gray-400';
  const link = dark ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]';
  const borderColor = dark ? '#3a3a38' : '#e5e5e3';
  const activeTab = dark ? '#2a2a28' : '#f0efed';
  const tableBorder = dark ? 'border-gray-700' : 'border-gray-200';
  const tableText = dark ? 'text-gray-300' : 'text-[#1a1a1a]';

  const tabStyle = (active: boolean): React.CSSProperties => ({
    background: active ? activeTab : 'transparent',
    border: `0.5px solid ${active ? borderColor : 'transparent'}`,
    borderRadius: 6,
    padding: '4px 12px',
    fontSize: 12,
    cursor: 'pointer',
    color: active ? (dark ? '#fff' : '#1a1a1a') : '#888780',
    fontFamily: 'inherit',
  });

  return (
    <div className={`text-lg leading-relaxed ${prose}`}>

      <p className="mb-4">
        Aggregate F1 scores are comfortable. They give you one number, you compare it to another number, and you make a decision. The problem is they can hide failures that matter a lot while averaging in successes that don't.
      </p>
      <p className="mb-4">
        I compared five medication extraction configurations on clinical notes: a regex + RxNorm rule-based baseline, GPT-4o (zero-shot and few-shot), and BioMistral-7B-DARE (zero-shot and few-shot), a domain-adapted open biomedical language model. Three drug classes: standard oral medications, oncology/chemotherapy agents, and PRN (as-needed) medications.
      </p>
      <p className="mb-8">
        The aggregate numbers looked reasonable. The stratified results were a different situation entirely.
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>What I was measuring</h2>
      <p className="mb-4">
        Clinical medication extraction is a named entity recognition task: given a clinical note, pull out the drug names and their associated doses. Sounds manageable until you read an actual oncology note and see the dose listed as "carboplatin AUC 5."
      </p>
      <p className="mb-8">
        (That means the dose is calculated based on a target area under the curve rather than a flat milligram amount. Oncology dosing has its own internal logic.)
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>The numbers that look reassuring</h2>
      <p className="mb-4">Overall Drug F1 across all five configurations:</p>
      <div className="overflow-x-auto mb-6">
        <table className={`w-full border-collapse text-sm ${tableText}`}>
          <thead className={dark ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th className={`border px-4 py-2 text-left font-semibold ${tableBorder}`}>Model</th>
              <th className={`border px-4 py-2 text-left font-semibold ${tableBorder}`}>Overall Drug F1</th>
            </tr>
          </thead>
          <tbody>
            {[['Regex + RxNorm','0.739'],['GPT-4o zero-shot','0.755'],['GPT-4o few-shot','0.627'],['BioMistral zero-shot †','0.343'],['BioMistral few-shot †','0.342']].map(([m,v]) => (
              <tr key={m}>
                <td className={`border px-4 py-2 ${tableBorder}`}>{m}</td>
                <td className={`border px-4 py-2 ${tableBorder}`}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mb-8">
        GPT-4o zero-shot leads overall. Read this table and you might conclude the interesting story is the GPT-4o vs BioMistral gap. It isn't.
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-6 ${heading}`}>What the breakdown actually shows</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {(['f1', 'recall', 'precision'] as Metric[]).map(m => (
          <button key={m} style={tabStyle(metric === m)} onClick={() => setMetric(m)}>
            {m === 'f1' ? 'Drug F1' : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: '1.5rem',
        fontSize: 12,
        color: '#888780',
      }}>
        {MODELS.map((m, i) => (
          <span key={m} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
            {m}
          </span>
        ))}
      </div>

      {SUBGROUPS.map(sg => (
        <SubgroupChart
          key={sg.key}
          subgroup={sg.key}
          metric={metric}
          label={sg.label}
          n={sg.n}
          dark={dark}
        />
      ))}

      <p className={`text-sm italic mb-8 ${muted}`} style={{ borderLeft: `2px solid ${ONCOLOGY_WARN}`, paddingLeft: 10 }}>
        † BioMistral recall is a lower bound — output truncation at 512 tokens produced empty extractions on ~11% of notes. The dashed red line marks F1 = 0.50 on oncology.
      </p>

      <p className="mb-4">
        The oncology row is the finding. Every system collapses on oncology relative to its performance everywhere else. The best oncology F1 in the entire comparison is the regex baseline at 0.643 — and that still means the system fails to extract more than a third of oncology drug mentions. Standard and PRN performance, which runs 0.511 to 0.948, is what pulls the oncology failure back up into the aggregate average.
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>Precision and recall tell different stories</h2>
      <p className="mb-4">
        Switch to the Recall tab above. Three of five configurations achieve perfect oncology precision — when they extract an oncology drug, they're always right. The failure is entirely on the recall side. Regex finds fewer than half. GPT-4o zero-shot finds fewer than a third. BioMistral zero-shot finds roughly one in ten.
      </p>
      <p className="mb-8">
        This asymmetry matters for downstream use. Precision failures are visible — a reviewer sees the wrong extraction. Recall failures are invisible — no one sees the drug that was never extracted. In a cohort construction pipeline, invisible failures are the dangerous ones.
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>Why each system fails</h2>
      <p className="mb-4">
        <strong className={`font-semibold ${heading}`}>Regex + RxNorm</strong> has a vocabulary coverage problem. Chemotherapy agents, biosimilar brand names, and regimen abbreviations are underrepresented in RxNorm. When the drug name isn't in the vocabulary, the extractor produces no output. High precision is guaranteed by construction. Low recall follows directly.
      </p>
      <p className="mb-4">
        <strong className={`font-semibold ${heading}`}>GPT-4o zero-shot</strong> does better on recall than regex, but the gap is smaller than you'd expect. AUC-based and BSA-based dosing notation is specific to a small set of drugs and rarely appears in general pretraining data. The model recognizes "carboplatin" but struggles with "carboplatin AUC 5" as a structured entity.
      </p>
      <p className="mb-4">
        <strong className={`font-semibold ${heading}`}>GPT-4o few-shot</strong> is the most counterintuitive result. Adding five examples makes recall worse across every subgroup — overall recall drops from 0.610 to 0.460. All five in-context examples came from structured medication list sections of notes. The model latched onto that format and became less likely to extract drugs mentioned in running prose. This isn't few-shot prompting failing as a technique. It's an example selection problem.
      </p>
      <p className="mb-8">
        <strong className={`font-semibold ${heading}`}>BioMistral</strong> shows a different failure mode. The base BioMistral-7B model failed entirely — it continued the clinical narrative rather than producing JSON. DARE, the instruction-tuned variant, followed the JSON format reliably on notes within the token budget. When it extracts, it extracts correctly (oncology precision: 1.000). The recall floor is a generation budget problem, not a model capability problem.
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>Why this matters beyond the benchmark</h2>
      <p className="mb-4">
        Medication extraction outputs feed study cohort definitions. If you're running a real-world evidence study on chemotherapy-exposed patients, you're relying on extracted medication data to define who those patients are.
      </p>
      <p className="mb-4">
        A system with oncology recall of 0.30 isn't adding noise to your cohort. It's systematically undercounting it. The patients most likely to be missed are those whose documentation is most complex. Complex documentation tracks with complex disease. Complex disease tracks with worse outcomes. You've introduced selection bias at the data layer, and it won't appear anywhere in your aggregate extraction metrics.
      </p>
      <p className="mb-8">
        Epidemiologists call this differential misclassification — when missingness is correlated with the outcome of interest, bias compounds rather than cancels. It doesn't average out with more data. The question to ask before using any extraction system isn't "what's the F1 score." It's "for this drug class and this specific analysis, is this system's recall acceptable?"
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>The more tractable fixes</h2>
      <p className="mb-4">
        The few-shot example selection problem is fixable. A better set samples from narrative prose sections, includes at least one oncology note with AUC dosing in running text, and checks that the example distribution matches the note types in the target corpus.
      </p>
      <p className="mb-8">
        The BioMistral truncation problem is also fixable — increasing the output token budget to 1024 would recover most of the truncated extractions. Neither fix addresses the structural finding: oncology recall is limited across all current approaches because chemotherapy documentation is systematically harder than the general medication documentation these systems were designed around.
      </p>


      <hr style={{ borderColor, margin: '2rem 0' }} />

      <h2 className={`text-xl font-semibold mb-4 ${heading}`}>References</h2>
      <ol className={`text-sm space-y-3 ${muted}`} style={{ listStyleType: 'decimal', paddingLeft: '1.25rem' }}>
        <li>
          Henry S, Buchan K, Filannino M, Stubbs A, Uzuner O. 2018 n2c2 shared task on adverse drug events and medication extraction in electronic health records.{' '}
          <em>J Am Med Inform Assoc.</em> 2020;27(1):3–12.{' '}
          <a href="https://doi.org/10.1093/jamia/ocz166" className={`underline ${link}`} target="_blank" rel="noopener noreferrer">
            doi:10.1093/jamia/ocz166
          </a>
        </li>
        <li>
          Labrak Y, Bazoge A, Morin E, et al. BioMistral: A Collection of Open-Source Pretrained Large Language Models for Medical Domains. arXiv preprint. 2024.{' '}
          <a href="https://arxiv.org/abs/2402.10373" className={`underline ${link}`} target="_blank" rel="noopener noreferrer">
            arXiv:2402.10373
          </a>
        </li>
        <li>
          Nelson SJ, Zeng K, Kilbourne J, Powell T, Moore R. Normalized names for clinical drugs: RxNorm at 6 years.{' '}
          <em>J Am Med Inform Assoc.</em> 2011;18(4):441–445.{' '}
          <a href="https://doi.org/10.1136/amiajnl-2011-000116" className={`underline ${link}`} target="_blank" rel="noopener noreferrer">
            doi:10.1136/amiajnl-2011-000116
          </a>
        </li>
        <li>
          Rothman KJ, Greenland S, Lash TL.{' '}
          <em>Modern Epidemiology.</em> 3rd ed. Philadelphia: Lippincott Williams & Wilkins; 2008. (Differential misclassification, Ch. 9.)
        </li>
      </ol>

      <hr style={{ borderColor, margin: '2rem 0' }} />

      <p className="mb-2">
        Code, evaluation framework, and full results:{' '}
        <a href="https://github.com/jaackiekim/clinical-med-extraction" className={`underline ${link}`} target="_blank" rel="noopener noreferrer">
          github.com/jaackiekim/clinical-med-extraction
        </a>
      </p>
      <p className={`text-sm italic ${muted}`}>
        All five configurations were evaluated on n2c2 2018 Track 2 (202 test notes, 10,575 drug mentions). BioMistral-7B-DARE was run in 4-bit NF4 quantization on a T4 GPU with max_new_tokens=512.
      </p>

    </div>
  );
}
