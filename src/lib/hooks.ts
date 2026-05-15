"use client";

import { useQuery } from "@tanstack/react-query";

export interface ClimateParams {
  lat?: string;
  lon?: string;
  start?: string;
  end?: string;
  type?: "monthly" | "climatology";
}

async function fetchClimate(params: ClimateParams) {
  const sp = new URLSearchParams();
  if (params.lat) sp.set("lat", params.lat);
  if (params.lon) sp.set("lon", params.lon);
  if (params.start) sp.set("start", params.start);
  if (params.end) sp.set("end", params.end);
  if (params.type) sp.set("type", params.type);

  const res = await fetch(`/api/climate?${sp.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch climate data");
  return res.json();
}

export function useClimateData(params: ClimateParams) {
  return useQuery({
    queryKey: ["climate", params],
    queryFn: () => fetchClimate(params),
  });
}
