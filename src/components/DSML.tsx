import React from 'react';
import { useTheme } from './ThemeProvider';

export default function DSML() {
  const { theme } = useTheme();

  const prose = theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]';
  const heading = theme === 'dark' ? 'text-white' : 'text-[#1a1a1a]';
  const accent = theme === 'dark' ? 'text-blue-400' : 'text-[#0039D7]';
  const subtle = theme === 'dark' ? 'text-gray-400' : 'text-[#1a1a1a]/60';
  const divider = theme === 'dark' ? 'border-gray-700' : 'border-[#0039D7]/10';

  return (
    <div className="max-w-3xl mx-auto px-8 py-12">

      <hr className={`border-t ${divider} mb-10`} />

      <section className="mb-10">
        <h2 className={`text-xs uppercase tracking-widest font-semibold mb-6 ${subtle}`}>Education</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Cornell University</span>
              <span className={`text-sm ${subtle}`}>2023 – 2025</span>
            </div>
            <p className={`text-sm ${prose}`}>M.S. Applied Information Science (Data Science & ML)</p>
            <p className={`text-sm ${subtle} mt-1`}>Applied Machine Learning, Natural Language Processing, Causal Inference, Advanced Strategic Analysis</p>
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>University of California, Berkeley</span>
              <span className={`text-sm ${subtle}`}>2018 – 2022</span>
            </div>
            <p className={`text-sm ${prose}`}>B.A. Data Science, Urban Science concentration</p>
            <p className={`text-sm ${subtle} mt-1`}>Data Structures and Algorithms, Probability Theory, Linear Algebra, Environmental Econometrics</p>
          </div>
        </div>
      </section>

      <hr className={`border-t ${divider} mb-10`} />

      <section className="mb-10">
        <h2 className={`text-xs uppercase tracking-widest font-semibold mb-6 ${subtle}`}>Skills</h2>
        <div className="space-y-3">
          <div>
            <span className={`text-sm font-semibold ${heading}`}>Languages: </span>
            <span className={`text-sm ${prose}`}>Python, SQL</span>
          </div>
          <div>
            <span className={`text-sm font-semibold ${heading}`}>ML & Analytics: </span>
            <span className={`text-sm ${prose}`}>NLP, LLMs, causal inference, experiment design, A/B testing, evaluation framework design</span>
          </div>
          <div>
            <span className={`text-sm font-semibold ${heading}`}>Data: </span>
            <span className={`text-sm ${prose}`}>SQL/ETL, data validation, pipeline optimization, clinical text (EHR, medical transcripts)</span>
          </div>
          <div>
            <span className={`text-sm font-semibold ${heading}`}>Tools: </span>
            <span className={`text-sm ${prose}`}>BigQuery, dbt, Azure Data Factory, HuggingFace, scikit-learn, OpenAI API, Jupyter, Git</span>
          </div>
          <div>
            <span className={`text-sm font-semibold ${heading}`}>Certifications: </span>
            <span className={`text-sm ${prose}`}>Google Cloud Professional Data Engineer (Dec 2024)</span>
          </div>
        </div>
      </section>

      <hr className={`border-t ${divider} mb-10`} />

      <section className="mb-10">
        <h2 className={`text-xs uppercase tracking-widest font-semibold mb-6 ${subtle}`}>Experience</h2>
        <div className="space-y-8">

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Data Scientist</span>
              <span className={`text-sm ${subtle}`}>Jul – Oct 2025</span>
            </div>
            <span className={`text-sm ${prose}`}>Surge AI</span>
            <ul className={`mt-2 space-y-1 text-sm ${prose} list-disc list-inside`}>
              <li>Role concluded following company-wide restructuring.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Data Science Intern</span>
              <span className={`text-sm ${subtle}`}>Jun – Aug 2024</span>
            </div>
            <a href="https://www.apple.com" target="_blank" rel="noopener noreferrer" className={`text-sm ${accent} hover:underline`}>
              Apple, Siri Research
            </a>
            <ul className={`mt-2 space-y-1 text-sm ${prose} list-disc list-inside`}>
              <li>Designed dataset-quality metrics over 10K+ labeled Siri examples, identifying low-value data that enabled reallocation of QA effort, saving $90K and 5,000 QA hours annually.</li>
              <li>Built monitoring dashboards that surfaced label drift and production model degradation, giving PMs and engineers concrete signals for data collection and experimentation prioritization.</li>
              <li>Partnered with Product and Ops to define success metrics and experimentation strategy aligned with Siri performance goals.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>ML Researcher</span>
              <span className={`text-sm ${subtle}`}>Aug 2023 – May 2025</span>
            </div>
            <span className={`text-sm ${prose}`}>Cornell University</span>
            <ul className={`mt-2 space-y-1 text-sm ${prose} list-disc list-inside`}>
              <li>Built n-gram and transformer language models on WSJ corpus and ASR transcripts; achieved 8.69% WER on HUB dataset and 3.75 perplexity on test set.</li>
              <li>Applied regression, regularization (LASSO/Ridge), and treatment-effect simulations for model evaluation, uncertainty quantification, and bias analysis on observational datasets.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Data Engineer</span>
              <span className={`text-sm ${subtle}`}>Jul 2022 – Jul 2023</span>
            </div>
            <span className={`text-sm ${prose}`}>Avanade (Accenture + Microsoft)</span>
            <ul className={`mt-2 space-y-1 text-sm ${prose} list-disc list-inside`}>
              <li>Built SQL-driven data pipeline for cloud migration used by CDC leadership to track and predict flu, Covid-19, and vaccination rates post-lockdown.</li>
              <li>Supported experiment reporting and KPI tracking for large-scale healthcare programs, informing operational and investment decisions.</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Data Analyst Intern</span>
              <span className={`text-sm ${subtle}`}>Jun – Sep 2019</span>
            </div>
            <a href="https://www.jpl.nasa.gov" target="_blank" rel="noopener noreferrer" className={`text-sm ${accent} hover:underline`}>
              NASA Jet Propulsion Laboratory
            </a>
            <ul className={`mt-2 space-y-1 text-sm ${prose} list-disc list-inside`}>
              <li>Built Python-based K-Means clustering pipeline segmenting 100+ user profiles, improving engagement metrics and informing experiment design for communication strategy.</li>
            </ul>
          </div>

        </div>
      </section>

      <hr className={`border-t ${divider} mb-10`} />

      <section className="mb-10">
        <h2 className={`text-xs uppercase tracking-widest font-semibold mb-6 ${subtle}`}>Projects & Recognition</h2>
        <div className="space-y-8">

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Project Solstice, U.S. Dept. of Energy Prize Winner</span>
              <span className={`text-sm ${subtle}`}>2025</span>
            </div>
            <p className={`text-sm ${prose} mt-1`}>
              Won the Grid Enhancing Technologies Bonus Prize at the EnergyTech University Prize, organized
              by the DOE Office of Technology Commercialization. Built stochastic optimization models for
              renewable energy dispatch; presented to DOE judges among 24 national finalist teams. Project
              Solstice is a data intelligence platform connecting AI data centers with renewable energy
              projects stuck in the grid interconnection queue.
            </p>
            <a
              href="https://www.energy.gov/technologycommercialization/articles/energytech-university-prize-2025-student-winners-announced"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${accent} hover:underline mt-2 inline-block`}
            >
              DOE announcement
            </a>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Clinical Medication Extraction: LLM Evaluation Framework</span>
              <span className={`text-sm ${subtle}`}>2025</span>
            </div>
            <p className={`text-sm ${prose} mt-1`}>
              Stratified evaluation of GPT-4o, BioMistral, and a regex+RxNorm baseline on medication NER
              from clinical notes. Aggregate F1 (0.63–0.76) conceals near-complete failure on oncology drug
              classes (Drug F1: 0.14–0.35; Strength F1: 0.00–0.28). Structured missingness in extraction
              outputs biases downstream cohort selection in real-world evidence studies.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="https://github.com/jaackiekim/clinical-med-extraction" target="_blank" rel="noopener noreferrer" className={`text-sm ${accent} hover:underline`}>GitHub</a>
              <a href="/blog/medication-extraction-llm-evaluation" className={`text-sm ${accent} hover:underline`}>Blog post</a>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>NYC Transit Resilience Analysis</span>
              <span className={`text-sm ${subtle}`}>2024</span>
            </div>
            <p className={`text-sm ${prose} mt-1`}>
              Analysis of NYC public transportation vulnerability during heat events using MTA ridership,
              NOAA temperature, and census data. Identified service corridors where demand peaks coincide
              with infrastructure stress under high-heat conditions.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
