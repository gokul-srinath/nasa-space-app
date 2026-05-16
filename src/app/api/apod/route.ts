import { NextResponse } from "next/server";

const NASA_APOD_URL = "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY";

export async function GET() {
  try {
    const res = await fetch(NASA_APOD_URL, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: `NASA APOD API returned ${res.status}` },
        { status: res.status }
      );
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch APOD", detail: String(err) },
      { status: 500 }
    );
  }
}
