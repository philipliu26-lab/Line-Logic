#!/usr/bin/env node
/**
 * Prints your GitHub repo URL and GitHub Pages URL from `git remote get-url origin`.
 * Run after: git remote set-url origin https://github.com/<you>/<repo>.git
 */

const { execSync } = require('child_process');
const path = require('path');

function main() {
  let url;
  try {
    url = execSync('git remote get-url origin', {
      encoding: 'utf8',
      cwd: path.join(__dirname, '..'),
    }).trim();
  } catch {
    console.error('No git remote "origin" found. From the project folder run:');
    console.error('  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git');
    process.exit(1);
    return;
  }

  const normalized = url.replace(/^git@github\.com:/, 'https://github.com/').replace(/\.git$/, '');
  const match = normalized.match(/github\.com\/([^/]+)\/([^/]+)/);

  if (!match) {
    console.log('Origin URL:', url);
    console.log('Could not parse a github.com repo. Use an HTTPS URL like:');
    console.log('  https://github.com/username/repo.git');
    process.exit(0);
    return;
  }

  const [, user, repo] = match;

  if (user === 'YOUR_USER' || repo === 'YOUR_REPO') {
    console.log('Your remote is still the placeholder. Set the real repo:\n');
    console.log('  git remote set-url origin https://github.com/<your-username>/<repo-name>.git\n');
    console.log('Then run: npm run site-links\n');
    console.log('Example (repo name Line-Logic):');
    console.log('  git remote set-url origin https://github.com/<username>/Line-Logic.git');
    console.log('GitHub Pages (after Actions deploy) will be like:');
    console.log('  https://<username>.github.io/Line-Logic/');
    process.exit(0);
    return;
  }

  console.log('\n--- Line Logic — your links ---\n');
  console.log('Repository (code):');
  console.log(`  https://github.com/${user}/${repo}\n`);
  console.log('GitHub Pages (live site, after first successful deploy):');
  console.log(`  https://${user}.github.io/${repo}/\n`);
  console.log('Enable Pages: GitHub repo → Settings → Pages → Source: GitHub Actions.\n');
}

main();
