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

      <p className={`text-lg mb-10 leading-relaxed ${prose}`}>
        Applied ML researcher focused on building rigorous, domain-aware systems — from NLP pipelines
        on clinical text to evaluation frameworks that surface where models fail. I care about the gap
        between benchmark performance and real-world fitness, and I build toward closing it.
      </p>

      <hr className={`border-t ${divider} mb-10`} />

      {/* Education */}
      <section className="mb-10">
        <h2 className={`text-xs uppercase tracking-widest font-semibold mb-6 ${subtle}`}>Education</h2>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Cornell University</span>
              <span className={`text-sm ${subtle}`}>2023 – 2025</span>
            </div>
            <p className={`text-sm ${prose}`}>M.S. Information Science</p>
            <p className={`text-sm ${subtle} mt-1`}>Coursework: Machine Learning, Natural Language Processing, Applied Statistics, Data-Driven Web Applications</p>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>University of California, San Diego</span>
              <span className={`text-sm ${subtle}`}>2018 – 2022</span>
            </div>
            <p className={`text-sm ${prose}`}>B.S. Data Science</p>
          </div>
        </div>
      </section>

      <hr className={`border-t ${divider} mb-10`} />

      {/* Skills */}
      <section className="mb-10">
        <h2 className={`text-xs uppercase tracking-widest font-semibold mb-6 ${subtle}`}>Skills</h2>
        <div className="space-y-3">
          <div>
            <span className={`text-sm font-semibold ${heading}`}>Languages: </span>
            <span className={`text-sm ${prose}`}>Python, SQL, R</span>
          </div>
          <div>
            <span className={`text-sm font-semibold ${heading}`}>ML & NLP: </span>
            <span className={`text-sm ${prose}`}>large language models, named entity recognition, fine-tuning, evaluation design, inter-annotator agreement, statistical modeling</span>
          </div>
          <div>
            <span className={`text-sm font-semibold ${heading}`}>Data: </span>
            <span className={`text-sm ${prose}`}>clinical text (EHR, medical transcripts), unstructured text, time series, geospatial data</span>
          </div>
          <div>
            <span className={`text-sm font-semibold ${heading}`}>Tools: </span>
            <span className={`text-sm ${prose}`}>PyTorch, HuggingFace, scikit-learn, pandas, OpenAI API, RxNorm, Git</span>
          </div>
        </div>
      </section>

      <hr className={`border-t ${divider} mb-10`} />

      {/* Work Experience */}
      <section className="mb-10">
        <h2 className={`text-xs uppercase tracking-widest font-semibold mb-6 ${subtle}`}>Work Experience</h2>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Data Science Intern</span>
              <span className={`text-sm ${subtle}`}>2024</span>
            </div>
            <a
              href="https://www.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${accent} hover:underline`}
            >
              Apple, Siri Research
            </a>
            <ul className={`mt-2 space-y-1 text-sm ${prose} list-disc list-inside`}>
              <li>Built inter-annotator agreement framework for voice assistant evaluation; switched from Cohen's to Fleiss' kappa to handle multi-rater structure</li>
              <li>Identified bimodal IAA distribution signaling systematic annotator disagreement on a specific task subtype; set data-driven quality threshold</li>
              <li>Reduced annotation operational costs by ~15% through targeted rater calibration and task scoping</li>
            </ul>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Data Science Intern</span>
              <span className={`text-sm ${subtle}`}>2023</span>
            </div>
            <a
              href="https://www.jpl.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm ${accent} hover:underline`}
            >
              NASA Jet Propulsion Laboratory
            </a>
            <ul className={`mt-2 space-y-1 text-sm ${prose} list-disc list-inside`}>
              <li>Developed ML pipelines for remote sensing data analysis in high-stakes scientific environments</li>
              <li>Worked within domain-expert teams where data quality and methodological rigor were non-negotiable</li>
            </ul>
          </div>
        </div>
      </section>

      <hr className={`border-t ${divider} mb-10`} />

      {/* Projects */}
      <section className="mb-10">
        <h2 className={`text-xs uppercase tracking-widest font-semibold mb-6 ${subtle}`}>Selected Projects</h2>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>Clinical Medication Extraction: LLM Evaluation Framework</span>
              <span className={`text-sm ${subtle}`}>2025</span>
            </div>
            <p className={`text-sm ${prose} mt-1`}>
              Stratified evaluation of GPT-4o, BioMistral, and a regex+RxNorm baseline on medication NER
              from clinical notes. Core finding: aggregate F1 (0.63–0.76) conceals near-complete failure on
              oncology drug classes (Drug F1: 0.14–0.35; Strength F1: 0.00–0.28). Demonstrates that
              structured missingness in extraction outputs biases downstream cohort selection in real-world
              evidence studies. Few-shot prompting degraded recall via formatting bias from in-context examples.
            </p>
            <div className="flex gap-4 mt-2">
              <a
                href="https://github.com/jaackiekim/clinical-med-extraction"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm ${accent} hover:underline`}
              >
                GitHub
              </a>
              <a
                href="/blog/medication-extraction-llm-evaluation"
                className={`text-sm ${accent} hover:underline`}
              >
                Blog post
              </a>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className={`font-semibold ${heading}`}>NYC Transit Resilience Analysis</span>
              <span className={`text-sm ${subtle}`}>2024</span>
            </div>
            <p className={`text-sm ${prose} mt-1`}>
              Analysis of NYC public transportation vulnerability during heat events using MTA ridership,
              NOAA temperature, and census data. Identified service corridors where ridership demand peaks
              coincide with infrastructure stress under high-heat conditions.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
