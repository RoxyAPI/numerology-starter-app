# Numerology Starter App

[![Get API Key](https://img.shields.io/badge/Get_API_Key-roxyapi.com-black?style=for-the-badge)](https://roxyapi.com/pricing)
[![API Docs](https://img.shields.io/badge/API_Docs-Reference-black?style=for-the-badge)](https://roxyapi.com/api-reference#tag/numerology)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=for-the-badge)](https://github.com/RoxyAPI/numerology-starter-app/blob/main/LICENSE)

Open-source React Native (Expo) template for a Pythagorean numerology app: Life Path, full numerology chart, Personal Year forecast, two-person compatibility, and the full meaning library for numbers 1 to 9 plus Master Numbers 11, 22, and 33. Built on the [Roxy](https://roxyapi.com) Numerology API and the official [@roxyapi/sdk](https://www.npmjs.com/package/@roxyapi/sdk). One API key, every numerology endpoint, full control over your native UI.

Fork it, set one environment variable, and ship.

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/RoxyAPI/numerology-starter-app/main/screenshots/01.jpeg" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/numerology-starter-app/main/screenshots/02.jpeg" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/numerology-starter-app/main/screenshots/03.jpeg" width="250" />
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/RoxyAPI/numerology-starter-app/main/screenshots/04.jpeg" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/numerology-starter-app/main/screenshots/05.jpeg" width="250" />
  <img src="https://raw.githubusercontent.com/RoxyAPI/numerology-starter-app/main/screenshots/06.jpeg" width="250" />
</p>

## What you get

- **Life Path calculator** from a birth date, the single most important number in numerology, with Master Number and Karmic Debt flags.
- **Full numerology chart** in one call: Life Path, Expression, Soul Urge, Personality, and Birth Day numbers plus the current Personal Year.
- **Personal Year forecast** with theme, cycle, opportunities, challenges, and advice for the year ahead.
- **Compatibility** between two people, scored across Life Path, Expression, and Soul Urge with strengths, challenges, and relationship advice.
- **Number meanings** for 1 to 9 and Master Numbers 11, 22, 33, with keywords, strengths, challenges, career, relationships, and spiritual path.
- **Master Number and Karmic Debt detection** returned by the API, never collapsed client side.
- **Dark mode** with a teal theme that follows the device setting.

## Stack

| Technology | Purpose |
|-----------|---------|
| [Expo SDK 57](https://expo.dev) | React Native runtime and build tooling |
| [Expo Router](https://docs.expo.dev/router/introduction/) | File-based navigation with bottom tabs |
| [@roxyapi/sdk](https://www.npmjs.com/package/@roxyapi/sdk) | Fully typed RoxyAPI client. One key, every domain. |
| [NativeWind v4](https://www.nativewind.dev) | Tailwind CSS for React Native |
| [Roxy Numerology API](https://roxyapi.com/products/numerology-api) | Pythagorean numerology, charts, compatibility, and meanings |

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/RoxyAPI/numerology-starter-app.git
cd numerology-starter-app
npm install
```

### 2. Get your API key

Get instant access at **[roxyapi.com/pricing](https://roxyapi.com/pricing)**. One key unlocks every numerology endpoint. Add it to `.env`:

```
EXPO_PUBLIC_ROXYAPI_KEY=your-api-key-here
```

> **Bundled key caveat.** A mobile app has no server, so any `EXPO_PUBLIC_*` value is compiled into the build and can be read off a device. For production, use a key restricted to your bundle id in the dashboard, or route calls through a thin backend proxy that holds the real key. Never ship an unrestricted key.

### 3. Run

```bash
npm start          # dev server, then press i, a, or w
npm run ios        # iOS simulator (macOS only)
npm run android    # Android emulator
npm run web        # web
```

## How it works

The SDK is the only data layer. There is no generated schema file to keep in sync: `@roxyapi/sdk` ships its own types from the same OpenAPI spec the API serves, so a response flows straight into a screen with no glue code. Numerology takes a name and date of birth only, so there is no geocoding step.

### One typed client

```ts
// src/api/client.ts
import { createRoxy } from '@roxyapi/sdk';

const key = process.env.EXPO_PUBLIC_ROXYAPI_KEY ?? '';
export const roxy = createRoxy(key);
export const hasApiKey = (): boolean => Boolean(key);
```

### One data layer, screens stay thin

Every screen imports from `src/api`. The data layer wraps each `roxy.numerology.*` call and unwraps the SDK `{ data, error }` result into either the response or one thrown error the screen can catch:

```ts
// src/api/numerology.ts
export const numerologyApi = {
  getLifePath: async (body) => unwrap(await roxy.numerology.calculateLifePath({ body }), 'Failed to calculate Life Path number'),
  // ...
};
```

```tsx
// app/(tabs)/index.tsx
const data = await numerologyApi.getLifePath({ year: 1990, month: 7, day: 15 });
// data.number, data.type, data.meaning.title
```

## Featured endpoints

The highest-demand numerology endpoints, in the order you are most likely to ship them. Every method name and field below comes from the [OpenAPI spec](https://roxyapi.com/api/v2/numerology/openapi.json).

```ts
import { createRoxy } from '@roxyapi/sdk';

const roxy = createRoxy(process.env.EXPO_PUBLIC_ROXYAPI_KEY!);

// 1. Life Path. The number-one numerology keyword, every calculator page starts here.
const { data: lp } = await roxy.numerology.calculateLifePath({ body: { year: 1990, month: 7, day: 15 } });
// lp.number, lp.type ("single" | "master"), lp.meaning.title

// 2. Full numerology chart. One shot for all core numbers plus the Personal Year.
const { data: chart } = await roxy.numerology.generateNumerologyChart({
  body: { fullName: 'Jane Smith', year: 1990, month: 7, day: 15 },
});
// chart.coreNumbers.lifePath.number, chart.coreNumbers.expression.number, chart.coreNumbers.soulUrge.number

// 3. Personal Year. Annual forecast, drives the January traffic spike.
const { data: pyear } = await roxy.numerology.calculatePersonalYear({ body: { month: 7, day: 15, year: 2026 } });
// pyear.personalYear, pyear.theme, pyear.forecast

// 4. Compatibility. Two-person scoring across Life Path, Expression, and Soul Urge.
const { data: compat } = await roxy.numerology.calculateNumCompatibility({
  body: { person1: { fullName: 'Jane Smith', year: 1990, month: 7, day: 15 }, person2: { fullName: 'John Doe', year: 1992, month: 3, day: 22 } },
});
// compat.overallScore, compat.rating

// 5. Number meanings. Cache once for 1 to 9 plus Master Numbers 11, 22, 33.
const { data: meaning } = await roxy.numerology.getNumberMeaning({ path: { number: '11' } });
// meaning.number, meaning.meaning.title, meaning.meaning.description
```

This template uses 7 of the numerology endpoints. Browse the rest in the [API reference](https://roxyapi.com/api-reference#tag/numerology).

## Project structure

```
app/                          # Expo Router screens
├── _layout.tsx               # Root Stack
└── (tabs)/
    ├── _layout.tsx           # Bottom tabs
    ├── index.tsx             # Life Path calculator
    ├── chart.tsx             # Full numerology chart
    ├── personal-year.tsx     # Personal Year forecast
    ├── compatibility.tsx     # Two-person compatibility
    └── meanings.tsx          # Number meanings explorer
src/
├── api/
│   ├── client.ts             # The one Roxy SDK client + hasApiKey guard
│   ├── numerology.ts         # Wraps roxy.numerology.*, unwraps { data, error }
│   ├── types.ts              # SDK response types under app-friendly names
│   └── index.ts              # Barrel export
├── components/
│   ├── NumberDetailModal.tsx # Full meaning sheet for a tapped number
│   └── RoxyBranding.tsx
├── constants/colors.ts       # appColors for React Native props
└── hooks/useUserId.ts        # Stable device id in AsyncStorage
```

## Customize

- **Add a feature.** Pick a numerology method, add a wrapper in `src/api/numerology.ts`, call it from a screen. The SDK types regenerate from the spec, so new endpoints flow through with no manual typing. The API also ships Personality, Birth Day, Maturity, Karmic Lessons, Karmic Debt, Personal Day, and Personal Month.
- **Change the theme.** This app uses Tailwind colors through NativeWind. Swap `teal-600` in the screen `className` strings for any Tailwind color, and update `appColors.primary` in `src/constants/colors.ts` for the React Native props.
- **Save profiles.** Use AsyncStorage to keep a calculated chart on device. RoxyAPI stores no birth data, so memory is your layer to own.

## Why Roxy

- **Breadth.** Numerology plus Western astrology, Vedic astrology, forecast, human design, Chinese astrology, feng shui, tarot, biorhythm, I Ching, crystals, dreams, and angel numbers under one key.
- **Type-safe.** The SDK types come from one OpenAPI pipeline, so response shapes cannot drift from what the API returns.
- **Eight languages.** Pass `query: { lang }` on the numerology endpoints for interpretations in English, Hindi, Turkish, Spanish, German, Portuguese, French, or Russian.
- **Remote MCP.** Connect AI agents to every numerology endpoint at `roxyapi.com/mcp/numerology`, no local setup.

## Links

- [Numerology API](https://roxyapi.com/products/numerology-api)
- [API reference and playground](https://roxyapi.com/api-reference#tag/numerology)
- [Get API key](https://roxyapi.com/pricing)
- [All templates](https://roxyapi.com/starters)
- [Connect AI agents via MCP](https://roxyapi.com/docs/mcp)

## License

MIT
