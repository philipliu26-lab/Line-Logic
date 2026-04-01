# Simple setup: GitHub + live website

## If something broke (common fixes)

- **`Repository not found`** — Create **`Line-Logic`** on GitHub first, then set `origin` to `https://github.com/<your-real-username>/Line-Logic.git` (replace `<your-real-username>` with the name on your GitHub profile, not `YOUR_USERNAME`).
- **`pathspec '#'` / `skip` errors** — Don’t paste **comments** after commands. Run **one command at a time**. For commit, use only:  
  `git commit -m "Line Logic MVP"`  
  (no `# skip if...` on the same line.)
- **Wrong folder** — Use `cd` into **`line-logic`** (with **`-logic`** at the end).

---

Follow these in order. **Skip a step** if you already did it.

Use the repo name **`Line-Logic`** on GitHub so your links match that name. Your project folder on disk can stay `line-logic` — that’s fine.

---

## Part A — Put the code on GitHub

**1.** On [github.com](https://github.com), click **New repository**.  
Name it **`Line-Logic`** (capital L, hyphen). **Do not** add README or .gitignore (you already have them). Create the repo.

**2.** Copy the repo URL GitHub shows (HTTPS), e.g.  
`https://github.com/philipliu26-lab/Line-Logic.git`

**3.** On your Mac, in Terminal:

```bash
cd /Users/philipliu26/line-logic
git remote set-url origin https://github.com/philipliu26-lab/Line-Logic.git
git push -u origin main
```

(Your GitHub username is **`philipliu26-lab`**. Keep repo name **`Line-Logic`**.)

**4.** Refresh GitHub — your files should appear.

---

## Part B — Turn on the website (GitHub Pages)

**5.** On GitHub: open your repo → **Settings** → **Pages** (left sidebar).

**6.** Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).

**7.** Open the **Actions** tab. Wait until **Deploy web to GitHub Pages** finishes with a green check (first run may take a few minutes).

---

## Part C — Your links

**8.** In Terminal:

```bash
cd /Users/philipliu26/line-logic
npm run site-links
```

You’ll see:

- **Repository** — `https://github.com/philipliu26-lab/Line-Logic`  
- **GitHub Pages** — `https://philipliu26-lab.github.io/Line-Logic/` (open in a browser or use for a QR code)

If `site-links` says you still have a placeholder remote, redo **step 3** with the correct URL.

---

## Quick reference

| Step | What |
|------|------|
| A | Push code to GitHub repo **`Line-Logic`** |
| B | Settings → Pages → **GitHub Actions** |
| C | `npm run site-links` → open the Pages URL |

**Note:** The live site is the **web** version (browser). **Expo Go** on a phone still uses `npm start` on your computer (or tunnel).
