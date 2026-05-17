export type TemperatureUnit = "C" | "F";

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemp(celsius: number | null | undefined, unit: TemperatureUnit): string {
  if (celsius == null || !Number.isFinite(celsius)) return "—";
  const value = unit === "F" ? toFahrenheit(celsius) : celsius;
  return `${value.toFixed(1)}°${unit}`;
}
