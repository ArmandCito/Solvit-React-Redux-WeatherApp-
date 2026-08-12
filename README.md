# SolvitCast 🌤️

A single-page real-time weather app built with **React + Vite + TypeScript**, styled with plain **CSS** (no CSS frameworks), and state managed with **Redux Toolkit**. Weather data comes from the [OpenWeatherMap API](https://openweathermap.org/).

## Features

- Current weather for any searched city
- 5-day forecast
- Humidity, wind speed, sunrise and sunset details
- Automatic geolocation on load (falls back to a default city if the user denies location access or geolocation isn't available)
- Centralized, predictable app state via Redux Toolkit
- One background image, one page, no routing

## Project structure

```
solvitcast/
├── src/
│   ├── assets/               # background image
│   ├── components/
│   │   ├── Navbar/            # Navbar.tsx, Navbar.css, Navbar.ts
│   │   ├── CityResults/        # CityResults.tsx, CityResults.css, CityResults.ts
│   │   ├── ForeCastSection/     # ForeCastSection.tsx, ForeCastSection.css, ForeCastSection.ts
│   │   ├── WeatherDetails/     # WeatherDetails.tsx, WeatherDetails.css, WeatherDetails.ts
│   │   └── Footer/              # Footer.tsx, Footer.css, Footer.ts
│   ├── pages/
│   │   └── Home.tsx            # composes all components, reads/dispatches Redux state
│   ├── store/
│   │   ├── store.ts             # Redux store setup (configureStore)
│   │   ├── weatherSlice.ts      # weather state, reducers, and async thunks
│   │   └── hooks.ts             # typed useAppDispatch / useAppSelector
│   ├── services/
│   │   ├── weatherApi.ts        # OpenWeatherMap calls + geolocation helper
│   │   └── weatherIcons.ts      # emoji + tip helpers
│   ├── types/
│   │   └── weather.ts           # shared TypeScript types
│   ├── App.tsx
│   └── main.tsx                 # wraps the app in Redux's <Provider>
├── .env.example
└── package.json
```

> Note: the brief asked for 6 components, but only 5 names were listed (Navbar, CityResults, ForeCastSection, WeatherDetails, Footer). Those 5 are implemented exactly as named — let me know if a 6th component was intended and what it should do.

## Why Redux Toolkit?

Before Redux, all weather state (`current`, `forecast`, `loading`, `error`) lived in a single `useState` call inside `Home.tsx`. That worked fine at this size, but it has real limits:

- **Single owner** — only `Home.tsx` could read or update weather state. Any other component that needed it (say, a future header showing the current temperature, or a settings panel) would need the data passed down through props, or the state would need to be lifted/duplicated.
- **Logic mixed with UI** — the fetch logic, error handling, and geolocation fallback all lived inside the component itself, making `Home.tsx` responsible for both "how do we get this data" and "how do we display it."
- **Harder to trace state changes** — with plain `useState`, there's no single place to see every possible state transition, and no built-in tooling to inspect *why* the state changed.

Redux Toolkit fixes this by moving weather state out of any one component and into a single, app-wide **store**:

- **Global access** — any component in the tree can read weather state via `useAppSelector`, or trigger a fetch via `useAppDispatch`, without prop drilling. Adding a new component that needs current weather (e.g. a mini widget in the Navbar) is now a one-line change.
- **Separation of concerns** — `weatherSlice.ts` owns all the fetching logic (`createAsyncThunk`) and state transitions (`extraReducers`). `Home.tsx` becomes a much thinner component: it just dispatches actions and reads state.
- **Predictable state transitions** — every state change happens through a well-defined action (`fetchWeatherByCity`, `fetchWeatherByCoords`, `fetchWeatherByLocation`, or `clearError`). This makes the app easier to debug and extend — for example, adding a "favorite cities" list or a "search history" feature later would just mean adding a new slice, not restructuring `Home.tsx`.
- **Built-in DevTools support** — `configureStore` wires up Redux DevTools automatically, so every dispatched action and the resulting state snapshot can be inspected in the browser during development.
- **Scales better as the app grows** — this app is small today, but the same pattern (one slice per domain of data) is how larger React apps stay organized as more screens and features are added.

## What changed from the previous version

| Before (local `useState`) | Now (Redux Toolkit) |
|---|---|
| Weather state lived in `Home.tsx` via `useState<WeatherState>` | Weather state lives in `src/store/weatherSlice.ts`, a Redux slice |
| `loadByCity` / `loadByLocation` were plain async functions inside `Home.tsx` | `fetchWeatherByCity`, `fetchWeatherByCoords`, `fetchWeatherByLocation` are `createAsyncThunk`s in the slice |
| Home.tsx manually set `loading`/`error`/`current`/`forecast` with `setState` | The slice's `extraReducers` update state automatically on `pending`/`fulfilled`/`rejected` |
| No global store; state only existed inside one component | `src/store/store.ts` holds a single app-wide store, provided via `<Provider>` in `main.tsx` |
| Components received data only through props from `Home.tsx` | Components can (in principle) use `useAppSelector` directly if needed, not just via props |
| No DevTools state inspection | Redux DevTools works out of the box via `configureStore` |

The UI and OpenWeatherMap integration behave exactly the same as before — this change is purely about **where and how state is managed**, not what the app looks like or does.

## New/changed files for Redux

- **Added** `src/store/store.ts` — creates the Redux store and exports `RootState`/`AppDispatch` types.
- **Added** `src/store/weatherSlice.ts` — the `weather` slice: initial state, thunks, and reducers. Every line here is commented to explain what it does.
- **Added** `src/store/hooks.ts` — typed `useAppDispatch` / `useAppSelector`, so components get full TypeScript support without repeating generics.
- **Modified** `src/main.tsx` — wraps `<App />` in Redux's `<Provider store={store}>`.
- **Modified** `src/pages/Home.tsx` — now reads state with `useAppSelector` and triggers fetches with `useAppDispatch(...)` instead of local `useState` + manual async functions.
- **Modified** `package.json` — added `@reduxjs/toolkit` and `react-redux` as dependencies.

All other components (`Navbar`, `CityResults`, `ForeCastSection`, `WeatherDetails`, `Footer`) are unchanged — they still just receive props, same as before.

## 1. Get an OpenWeatherMap API key

1. Create a free account at https://home.openweathermap.org/users/sign_up
2. Go to **API keys** in your account and copy your key.
3. New keys can take a few minutes (sometimes up to 2 hours) to activate — if you get a 401 error at first, just wait and try again.

## 2. Configure your `.env` file

Copy the example file:

```bash
cp .env.example .env
```

Then open `.env` and fill in your key:

```
VITE_OPENWEATHER_API_KEY=your_real_api_key_here
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_DEFAULT_CITY=London
```

- `VITE_OPENWEATHER_API_KEY` — **required**. Your personal OpenWeatherMap key.
- `VITE_OPENWEATHER_BASE_URL` — optional, defaults to OpenWeatherMap's standard endpoint.
- `VITE_DEFAULT_CITY` — optional, the city shown before search / if geolocation is denied. Defaults to `London`.

⚠️ Never commit your real `.env` file — it's already excluded via `.gitignore`.

## 3. Install dependencies

```bash
npm install
```

This installs React, Vite, TypeScript, and now also `@reduxjs/toolkit` and `react-redux`.

## 4. Run the app

```bash
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## 5. Build for production

```bash
npm run build
npm run preview
```

## How location works

On first load, the app dispatches `fetchWeatherByLocation`, which:

1. Asks the browser for your location via `navigator.geolocation`.
2. If **allowed**, dispatches `fetchWeatherByCoords` internally to fetch weather using your coordinates.
3. If **denied**, unsupported, or it fails, dispatches `fetchWeatherByCity` with the default city (`VITE_DEFAULT_CITY`, e.g. London) instead — so the app is never empty.

You can always search a different city manually using the search bar (`fetchWeatherByCity`), or click the 📍 button to retry geolocation at any time (`fetchWeatherByLocation` again).

## Tech notes

- Plain CSS only — one `.css` file per component, no CSS frameworks or CSS-in-JS.
- Only `type`/`interface` declarations are used for typing (no `extends` on classes — this project has no classes at all).
- No `react-router-dom` — this is a single page app.
- Weather condition icons are simple emoji to keep things lightweight, as requested.
- State management uses Redux Toolkit (`@reduxjs/toolkit` + `react-redux`) — see "Why Redux Toolkit?" above.

