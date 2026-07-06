import { BodyMeasurement } from "@/types/progress";
import { format, parseISO } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";

interface ProgressChartsProps {
  measurements: BodyMeasurement[];
}

export function ProgressCharts({ measurements }: ProgressChartsProps) {
  if (!measurements || measurements.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed rounded-xl bg-muted/10">
        <p className="text-muted-foreground">No measurements recorded yet.</p>
      </div>
    );
  }

  // Format data for recharts
  const data = measurements.map(m => ({
    ...m,
    dateLabel: format(parseISO(m.record_date), "MMM dd, yyyy"),
    dateShort: format(parseISO(m.record_date), "MMM dd")
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-2 border-b pb-1">{payload[0].payload.dateLabel}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="flex justify-between gap-4">
              <span>{entry.name}:</span>
              <span className="font-mono font-medium">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Weight Chart */}
      <div className="border rounded-xl p-4 bg-card">
        <h3 className="font-semibold text-lg mb-4">Weight & BMI Trend</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-20" />
              <XAxis dataKey="dateShort" className="text-xs" tickLine={false} axisLine={false} />
              <YAxis className="text-xs" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="weight" name="Weight (kg)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorWeight)" />
              <Line type="monotone" dataKey="bmi" name="BMI" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Body Composition Chart */}
      <div className="border rounded-xl p-4 bg-card">
        <h3 className="font-semibold text-lg mb-4">Body Composition</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-20" />
              <XAxis dataKey="dateShort" className="text-xs" tickLine={false} axisLine={false} />
              <YAxis className="text-xs" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="body_fat_percentage" name="Body Fat %" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="muscle_percentage" name="Muscle %" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Measurements Chart */}
      <div className="border rounded-xl p-4 bg-card">
        <h3 className="font-semibold text-lg mb-4">Core Measurements (cm)</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-20" />
              <XAxis dataKey="dateShort" className="text-xs" tickLine={false} axisLine={false} />
              <YAxis className="text-xs" tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="chest" name="Chest" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="waist" name="Waist" stroke="#ec4899" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="hip" name="Hip" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="thigh" name="Thigh" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="biceps" name="Biceps" stroke="#84cc16" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
