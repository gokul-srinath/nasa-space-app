"use client";

import { useState } from "react";
import { useClimateData } from "@/lib/hooks";

const LOCATIONS = [
  { label: "Cape Canaveral, FL", lat: "28.6", lon: "-80.6" },
  { label: "New Delhi, India", lat: "28.6", lon: "77.2" },
  { label: "London, UK", lat: "51.5", lon: "-0.1" },
  { label: "Tokyo, Japan", lat: "35.7", lon: "139.7" },
  { label: "São Paulo, Brazil", lat: "-23.5", lon: "-46.6" },
  { label: "Sydney, Australia", lat: "-33.9", lon: "151.2" },
] as const;

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function ClimatologyGrid({
  parameters,
}: {
  parameters: Record<string, Record<string, number>>;
}) {
  const temp = parameters?.T2M;
  const tempMax = parameters?.T2M_MAX;
  const tempMin = parameters?.T2M_MIN;
  const precip = parameters?.PRECTOTCORR;
  const humidity = parameters?.RH2M;
  const wind = parameters?.WS2M;

  if (!temp) return null;

  const months = MONTH_LABELS.map((_, i) => String(i + 1));

  return (
    <div className="space-y-8">
      {/* Temperature Chart */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">
          Monthly Average Temperature (°C)
        </h3>
        <div className="flex items-end gap-1.5 h-48">
          {months.map((m) => {
            const val = temp[m] ?? 0;
            const max = tempMax?.[m] ?? val;
            const min = tempMin?.[m] ?? val;
            const barHeight = Math.max(((val + 10) / 55) * 100, 4);
            const hue = val < 0 ? 210 : val < 15 ? 190 : val < 25 ? 30 : 0;
            const sat = Math.min(80, 40 + Math.abs(val) * 2);
            return (
              <div
                key={m}
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                <div className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {max.toFixed(1)}°
                </div>
                <div
                  className="w-full rounded-t-md transition-all duration-300 hover:opacity-80 relative"
                  style={{
                    height: `${barHeight}%`,
                    backgroundColor: `hsl(${hue}, ${sat}%, 55%)`,
                  }}
                  title={`Avg: ${val.toFixed(1)}°C | Max: ${max.toFixed(1)}°C | Min: ${min.toFixed(1)}°C`}
                />
                <span className="text-[10px] font-mono text-zinc-500">
                  {MONTH_LABELS[Number(m) - 1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Avg Temperature"
          value={`${temp["13"]?.toFixed(1) ?? "—"}°C`}
          sub="Annual mean"
          color="text-amber-400"
        />
        <StatCard
          label="Precipitation"
          value={`${precip?.["13"]?.toFixed(1) ?? "—"} mm/day`}
          sub="Annual mean"
          color="text-blue-400"
        />
        <StatCard
          label="Humidity"
          value={`${humidity?.["13"]?.toFixed(1) ?? "—"}%`}
          sub="Relative, 2m"
          color="text-emerald-400"
        />
        <StatCard
          label="Wind Speed"
          value={`${wind?.["13"]?.toFixed(1) ?? "—"} m/s`}
          sub="At 2m height"
          color="text-violet-400"
        />
      </div>

      {/* Precipitation Bars */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <h3 className="text-sm font-medium text-zinc-400 mb-4">
          Monthly Precipitation (mm/day)
        </h3>
        <div className="flex items-end gap-1.5 h-36">
          {months.map((m) => {
            const val = precip?.[m] ?? 0;
            const maxPrecip = Math.max(
              ...months.map((mo) => precip?.[mo] ?? 0),
              1
            );
            const barHeight = Math.max((val / maxPrecip) * 100, 2);
            return (
              <div
                key={m}
                className="flex-1 flex flex-col items-center gap-1 group"
              >
                <div className="text-[10px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  {val.toFixed(1)}
                </div>
                <div
                  className="w-full rounded-t-md bg-blue-500/80 transition-all duration-300 hover:bg-blue-400"
                  style={{ height: `${barHeight}%` }}
                  title={`${val.toFixed(2)} mm/day`}
                />
                <span className="text-[10px] font-mono text-zinc-500">
                  {MONTH_LABELS[Number(m) - 1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left p-3 text-zinc-400 font-medium">
                Month
              </th>
              <th className="text-right p-3 text-zinc-400 font-medium">
                Temp °C
              </th>
              <th className="text-right p-3 text-zinc-400 font-medium">
                Max °C
              </th>
              <th className="text-right p-3 text-zinc-400 font-medium">
                Min °C
              </th>
              <th className="text-right p-3 text-zinc-400 font-medium">
                Rain mm/d
              </th>
              <th className="text-right p-3 text-zinc-400 font-medium">
                Humidity %
              </th>
              <th className="text-right p-3 text-zinc-400 font-medium">
                Wind m/s
              </th>
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr
                key={m}
                className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors"
              >
                <td className="p-3 text-zinc-300">
                  {MONTH_LABELS[Number(m) - 1]}
                </td>
                <td className="p-3 text-right font-mono text-zinc-300">
                  {temp[m]?.toFixed(1)}
                </td>
                <td className="p-3 text-right font-mono text-zinc-300">
                  {tempMax?.[m]?.toFixed(1)}
                </td>
                <td className="p-3 text-right font-mono text-zinc-300">
                  {tempMin?.[m]?.toFixed(1)}
                </td>
                <td className="p-3 text-right font-mono text-zinc-300">
                  {precip?.[m]?.toFixed(2)}
                </td>
                <td className="p-3 text-right font-mono text-zinc-300">
                  {humidity?.[m]?.toFixed(1)}
                </td>
                <td className="p-3 text-right font-mono text-zinc-300">
                  {wind?.[m]?.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <p className="text-xs text-zinc-500 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${color}`}>{value}</p>
      <p className="text-[10px] text-zinc-600 mt-1">{sub}</p>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-blue-500" />
    </div>
  );
}

export default function Home() {
  const [locationIdx, setLocationIdx] = useState(0);
  const loc = LOCATIONS[locationIdx];

  const { data, isLoading, isError, error } = useClimateData({
    lat: loc.lat,
    lon: loc.lon,
    type: "climatology",
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">
              N
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">
                NASA Climate Dashboard
              </h1>
              <p className="text-[11px] text-zinc-500">
                Powered by NASA POWER API
              </p>
            </div>
          </div>
          <a
            href="https://power.larc.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Data Source ↗
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Location Selector */}
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((l, i) => (
              <button
                key={l.label}
                onClick={() => setLocationIdx(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  i === locationIdx
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="text-sm text-zinc-500">
            Coordinates: {loc.lat}°N, {loc.lon}°E
          </div>

          {/* Content */}
          {isLoading && <Spinner />}

          {isError && (
            <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-sm text-red-400">
              Failed to load climate data:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </div>
          )}

          {data?.properties?.parameter && (
            <ClimatologyGrid parameters={data.properties.parameter} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-[11px] text-zinc-600">
          <span>Data: NASA Langley POWER Project</span>
          <span>
            Parameters: T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, RH2M, WS2M
          </span>
        </div>
      </footer>
    </div>
  );
}
