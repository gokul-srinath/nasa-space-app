# NASA Climate Dashboard — PRD

## Overview

A single-page dashboard that visualizes climatology data from NASA's POWER API and displays the Astronomy Picture of the Day (APOD). Built with Next.js, React Query, and Tailwind CSS.

---

## Data & API

- [x] Climate data fetched from NASA POWER API via `/api/climate` route
- [x] APOD image fetched from NASA APOD API via `/api/apod` route
- [x] API errors handled gracefully with descriptive messages
- [x] All API routes return proper HTTP status codes (upstream status forwarded, 500 for catch)
- [x] Server-side responses cached with `revalidate: 3600` (1 hour)
- [x] Client-side data cached via React Query (`staleTime: 60s` default, `1hr` for APOD)
- [ ] Environment variables used for all API keys (APOD currently uses hardcoded `DEMO_KEY`)

## UI & Visualization

- [x] Monthly temperature bar chart with color-coded bars by temperature range
- [x] Monthly precipitation bar chart
- [x] Summary stat cards (temperature, precipitation, humidity, wind speed)
- [x] Full monthly data table with all parameters
- [x] APOD banner with image, title, explanation, and copyright
- [x] Temperature unit toggle (°C / °F) in header
- [x] Hover tooltips showing detailed values on charts
- [ ] Responsive design tested on mobile breakpoints
- [ ] Loading skeleton or shimmer instead of plain spinner

## Location Support

- [x] Six preset locations (Cape Canaveral, New Delhi, London, Tokyo, São Paulo, Sydney)
- [x] Pill-style location selector with active state
- [x] Coordinates displayed for selected location
- [ ] Custom location input (latitude/longitude)

## Architecture

- [x] Next.js App Router with server-side API routes
- [x] React Query for data fetching and caching
- [x] Utility module for temperature conversion (`src/lib/temperature.ts`)
- [x] Typed interfaces for API data (`ClimateParams`, `ApodData`, `TemperatureUnit`)
- [x] Null-safe `formatTemp` with `NaN`/`undefined` handling
- [ ] Extract chart components into separate files
- [ ] Add unit tests for temperature conversion utilities

## Accessibility

- [ ] Keyboard navigation for location selector and unit toggle
- [ ] ARIA labels on interactive elements
- [ ] Sufficient color contrast on chart labels
