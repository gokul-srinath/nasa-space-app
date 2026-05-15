import { NextRequest, NextResponse } from "next/server";

const POWER_BASE = "https://power.larc.nasa.gov/api/temporal";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") || "daily";
  const lat = searchParams.get("lat") || "28.6";
  const lon = searchParams.get("lon") || "-80.6";
  const start = searchParams.get("start") || "20240101";
  const end = searchParams.get("end") || "20241231";

  const params = [
    "T2M",
    "T2M_MAX",
    "T2M_MIN",
    "PRECTOTCORR",
    "RH2M",
    "WS2M",
  ].join(",");

  let url: string;

  if (type === "climatology") {
    url = `${POWER_BASE}/climatology/point?parameters=${params}&community=AG&longitude=${lon}&latitude=${lat}&format=JSON`;
  } else {
    url = `${POWER_BASE}/monthly/point?parameters=${params}&community=AG&longitude=${lon}&latitude=${lat}&start=${start.slice(0, 4)}&end=${end.slice(0, 4)}&format=JSON`;
  }

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    // console.log(await res.json());
    if (!res.ok) {
      return NextResponse.json(
        { error: `NASA API returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch NASA climate data - " + String(err) },
      { status: 500 }
    );
  }
}
