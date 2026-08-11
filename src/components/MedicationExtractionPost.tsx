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
        Aggregate F1 scores can hide a lot. A single overall metric can average a large deficit in one subgroup into what looks like acceptable performance everywhere else. I wanted to see how bad that hiding actually gets.
      </p>
      <p className="mb-4">
        I compared five medication extraction configurations on clinical notes: a regex baseline built on RxNorm, GPT-4o under zero-shot and few-shot prompting, and BioMistral-7B-DARE, a domain-adapted biomedical language model, run under the same two prompting conditions. I stratified performance across three drug classes: standard oral medications, oncology and chemotherapy agents, and PRN (as-needed) medications.
      </p>
      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>Task and evaluation</h2>
      <p className="mb-8">
        Clinical medication extraction is, on paper, a named entity recognition task: given a clinical note, pull out the drug names and their doses. That framing undersells how hard oncology notes are, where doses are often given relative to a target area under the curve (e.g., "carboplatin AUC 5") rather than as a flat milligram amount.
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
        GPT-4o zero-shot comes out on top in the aggregate. You could read that as the interesting result here, a real gap between GPT-4o and BioMistral. The subgroup breakdown below says otherwise.
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
        † BioMistral recall is a lower bound - output truncation at 512 tokens produced empty extractions on ~11% of notes. The dashed red line marks F1 = 0.50 on oncology.
      </p>

      <p className="mb-4">
        The oncology subgroup is driving that aggregate result. Every configuration underperforms on oncology relative to its own performance on the other drug classes. The best oncology F1 across all five configurations is 0.643, from the regex baseline, which still means the best system in the comparison misses more than a third of oncology drug mentions. Standard-oral and PRN performance, ranging from 0.511 to 0.948, is what's propping up the aggregate average.
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>Precision and recall tell different stories</h2>
      <p className="mb-4">
        Breaking F1 into precision and recall (switch to the Recall tab above) shows where the oncology deficit actually comes from. Three of five configurations get perfect oncology precision: when they extract an oncology drug, they're right. The whole problem is on the recall side. Regex recovers fewer than half of oncology mentions. GPT-4o zero-shot recovers fewer than a third. BioMistral zero-shot recovers roughly one in ten.
      </p>
      <p className="mb-8">
        That asymmetry matters for how this gets used downstream. Precision errors are visible: a reviewer catches the wrong extraction. Recall errors aren't: a missed drug just doesn't show up anywhere, and no one notices. In a cohort construction pipeline, that makes recall failures the more dangerous kind.
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>Why each system fails</h2>
      <p className="mb-4">
        <strong className={`font-semibold ${heading}`}>Regex + RxNorm</strong> has a vocabulary coverage problem. Chemotherapy agents, biosimilar brand names, and regimen abbreviations are underrepresented in RxNorm. When a drug name isn't in the vocabulary, the extractor just returns nothing for that mention, which gets you high precision for free and low recall as the price.
      </p>
      <p className="mb-4">
        <strong className={`font-semibold ${heading}`}>GPT-4o zero-shot</strong> does better on recall than regex, but by less than you'd expect. AUC- and BSA-based dosing notation is specific to a small set of drugs and doesn't show up much in general pretraining data. The model knows "carboplatin," but it often can't turn "carboplatin AUC 5" into one structured entity.
      </p>
      <p className="mb-4">
        <strong className={`font-semibold ${heading}`}>GPT-4o few-shot</strong> gives the most counterintuitive result here: adding five examples makes recall worse across every subgroup, dropping overall recall from 0.610 to 0.460. All five in-context examples came from structured medication-list sections of notes, and the model seems to latch onto that format, becoming less likely to pull drugs out of narrative prose. That's not few-shot prompting failing as a technique. It's an example-selection problem.
      </p>
      <p className="mb-8">
        <strong className={`font-semibold ${heading}`}>BioMistral</strong> fails in a different way. The base BioMistral-7B model didn't produce the required format at all, continuing the clinical narrative instead of generating JSON. DARE, the instruction-tuned variant, followed the JSON schema reliably within the token budget, and when it extracted a drug, it got it right (oncology precision: 1.000). So the recall ceiling here is a generation budget problem, not a model capability problem.
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>Why this matters beyond the benchmark</h2>
      <p className="mb-4">
        Medication extraction outputs feed study cohort definitions. If you're running a real-world evidence study on chemotherapy-exposed patients, you're relying on extracted medication data to define who those patients are.
      </p>
      <p className="mb-4">
        A system with oncology recall of 0.30 isn't adding noise to your cohort. It's systematically undercounting it. The patients most likely to be missed are those whose documentation is most complex. Complex documentation tracks with complex disease. Complex disease tracks with worse outcomes. You've introduced selection bias at the data layer, and it won't appear anywhere in your aggregate extraction metrics.
      </p>
      <p className="mb-8">
        Epidemiologists call this differential misclassification. When missingness is correlated with the outcome of interest, bias compounds rather than cancels. It doesn't average out with more data. The question to ask before using any extraction system isn't "what's the F1 score." It's "for this drug class and this specific analysis, is this system's recall acceptable?"
      </p>

      <h2 className={`text-2xl font-semibold mt-10 mb-4 ${heading}`}>The more tractable fixes</h2>
      <p className="mb-4">
        The few-shot example selection problem is fixable. A better set samples from narrative prose sections, includes at least one oncology note with AUC dosing in running text, and checks that the example distribution matches the note types in the target corpus.
      </p>
      <p className="mb-8">
        The BioMistral truncation problem is also fixable - increasing the output token budget to 1024 would recover most of the truncated extractions. Neither fix addresses the structural finding: oncology recall is limited across all current approaches because chemotherapy documentation is systematically harder than the general medication documentation these systems were designed around.
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
