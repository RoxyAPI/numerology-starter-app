# Agents Guide

This is a RoxyAPI starter app. A Pythagorean numerology calculator built with React Native, Expo SDK 54, and TypeScript. Demonstrates Life Path, Expression, Soul Urge, Personal Year, full numerology charts, and compatibility, with Master Number and Karmic Debt detection, all powered by the RoxyAPI Numerology API.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Create `.env` in the project root with:
  - `EXPO_PUBLIC_ROXYAPI_KEY=your_api_key_here`
  - `EXPO_PUBLIC_ROXYAPI_BASE_URL=https://roxyapi.com/api/v2`
- Install with `npm install`
- Run with `npm start`, then `npm run ios`, `npm run android`, or `npm run web`

## How to call RoxyAPI
- Base URL: `https://roxyapi.com/api/v2`
- Auth header: `X-API-Key: <key>`
- Live OpenAPI spec: https://roxyapi.com/api/v2/numerology/openapi.json
- Live playground: https://roxyapi.com/api-reference

## Endpoints used in this app
- `GET /numerology/life-path` for the core Life Path number from a birth date
- `GET /numerology/chart` for the full numerology profile, including Expression, Soul Urge, Personality, Birth Day, and Maturity
- `GET /numerology/personal-year` for annual cycle forecasts
- `GET /numerology/expression` for the Expression number from full birth name
- `GET /numerology/compatibility` for compatibility analysis between two people
- `GET /numerology/meanings/{number}` for detailed meanings of numbers 1 to 9 plus Master Numbers 11, 22, 33

## Where to extend
- `src/api/client.ts` is the API client setup.
- `src/api/numerology.ts` exports the methods used by screens.
- `src/api/schema.ts` holds auto generated types from the OpenAPI spec.
- `app/(tabs)/` holds the tab screens: `index.tsx` (Life Path), `chart.tsx`, `personal-year.tsx`, `compatibility.tsx`, `meanings.tsx`.

## Conventions
- All RoxyAPI calls go through `src/api/`. Do not call `fetch` directly from screens.
- Master Numbers (11, 22, 33) and Karmic Debt numbers (13, 14, 16, 19) are returned by the API. Do not collapse them client side.
- The Pythagorean letter to number mapping is the only system used in this starter.

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm: `@roxyapi/sdk`)
- Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI: `roxy-sdk`)
- MCP servers: https://roxyapi.com/docs/mcp
- Methodology and accuracy: https://roxyapi.com/methodology
- More starters: https://roxyapi.com/starters
- Pricing: https://roxyapi.com/pricing
