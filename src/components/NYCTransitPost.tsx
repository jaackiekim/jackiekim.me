import React from 'react';
import { useTheme } from './ThemeProvider';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ─── Data ────────────────────────────────────────────────────────────────────

// Hourly ridership -- double-hump commute shape, heatwave ~15% lower.
// Unit: estimated average trips (×100,000), digitized from paper Figure 2.
const hourlyRidership = [
  { hour: 0,  heatwave: 0.55, control: 0.60 },
  { hour: 1,  heatwave: 0.48, control: 0.52 },
  { hour: 2,  heatwave: 0.44, control: 0.48 },
  { hour: 3,  heatwave: 0.46, control: 0.50 },
  { hour: 4,  heatwave: 0.58, control: 0.63 },
  { hour: 5,  heatwave: 0.82, control: 0.90 },
  { hour: 6,  heatwave: 1.30, control: 1.42 },
  { hour: 7,  heatwave: 2.00, control: 2.20 },
  { hour: 8,  heatwave: 2.65, control: 2.90 },
  { hour: 9,  heatwave: 2.30, control: 2.55 },
  { hour: 10, heatwave: 1.90, control: 2.10 },
  { hour: 11, heatwave: 1.82, control: 2.00 },
  { hour: 12, heatwave: 1.90, control: 2.10 },
  { hour: 13, heatwave: 2.00, control: 2.20 },
  { hour: 14, heatwave: 1.92, control: 2.12 },
  { hour: 15, heatwave: 2.10, control: 2.40 },
  { hour: 16, heatwave: 2.50, control: 2.88 },
  { hour: 17, heatwave: 2.88, control: 3.30 },
  { hour: 18, heatwave: 2.65, control: 3.00 },
  { hour: 19, heatwave: 2.10, control: 2.38 },
  { hour: 20, heatwave: 1.72, control: 1.92 },
  { hour: 21, heatwave: 1.42, control: 1.60 },
  { hour: 22, heatwave: 1.15, control: 1.28 },
  { hour: 23, heatwave: 0.88, control: 0.96 },
];

// Top 10 origin stations Aug 8 2022 -- exact counts from paper Table 1.
const topStations = [
  { name: 'Times Sq-42 St',     count: 8998 },
  { name: 'Fulton St',          count: 7806 },
  { name: '14 St-Union Sq',     count: 7774 },
  { name: '34 St-Herald Sq',    count: 7720 },
  { name: 'Grand Central-42',   count: 7668 },
  { name: '34 St-Penn Sta',     count: 7274 },
  { name: '59 St-Columbus Cir', count: 7211 },
  { name: '74 St-Broadway',     count: 6922 },
  { name: '14 St-8 Av',         count: 6776 },
  { name: 'Chambers St',        count: 6706 },
];

// Beach station hourly -- digitized from paper Figure 3.
// Unit: estimated average trips (×100,000).
const beachHourly = [
  { hour: 0,  heatwave: 0.42, control: 0.44 },
  { hour: 2,  heatwave: 0.38, control: 0.40 },
  { hour: 4,  heatwave: 0.40, control: 0.42 },
  { hour: 5,  heatwave: 0.48, control: 0.52 },
  { hour: 6,  heatwave: 0.58, control: 0.64 },
  { hour: 7,  heatwave: 0.72, control: 0.80 },
  { hour: 8,  heatwave: 1.38, control: 1.62 },
  { hour: 9,  heatwave: 1.52, control: 1.68 },
  { hour: 10, heatwave: 1.58, control: 1.72 },
  { hour: 11, heatwave: 1.60, control: 1.72 },
  { hour: 12, heatwave: 1.52, control: 1.65 },
  { hour: 13, heatwave: 1.42, control: 1.55 },
  { hour: 14, heatwave: 1.30, control: 1.42 },
  { hour: 15, heatwave: 1.18, control: 1.30 },
  { hour: 16, heatwave: 1.00, control: 1.12 },
  { hour: 17, heatwave: 0.85, control: 0.95 },
  { hour: 18, heatwave: 0.72, control: 0.80 },
  { hour: 19, heatwave: 0.60, control: 0.68 },
  { hour: 20, heatwave: 0.52, control: 0.58 },
  { hour: 21, heatwave: 0.46, control: 0.52 },
  { hour: 22, heatwave: 0.43, control: 0.47 },
  { hour: 23, heatwave: 0.41, control: 0.44 },
];

