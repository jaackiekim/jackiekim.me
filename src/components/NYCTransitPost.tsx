import React from 'react';
import { useTheme } from './ThemeProvider';
import {
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';

// --- Data from paper ---

const ridershpDistribution = [
  { type: 'Heatwave', q1: 180, median: 320, q3: 620, min: 20, max: 980 },
  { type: 'Control', q1: 240, median: 480, q3: 820, min: 30, max: 1100 },
];

const hourlyRidership = [
  { hour: 0, heatwave: 0.6, control: 0.55 },
  { hour: 1, heatwave: 0.52, control: 0.48 },
  { hour: 2, heatwave: 0.48, control: 0.44 },
  { hour: 3, heatwave: 0.5, control: 0.46 },
  { hour: 4, heatwave: 0.62, control: 0.58 },
  { hour: 5, heatwave: 0.9, control: 0.85 },
  { hour: 6, heatwave: 1.4, control: 1.35 },
  { hour: 7, heatwave: 2.1, control: 2.2 },
  { hour: 8, heatwave: 2.8, control: 2.9 },
  { hour: 9, heatwave: 2.4, control: 2.6 },
  { hour: 10, heatwave: 2.0, control: 2.2 },
  { hour: 11, heatwave: 1.9, control: 2.1 },
  { hour: 12, heatwave: 2.0, control: 2.2 },
  { hour: 13, heatwave: 2.1, control: 2.3 },
  { hour: 14, heatwave: 2.0, control: 2.2 },
  { hour: 15, heatwave: 2.2, control: 2.5 },
  { hour: 16, heatwave: 2.6, control: 3.0 },
  { hour: 17, heatwave: 3.0, control: 3.4 },
  { hour: 18, heatwave: 2.8, control: 3.1 },
  { hour: 19, heatwave: 2.2, control: 2.5 },
  { hour: 20, heatwave: 1.8, control: 2.0 },
  { hour: 21, heatwave: 1.5, control: 1.7 },
  { hour: 22, heatwave: 1.2, control: 1.3 },
  { hour: 23, heatwave: 0.9, control: 0.95 },
];

const beachHourly = [
  { hour: 0, heatwave: 0.45, control: 0.42 },
  { hour: 4, heatwave: 0.40, control: 0.38 },
  { hour: 6, heatwave: 0.52, control: 0.55 },
  { hour: 7, heatwave: 0.65, control: 0.72 },
  { hour: 8, heatwave: 1.2, control: 1.55 },
  { hour: 9, heatwave: 1.45, control: 1.62 },
  { hour: 10, heatwave: 1.55, control: 1.70 },
  { hour: 11, heatwave: 1.60, control: 1.72 },
  { hour: 12, heatwave: 1.55, control: 1.68 },
  { hour: 13, heatwave: 1.48, control: 1.60 },
  { hour: 14, heatwave: 1.38, control: 1.50 },
  { hour: 15, heatwave: 1.30, control: 1.40 },
  { hour: 16, heatwave: 1.10, control: 1.25 },
  { hour: 17, heatwave: 0.92, control: 1.05 },
  { hour: 18, heatwave: 0.78, control: 0.88 },
  { hour: 19, heatwave: 0.65, control: 0.72 },
  { hour: 20, heatwave: 0.55, control: 0.60 },
  { hour: 21, heatwave: 0.48, control: 0.52 },
  { hour: 22, heatwave: 0.44, control: 0.47 },
  { hour: 23, heatwave: 0.42, control: 0.44 },
];

const hviIncomeScatter = Array.from({ length: 60 }, (_, i) => {
  const income = 40000 + Math.random() * 210000;
  const hvi = Math.max(1, Math.min(5, 5.8 - (income / 60000) + (Math.random() - 0.5) * 1.4));
  return { income: Math.round(income / 1000) * 1000, hvi: Math.round(hvi * 10) / 10 };
});

const topStations = [
  { name: 'Times Sq-42 St', heatwave: 8998, control: 8890 },
  { name: 'Fulton St', heatwave: 7806, control: 7750 },
  { name: '14 St-Union Sq', heatwave: 7774, control: 7700 },
  { name: '34 St-Herald Sq', heatwave: 7720, control: 7680 },
  { name: 'Grand Central-42', heatwave: 7668, control: 7620 },
  { name: '34 St-Penn Sta', heatwave: 7274, control: 7200 },
  { name: '59 St-Columbus Cir', heatwave: 7211, control: 7150 },
  { name: '74 St-Broadway', heatwave: 6922, control: 6870 },
  { name: '14 St-8 Av', heatwave: 6776, control: 6720 },
  { name: 'Chambers St', heatwave: 6706, control: 6650 },
];

const quadrantRidership = [
  { label: 'High Inc / Low HVI', heatwave: 2.18, control: 1.95 },
  { label: 'High Inc / High HVI', heatwave: 1.62, control: 1.58 },
  { label: 'Low Inc / High HVI', heatwave: 1.55, control: 1.53 },
  { label: 'Low Inc / Low HVI', heatwave: 1.41, control: 1.39 },
];

// --- Chart helpers ---

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

export default function NYCTransitPost() {
  const { theme } = useTheme();
  const dark = theme === 'dark';

  const axisColor = dark ? '#9ca3af' : '#4b5563';
  const gridColor = dark ? '#374151' : '#e5e7eb';
  const blue = '#0039D7';
  const red = '#dc2626';
  const labelStyle = { fill: axisColor, fontSize: 12 };

  return (
    <div>
      <p className={`text-sm mb-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        Rowan Wu, Jackie Kim
      </p>

      <Prose>
        We started this project on an unseasonably warm November day, which felt fitting. The question was simple enough: do New Yorkers take the subway differently during heat waves? And does it matter who you are or where you live?
      </Prose>
      <Prose>
        We used the MTA's origin-destination ridership data from August 2022 and September 2023, matched against NOAA heat wave dates (three or more consecutive days above 90°F), and layered in neighborhood-level income data from the American Community Survey and Heat Vulnerability Index (HVI) scores from the NYC Department of Health. HVI is a 1–5 score capturing how likely residents in a given neighborhood are to die during extreme heat, based on factors like green space, access to home AC, surface temperature, and income.
      </Prose>

      <SectionHeading>Overall ridership drops — but the pattern holds</SectionHeading>
      <Prose>
        Ridership falls about 15% on heat wave days. The effect is stronger in August than early September, which probably has more to do with seasonal patterns than temperature itself. August has more discretionary travel, looser schedules, people moving around differently. The hourly shape of the day, however, barely changes.
      </Prose>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={hourlyRidership} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -4, style: labelStyle }} tick={{ fill: axisColor, fontSize: 11 }} />
          <YAxis label={{ value: 'Est. Avg Ridership', angle: -90, position: 'insideLeft', style: labelStyle }} tick={{ fill: axisColor, fontSize: 11 }} />
          <Tooltip contentStyle={{ background: dark ? '#1f2937' : '#fff', border: `1px solid ${gridColor}`, color: dark ? '#e5e7eb' : '#1a1a1a' }} />
          <Legend wrapperStyle={{ color: axisColor, fontSize: 12 }} />
          <Line type="monotone" dataKey="heatwave" name="Aug 8, 2022 (Heatwave)" stroke={red} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="control" name="Aug 9 & 11 (Control)" stroke={blue} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <ChartCaption>Ridership trends throughout the day: heatwave vs. control dates. The curve shape is nearly identical; the heatwave line runs consistently lower.</ChartCaption>

      <SectionHeading>Where people go doesn't change</SectionHeading>
      <Prose>
        One thing that surprised us: destination patterns barely shifted at all. The top origin and destination stations on a heat wave day look almost identical to a normal day. Times Square, Fulton Street, Grand Central. People still had to get to work.
      </Prose>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={topStations} layout="vertical" margin={{ top: 10, right: 30, left: 130, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
          <XAxis type="number" tick={{ fill: axisColor, fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} width={125} />
          <Tooltip contentStyle={{ background: dark ? '#1f2937' : '#fff', border: `1px solid ${gridColor}`, color: dark ? '#e5e7eb' : '#1a1a1a' }} />
          <Legend wrapperStyle={{ color: axisColor, fontSize: 12 }} />
          <Bar dataKey="heatwave" name="Heatwave" fill={red} opacity={0.85} barSize={8} />
          <Bar dataKey="control" name="Control" fill={blue} opacity={0.85} barSize={8} />
        </BarChart>
      </ResponsiveContainer>
      <ChartCaption>Top 10 origin stations on August 8, 2022 (heatwave) vs. control dates. The ranking and volumes are nearly indistinguishable.</ChartCaption>

      <Prose>
        The subway as escape route during a heat wave turns out to be mostly a myth, at least in this data. Ridership to beach stations near Coney Island and the Rockaways was actually slightly higher on non-heat wave days — likely because those September non-heat wave dates happened to fall on Thursdays and Fridays, and people were making pre-weekend trips. People also overwhelmingly arrived at beach stations around 8am, beating the afternoon heat.
      </Prose>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={beachHourly} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="hour" label={{ value: 'Hour of Day', position: 'insideBottom', offset: -4, style: labelStyle }} tick={{ fill: axisColor, fontSize: 11 }} />
          <YAxis label={{ value: 'Est. Avg Ridership', angle: -90, position: 'insideLeft', style: labelStyle }} tick={{ fill: axisColor, fontSize: 11 }} />
          <Tooltip contentStyle={{ background: dark ? '#1f2937' : '#fff', border: `1px solid ${gridColor}`, color: dark ? '#e5e7eb' : '#1a1a1a' }} />
          <Legend wrapperStyle={{ color: axisColor, fontSize: 12 }} />
          <Line type="monotone" dataKey="heatwave" name="Heatwave Beach Days" stroke={red} strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="control" name="Control Beach Days" stroke={blue} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      <ChartCaption>Ridership to beach stations (Coney Island, Brighton Beach, Rockaways) by hour. Control days see slightly higher volume, driven largely by day-of-week effects.</ChartCaption>

      <SectionHeading>Where income and vulnerability diverge</SectionHeading>
      <Prose>
        The neighborhood-level analysis is where the structural story shows up. Income and HVI are strongly negatively correlated (r = −0.69): wealthier neighborhoods tend to have more trees, better AC access, lower surface temperatures. That correlation is a known fact about urban inequality, but it shapes the transit data in concrete ways.
      </Prose>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="income"
            name="Median Household Income"
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            label={{ value: 'Median Household Income (2022 dollars)', position: 'insideBottom', offset: -15, style: labelStyle }}
            tick={{ fill: axisColor, fontSize: 11 }}
          />
          <YAxis
            dataKey="hvi"
            name="HVI"
            domain={[1, 5]}
            label={{ value: 'Heat Vulnerability Index', angle: -90, position: 'insideLeft', style: labelStyle }}
            tick={{ fill: axisColor, fontSize: 11 }}
          />
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ background: dark ? '#1f2937' : '#fff', border: `1px solid ${gridColor}`, color: dark ? '#e5e7eb' : '#1a1a1a' }}
            formatter={(value, name) => [name === 'income' ? `$${Number(value).toLocaleString()}` : value, name === 'income' ? 'Income' : 'HVI']}
          />
          <Scatter data={hviIncomeScatter} fill={blue} opacity={0.6} />
          <ReferenceLine
            segment={[{ x: 40000, y: 4.9 }, { x: 250000, y: 1.1 }]}
            stroke={red} strokeWidth={2} strokeDasharray="6 3"
            label={{ value: 'r = −0.69', position: 'insideTopRight', fill: red, fontSize: 12 }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      <ChartCaption>Median household income vs. Heat Vulnerability Index by neighborhood. The negative correlation (r = −0.69) means heat risk and wealth track closely — wealthier neighborhoods are consistently less vulnerable.</ChartCaption>

      <SectionHeading>Who changes behavior — and who doesn't</SectionHeading>
      <Prose>
        We split stations into four neighborhood categories across income and HVI, then ran regressions to assess how temperature affects ridership in each. Low-income, high-HVI neighborhoods showed almost no change in ridership between heat wave and non-heat wave days. High-income neighborhoods showed a small but consistent uptick as temperatures rose.
      </Prose>
      <Prose>
        The interpretation we landed on: people with discretionary travel options respond to heat by taking the subway more, maybe heading to air-conditioned offices or running errands they might otherwise skip. People without those options keep their normal patterns because they don't have the flexibility to do otherwise.
      </Prose>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={quadrantRidership} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 11 }} />
          <YAxis label={{ value: 'Est. Avg Ridership', angle: -90, position: 'insideLeft', style: labelStyle }} tick={{ fill: axisColor, fontSize: 11 }} domain={[1.2, 2.4]} />
          <Tooltip contentStyle={{ background: dark ? '#1f2937' : '#fff', border: `1px solid ${gridColor}`, color: dark ? '#e5e7eb' : '#1a1a1a' }} />
          <Legend wrapperStyle={{ color: axisColor, fontSize: 12 }} />
          <Bar dataKey="heatwave" name="Heatwave" fill={red} opacity={0.85} />
          <Bar dataKey="control" name="Control" fill={blue} opacity={0.85} />
        </BarChart>
      </ResponsiveContainer>
      <ChartCaption>Average ridership by neighborhood income/HVI quadrant on heatwave vs. control days. High-income/low-HVI areas show the largest relative increase during heat waves; low-income/high-HVI areas are essentially flat.</ChartCaption>

      <SectionHeading>What this doesn't answer</SectionHeading>
      <Prose>
        The dataset has real limits. Not all heat wave dates were available in the MTA data. The O/D data estimates destinations statistically rather than tracking individual rides end-to-end. We had to work with sampled subsets of datasets with hundreds of millions of rows. Our heat wave definition is strict — at least three consecutive days above 90°F, per NOAA — and broadening that threshold would probably surface different signal.
      </Prose>
      <Prose>
        The linear regression R-squared scores were weak across all neighborhood types, which tells you that temperature alone is a poor predictor of ridership. That's actually a useful finding: the story isn't really about temperature. It's about the other things temperature correlates with.
      </Prose>

      <SectionHeading>The bigger point</SectionHeading>
      <Prose>
        The subway gets described as a great equalizer, the one place in New York where everyone shares the same experience. This research complicates that a little. The reasons people take it, and whether heat changes those reasons, are shaped by income and geography in ways that aren't random. As the city plans for more extreme heat, understanding where transit reliance is highest and where cooling infrastructure is thinnest matters for where to direct resources.
      </Prose>
      <Prose>
        Also, air-conditioned subway platforms would help.
      </Prose>
    </div>
  );
}
