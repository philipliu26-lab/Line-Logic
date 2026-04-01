# Line Logic

Class MVP: a demo-only **Expo (React Native) + TypeScript** app that presents **Line Logic** as a data-backed sports betting insights product. All odds, picks, and alerts are **mocked**.

**→ Simple checklist to put the app on GitHub and get a public website link:** see **[SITE_LINKS.md](./SITE_LINKS.md)** (8 short steps).

## Prerequisites

- [Node.js](https://nodejs.org/) LTS (v18+ recommended; project tested with modern LTS)
- [Expo Go](https://expo.dev/go) on your phone (same major SDK as this project: **Expo SDK 54**)
- macOS with Xcode (optional, for iOS Simulator) or Android Studio (optional, for emulator)

## Install & run

```bash
cd line-logic
npm install
npx expo start
```

Then:

- **Physical device:** scan the QR code with the Camera app (iOS) or Expo Go (Android). Phone and computer should be on the same Wi‑Fi, or use **tunnel mode** (below).
- **Simulator:** press `i` (iOS) or `a` (Android) in the terminal.
- **Web:** press `w` (optional; layout is optimized for mobile).

If something looks cached or wrong after config changes:

```bash
npx expo start -c
```

## Share with others (QR code)

Anyone with **Expo Go** installed (**SDK 54** — update the app if the QR fails to open) can load this project from a QR code **while your dev server is running** on your computer.

### Option A — Same Wi‑Fi (fastest)

1. You run: `npm start` (or `npx expo start`).
2. Your phone and your computer are on the **same network** (not guest Wi‑Fi that blocks device-to-device chat).
3. Others open **Expo Go** (Android) or the **Camera** app (iOS) and **scan the QR code** in the terminal or in the browser tab Expo opens (`http://localhost:8081`).
4. If the QR uses a **LAN IP** (e.g. `exp://192.168.x.x:8081`), scanners must be on **that same Wi‑Fi** as your machine.

### Option B — Tunnel (works for people **not** on your Wi‑Fi)

Use this for classmates, friends, or a professor on a different network.

1. Run:

   ```bash
   npm run start:tunnel
   ```

   or:

   ```bash
   npx expo start --tunnel
   ```

2. Wait until the CLI shows a **tunnel** URL and a new **QR code** (first time can take a minute).
3. Share the QR on your screen, a slide, or a screenshot; others scan with **Expo Go** / **Camera** (same as above).
4. The CLI may ask you to log in with a free **[Expo](https://expo.dev)** account the first time you use tunneling — that’s normal.

**Important:** The app is served from **your computer**. When you stop the terminal or close the laptop, the QR link stops working. For a **public link** that stays online, use **Deploy the web app** below.

## Deploy the web app (public URL + QR)

You can host a **browser version** of Line Logic (same screens, runs in Chrome/Safari on a phone — **not** inside the Expo Go app). That gives you a normal **https://…** link you can put on a syllabus, slide, or **turn into a QR code** with any free generator ([qr-code-generator.com](https://www.qr-code-generator.com/), etc.).

### 1. Build static files

```bash
cd line-logic
npm install
npm run build:web
```

This creates a `dist/` folder (already listed in `.gitignore`).

### 2. Upload to a free host

**Netlify (easy)**

- **Drag & drop:** Open [app.netlify.com/drop](https://app.netlify.com/drop), drag the **`dist`** folder onto the page. You get a URL like `https://random-name-123.netlify.app`.
- **From Git:** Push the project to GitHub, sign in to Netlify → **Add new site** → **Import** the repo. Netlify will run `npm run build:web` and publish `dist` (see `netlify.toml`).

**Vercel**

- Install the [Vercel CLI](https://vercel.com/docs/cli), then from the project folder: `npx vercel --prod` and point the output to **`dist`** when asked, **or** connect the GitHub repo and set **Build Command** to `npm run build:web` and **Output Directory** to `dist`.

**Cloudflare Pages**

- Connect the repo; build command `npm run build:web`, output directory `dist`.

### 3. QR code for that URL

Copy your live **`https://…`** link → paste it into any **QR code generator** → download the image for your poster or slides.

### Native app (Expo Go) vs web

| | **Expo Go + `npm start`** | **Hosted web** |
|--|---------------------------|----------------|
| Where it runs | Expo Go app | Phone **browser** |
| Needs your laptop | Yes (for dev / tunnel) | **No** after deploy |
| Best for | Class demo, full native feel | Link on a website, email, printed QR |

## Auto-publish with GitHub Pages (no Netlify account)

This repo includes **GitHub Actions** (`.github/workflows/deploy-web.yml`) that builds the web app and deploys it to **GitHub Pages** whenever you push to **`main`** or **`master`**.

1. Create a **new repository** on GitHub named **`Line-Logic`** (recommended) and push this project:

   ```bash
   cd line-logic
   git init
   git add .
   git commit -m "Line Logic MVP"
   git branch -M main
   git remote add origin https://github.com/philipliu26-lab/Line-Logic.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages** → under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).

3. Open the **Actions** tab and wait for **Deploy web to GitHub Pages** to finish (green).

4. Your public URL will look like:

   `https://philipliu26-lab.github.io/Line-Logic/`

   (The workflow sets `EXPO_ROUTER_BASE_PATH` to match the repo name so assets load correctly.)

5. Turn that URL into a QR code with any free generator and share it.

**Note:** The AI can’t log into your GitHub account or push for you—you need to run the git commands above once. After that, every push to `main` updates the site.

`app.config.js` reads `EXPO_ROUTER_BASE_PATH` only in CI; local `npm run build:web` and **Netlify** (root URL) work **without** that variable.

### If scanning fails

- **Update Expo Go** so its SDK matches this project (**54**).
- Try tunnel mode if LAN QR fails (corporate/school Wi‑Fi often blocks LAN).
- Android: scan from **inside Expo Go** → **Scan QR code** if the system camera doesn’t offer “Open in Expo Go”.

## What’s mocked

- Sports data, odds, line movement, AI picks, value scores, alerts, analytics KPIs, API responses, payments, and email — all **illustrative** for demonstration.
- **Developer API** screen shows a **fake API key** and static sample JSON; there is no live backend.

## Persistence & daily pick limits

- **Subscription tier** (Base / Pro / Elite) and **onboarding completion** are stored with `@react-native-async-storage/async-storage` when the native module is available.
- If AsyncStorage isn’t available (some Expo Go setups), the app falls back to **in-memory storage** for that session so **Get started** and picks still work; closing the app fully may reset that session state.
- **AI pick reveals** per day: Base **3**, Pro **15**, Elite **high cap**. Count resets when the device’s **local calendar date** changes (see `lib/pickUsage.ts`).

## Branding

- App **icon**, **splash**, and in-app **Home** / **onboarding** use `assets/images/logo.png`.

## Disclaimer

This is an **educational prototype**. It is **not** gambling or financial advice.

## Production builds (outline only)

For store-ready binaries you’d use [EAS Build](https://docs.expo.dev/build/introduction/) (`eas build`). That’s out of scope for this class MVP.
# Line-Logic
# Line-Logic