// HVI vs income scatter -- generated via bivariate normal (seed 42) to approximate
// r = −0.69 from the paper, with realistic spread and outliers.
const hviIncomeScatter = [
  { income: 40000, hvi: 4.2 }, { income: 49000, hvi: 4.8 }, { income: 70000, hvi: 3.4 },
  { income: 85000, hvi: 3.5 }, { income: 105000, hvi: 4.1 }, { income: 108000, hvi: 2.8 },
  { income: 111000, hvi: 2.8 }, { income: 112000, hvi: 3.2 }, { income: 116000, hvi: 2.9 },
  { income: 118000, hvi: 2.8 }, { income: 118000, hvi: 3.6 }, { income: 120000, hvi: 2.6 },
  { income: 122000, hvi: 3.6 }, { income: 128000, hvi: 3.5 }, { income: 128000, hvi: 3.6 },
  { income: 130000, hvi: 4.6 }, { income: 131000, hvi: 3.2 }, { income: 134000, hvi: 3.0 },
  { income: 134000, hvi: 4.0 }, { income: 135000, hvi: 3.5 }, { income: 135000, hvi: 2.2 },
  { income: 136000, hvi: 2.9 }, { income: 137000, hvi: 3.5 }, { income: 141000, hvi: 2.9 },
  { income: 141000, hvi: 3.1 }, { income: 144000, hvi: 3.4 }, { income: 148000, hvi: 3.6 },
  { income: 149000, hvi: 3.7 }, { income: 149000, hvi: 3.0 }, { income: 150000, hvi: 2.2 },
  { income: 152000, hvi: 2.6 }, { income: 154000, hvi: 2.9 }, { income: 159000, hvi: 3.2 },
  { income: 160000, hvi: 1.8 }, { income: 161000, hvi: 1.7 }, { income: 162000, hvi: 4.1 },
  { income: 163000, hvi: 2.3 }, { income: 164000, hvi: 2.7 }, { income: 164000, hvi: 2.8 },
  { income: 164000, hvi: 2.9 }, { income: 165000, hvi: 1.9 }, { income: 169000, hvi: 1.9 },
  { income: 169000, hvi: 3.4 }, { income: 171000, hvi: 2.9 }, { income: 172000, hvi: 1.9 },
  { income: 173000, hvi: 2.3 }, { income: 174000, hvi: 2.7 }, { income: 176000, hvi: 1.6 },
  { income: 176000, hvi: 2.1 }, { income: 181000, hvi: 2.9 }, { income: 185000, hvi: 2.3 },
  { income: 186000, hvi: 2.3 }, { income: 194000, hvi: 2.1 }, { income: 200000, hvi: 2.1 },
  { income: 214000, hvi: 1.6 },
];

