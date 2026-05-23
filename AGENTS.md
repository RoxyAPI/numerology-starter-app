# Agents Guide

This is a RoxyAPI starter app. A Pythagorean numerology calculator built with React Native, Expo SDK 54, and TypeScript. Demonstrates Life Path, Expression, Soul Urge, Personal Year, full numerology charts, and compatibility, with Master Number and Karmic Debt detection, all powered by the RoxyAPI Numerology API through the official `@roxyapi/sdk`.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Create `.env` in the project root with:
  - `EXPO_PUBLIC_ROXYAPI_KEY=your_api_key_here`
- Install with `npm install`
- Run with `npm start`, then `npm run ios`, `npm run android`, or `npm run web`
- Test with `npm test`, typecheck with `npm run typecheck`

## How it calls RoxyAPI
- The only data layer is `@roxyapi/sdk`. `createRoxy(key)` sets the base URL and the auth header, and ships its own types from the OpenAPI spec, so there is no generated schema file to keep in sync.
- The key is bundled into the app (mobile has no server). Treat `EXPO_PUBLIC_ROXYAPI_KEY` as a public, restricted key locked to your bundle id, or proxy calls through a backend you control.
- Numerology takes a name and date of birth only, so there is no geocoding step.
- Live OpenAPI spec: https://roxyapi.com/api/v2/numerology/openapi.json
- Live playground: https://roxyapi.com/api-reference

## Endpoints used in this app
- `roxy.numerology.calculateLifePath` for the core Life Path number from a birth date
- `roxy.numerology.generateNumerologyChart` for the full numerology profile, including Expression, Soul Urge, Personality, and Birth Day numbers plus the Personal Year
- `roxy.numerology.calculatePersonalYear` for annual cycle forecasts
- `roxy.numerology.calculateExpression` for the Expression number from full birth name
- `roxy.numerology.calculateSoulUrge` for the Soul Urge number from the vowels in the birth name
- `roxy.numerology.calculateNumCompatibility` for compatibility analysis between two people
- `roxy.numerology.getNumberMeaning` for detailed meanings of numbers 1 to 9 plus Master Numbers 11, 22, 33

## Where to extend
- `src/api/client.ts` is the single Roxy SDK client and the `hasApiKey` guard.
- `src/api/numerology.ts` wraps the `roxy.numerology.*` methods used by screens and unwraps the SDK `{ data, error }` result.
- `src/api/types.ts` re-exports the SDK response types under app-friendly names.
- `app/(tabs)/` holds the tab screens: `index.tsx` (Life Path), `chart.tsx`, `personal-year.tsx`, `compatibility.tsx`, `meanings.tsx`.

## Conventions
- All RoxyAPI calls go through `src/api/`. Do not call `fetch` or the SDK directly from screens.
- Method names and body fields come from the SDK types, never invented. Verify against the OpenAPI spec.
- Master Numbers (11, 22, 33) and Karmic Debt numbers (13, 14, 16, 19) are returned by the API. Do not collapse them client side.
- The Pythagorean letter to number mapping is the only system used in this starter.

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm: `@roxyapi/sdk`)
- Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI: `roxy-sdk`)
- MCP servers: https://roxyapi.com/docs/mcp
- Methodology and accuracy: https://roxyapi.com/methodology
- More starters: https://roxyapi.com/starters
- Pricing: https://roxyapi.com/pricing
