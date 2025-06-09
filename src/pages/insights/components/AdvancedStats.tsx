import { useState } from 'react';
import { BarChart2, ChevronDown } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  acplData,
  ecoData,
  lossReasonsData,
  timeControlData,
} from '@/mock/insightsChartData';

export default function AdvancedStats() {
  const [showCharts, setShowCharts] = useState(false);

  return (
    <>
      <div className="mb-6 flex justify-start">
        <button
          className="flex items-center text-base font-semibold text-blue-400 hover:underline"
          onClick={() => setShowCharts((v) => !v)}
        >
          <BarChart2 className="mr-1 h-4 w-4" />
          {showCharts ? 'Hide Stats' : 'More Stats'}
          <ChevronDown
            className={`ml-1 h-4 w-4 transition-transform ${showCharts ? 'rotate-180' : ''}`}
          />
        </button>
      </div>
      {showCharts && (
        <section className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-semibold text-stone-100">
              Strength by Opening
            </h2>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={ecoData}>
                  <PolarGrid stroke="#444" />
                  <PolarAngleAxis dataKey="eco" stroke="#888" />
                  <PolarRadiusAxis stroke="#888" />
                  <Radar
                    dataKey="score"
                    stroke="#60a5fa"
                    fill="#60a5fa"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-stone-100">
              Average CP Loss by Phase
            </h2>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={acplData} margin={{ left: -20, right: 20 }}>
                  <XAxis dataKey="phase" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="acpl"
                    stroke="#a78bfa"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-stone-100">
              Reason for Loss
            </h2>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={lossReasonsData}
                  margin={{ left: -20, right: 20 }}
                >
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="reason" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="games" fill="#f472b6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold text-stone-100">
              Impulsive vs Slow
            </h2>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timeControlData}
                  margin={{ left: -20, right: 20 }}
                >
                  <CartesianGrid stroke="#444" />
                  <XAxis dataKey="control" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="impulsive" fill="#60a5fa" />
                  <Bar dataKey="slow" fill="#c084fc" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