// Compute OLS regression line from scatter data so it actually fits the points.
function computeRegression(data: { income: number; hvi: number }[]) {
  const n = data.length;
  const meanX = data.reduce((s, d) => s + d.income, 0) / n;
  const meanY = data.reduce((s, d) => s + d.hvi, 0) / n;
  const slope = data.reduce((s, d) => s + (d.income - meanX) * (d.hvi - meanY), 0) /
                data.reduce((s, d) => s + (d.income - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}
const { slope, intercept } = computeRegression(hviIncomeScatter);
const xMin = 38000;
const xMax = 250000;
const regressionLine = [
  { income: xMin, hvi: Math.min(5.5, slope * xMin + intercept) },
  { income: xMax, hvi: Math.max(0.5, slope * xMax + intercept) },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ChartCaption({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <p className={`text-sm text-center mt-2 mb-8 italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <h2 className={`text-2xl font-semibold mt-10 mb-4 ${theme === 'dark' ? 'text-white' : 'text-[#1a1a1a]'}`}>
      {children}
    </h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <p className={`text-lg mb-4 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-[#1a1a1a]'}`}>
      {children}
    </p>
  );
}

function DatasetLinks() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const linkClass = `underline font-medium ${dark ? 'text-[#e05555] hover:text-[#cc2222]' : 'text-[#cc2222] hover:text-[#aa1111]'}`;
  const borderColor = dark ? 'border-[#3a2022]' : 'border-gray-200';
  const headingColor = dark ? 'text-white' : 'text-[#1a1a1a]';
  const mutedColor = dark ? 'text-gray-400' : 'text-gray-500';

  const datasets = [
    {
      name: 'MTA Origin-Destination Ridership Data',
      url: 'https://new.mta.info/article/introducing-subway-origin-destination-ridership-dataset',
      desc: 'Trip-level subway ridership, 2021–2024. Used to measure ridership on heatwave and control dates.',
    },
    {
      name: 'Open-Meteo Historical Weather API',
      url: 'https://open-meteo.com/en/docs/historical-weather-api',
      desc: 'Hourly temperature and weather records. Used to identify NOAA-defined heat wave dates.',
    },
    {
      name: 'NYC Heat Vulnerability Index',
      url: 'https://a816-dohbesp.nyc.gov/IndicatorPublic/data-features/heat-vulnerability/',
      desc: 'Neighborhood-level HVI scores (1–5) from the NYC Dept. of Health, based on income, green space, AC access, and surface temperature.',
    },
    {
      name: 'American Community Survey (ACS)',
      url: 'https://www.census.gov/programs-surveys/acs',
      desc: 'Median household income by ZCTA, used to classify neighborhoods by income quintile.',
    },
  ];

  return (
    <div className={`mt-12 pt-8 border-t ${borderColor}`}>
      <h2 className={`text-xl font-semibold mb-5 ${headingColor}`}>Data Sources</h2>
      <div className="space-y-5">
        {datasets.map((d) => (
          <div key={d.name}>
            <a href={d.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {d.name}
            </a>
            <p className={`text-sm mt-1 ${mutedColor}`}>{d.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NYCTransitPost() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const axisColor = dark ? '#9ca3af' : '#4b5563';
  const gridColor = dark ? '#374151' : '#e5e7eb';
  const blue = '#cc2222';
  const red = '#dc2626';
  const labelStyle = { fill: axisColor, fontSize: 12 };
  const tooltipStyle = { background: dark ? '#1f2937' : '#fff', border: `1px solid ${gridColor}`, color: dark ? '#e5e7eb' : '#1a1a1a', fontSize: 12 };

  return (
    <div>
      <p className={`text-sm mb-8 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        Rowan Wu, Jackie Kim, Cornell Tech, 2024
      </p>

      <Prose>
        We started this project on an unseasonably warm November day, which felt fitting. The question was simple enough: do New Yorkers take the subway differently during heat waves? And does it matter who you are or where you live?
      </Prose>
      <Prose>
        We used the MTA's origin-destination ridership data from August 2022 and September 2023, matched against NOAA heat wave dates (three or more consecutive days above 90°F), and layered in neighborhood-level income data from the American Community Survey and Heat Vulnerability Index scores from the NYC Department of Health. HVI is a 1–5 score capturing how likely residents in a given neighborhood are to die during extreme heat, based on factors like green space, access to home AC, surface temperature, and income.
      </Prose>

      <SectionHeading>Overall ridership drops, but the shape of the day holds</SectionHeading>
      <Prose>
        Ridership falls about 15% on heat wave days, but the hourly curve (the double-hump of morning and evening rush) barely changes shape. The effect is stronger in August than early September, which probably has more to do with seasonal travel patterns than temperature alone. People still have to get to work.
      </Prose>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={hourlyRidership} margin={{ top: 10, right: 20, left: 20, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="hour" tick={{ fill: axisColor, fontSize: 11 }} label={{ value: 'Hour of Day', position: 'insideBottom', offset: -12, style: labelStyle }} />
          <YAxis tick={{ fill: axisColor, fontSize: 11 }} label={{ value: 'Avg trips (×100k)', angle: -90, position: 'insideLeft', offset: 14, style: labelStyle }} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`${v}×100k trips`, '']} />
          <Line type="monotone" dataKey="heatwave" name="Aug 8, 2022 (Heatwave)" stroke={red} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <ChartCaption>Hourly ridership on August 8, 2022 (heatwave). The double-hump commute curve holds. Values reconstructed from paper Figure 2.</ChartCaption>

      <SectionHeading>Where people go doesn't change</SectionHeading>
      <Prose>
        One of the more surprising results: destination patterns didn't shift at all. The top origin stations on a heat wave day are nearly identical to a normal day. The numbers below are from August 8, 2022, and the paper reports the rankings and volumes are essentially indistinguishable from control dates.
      </Prose>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={topStations} layout="vertical" margin={{ top: 10, right: 40, left: 140, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis type="number" tick={{ fill: axisColor, fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`} />
          <YAxis type="category" dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} width={135} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [v.toLocaleString(), 'Trips']} />
          <Bar dataKey="count" name="Trips (Aug 8, 2022)" fill={blue} opacity={0.85} barSize={10} />
        </BarChart>
      </ResponsiveContainer>
      <ChartCaption>Top 10 origin stations on August 8, 2022. Exact counts from paper Table 1. The paper reports these rankings are nearly identical on non-heatwave dates.</ChartCaption>

      <Prose>
        The subway-as-escape-route during a heat wave turns out to be mostly a myth, at least in this data. Ridership to beach stations near Coney Island and the Rockaways was actually slightly higher on non-heat wave days, mostly because those September control dates happened to fall on Thursdays and Fridays. On the days people did make it to the beach, they overwhelmingly arrived around 8am.
      </Prose>

      <SectionHeading>Where income and vulnerability diverge</SectionHeading>
      <Prose>
        The neighborhood-level analysis is where the structural story shows up. Income and HVI are strongly negatively correlated (r = −0.69): wealthier neighborhoods have more trees, better AC access, lower surface temperatures. This sets up the transit finding.
      </Prose>

      <ResponsiveContainer width="100%" height={320}>
        <ScatterChart margin={{ top: 10, right: 20, left: 20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="income" name="Income" type="number" domain={[xMin, xMax]}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            tick={{ fill: axisColor, fontSize: 11 }}
            label={{ value: 'Median Household Income (2022 inflation-adjusted)', position: 'insideBottom', offset: -24, style: labelStyle }}
          />
          <YAxis
            dataKey="hvi" name="HVI" type="number" domain={[0.5, 5.5]} ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: axisColor, fontSize: 11 }}
            label={{ value: 'Heat Vulnerability Index (1–5)', angle: -90, position: 'insideLeft', offset: 16, style: labelStyle }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={tooltipStyle}
            formatter={(value: number, name: string) => [
              name === 'income' ? `$${value.toLocaleString()}` : value,
              name === 'income' ? 'Income' : 'HVI'
            ]}
          />
          {/* Regression line computed from actual data points */}
          <Scatter data={regressionLine} line={{ stroke: red, strokeWidth: 2, strokeDasharray: '6 3' }} shape={() => null} legendType="none" />
          <Scatter data={hviIncomeScatter} fill={blue} opacity={0.65} name="Neighborhood" />
        </ScatterChart>
      </ResponsiveContainer>
      <ChartCaption>Median household income vs. Heat Vulnerability Index by NYC neighborhood (r = −0.69). Scatter approximates the distribution reported in the paper; regression line is computed from these points.</ChartCaption>

      <SectionHeading>Who changes behavior, and who doesn't</SectionHeading>
      <Prose>
        We split stations into four neighborhood quadrants across income and HVI, then ran regressions to assess how temperature affects ridership in each. Only high-income areas show a meaningful response to heat: ridership ticks up slightly as temperatures rise, likely reflecting discretionary travel. Low-income, high-HVI neighborhoods are essentially flat. Their transit patterns don't change because their transit dependence doesn't.
      </Prose>

      <SectionHeading>What this doesn't answer</SectionHeading>
      <Prose>
        The dataset has real limits. Not all heat wave dates were available in the MTA data. The O/D data estimates destinations statistically rather than tracking individual rides end-to-end. We worked with sampled subsets of datasets with hundreds of millions of rows, and our heat wave definition is strict, so broadening it would probably surface different signal.
      </Prose>
      <Prose>
        The linear regression R-squared scores were weak across all neighborhood types, which means temperature alone is a poor predictor of ridership. That's actually a useful finding: the story isn't really about temperature. It's about the other things temperature correlates with.
      </Prose>

      <SectionHeading>The bigger point</SectionHeading>
      <Prose>
        The subway gets described as a great equalizer, the one place in New York where everyone shares the same experience. This research complicates that a little. The reasons people take it, and whether heat changes those reasons, are shaped by income and geography in ways that aren't random. As the city plans for more extreme heat, understanding where transit reliance is highest and where cooling infrastructure is thinnest matters for where to direct resources.
      </Prose>
      <Prose>
        Also, air-conditioned subway platforms would help.
      </Prose>

      <DatasetLinks />
    </div>
  );
}

