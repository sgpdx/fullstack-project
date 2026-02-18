#!/usr/bin/env node
const pug = require('pug');
const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'public', 'views');
const outDir = path.join(__dirname, 'docs');
const staticPairs = [
  { from: path.join(__dirname, 'img'), to: path.join(outDir, 'img') },
  { from: path.join(__dirname, 'public', 'stylesheets'), to: path.join(outDir, 'stylesheets') },
];

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function walk(dir, cb) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const res = path.join(dir, dirent.name);
    if (dirent.isDirectory()) walk(res, cb);
    else cb(res);
  });
}

ensureDir(outDir);

// Load optional build data from data/pages.json
let siteData = {};
const dataFile = path.join(__dirname, 'data', 'pages.json');
if (fs.existsSync(dataFile)) {
  try { siteData = JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch (e) {
    console.error('Failed to parse data/pages.json:', e.message);
  }
}

if (!fs.existsSync(viewsDir)) {
  console.error('Views directory not found:', viewsDir);
  process.exit(1);
}

walk(viewsDir, file => {
  if (!file.endsWith('.pug')) return;
  // skip includes/partials
  if (file.includes(path.join('views', 'includes'))) return;
  const rel = path.relative(viewsDir, file);
  const name = rel.replace(/\.pug$/, '');
  const outPath = path.join(outDir, rel.replace(/\.pug$/, '.html'));
  // Merge per-page data if present (data key matches filename without extension)
  const locals = Object.assign({}, siteData[name] || {}, { site: siteData.site || {} });
  const html = pug.renderFile(file, { pretty: true, ...locals });
  ensureDir(path.dirname(outPath));
  fs.writeFileSync(outPath, html);
  console.log('Rendered', rel, '→', path.relative(__dirname, outPath));
});

// Copy static assets
staticPairs.forEach(pair => {
  if (!fs.existsSync(pair.from)) return;
  try {
    fs.cpSync(pair.from, pair.to, { recursive: true });
    console.log('Copied', pair.from, '→', pair.to);
  } catch (e) {
    console.error('Failed copying', pair.from, e.message);
  }
});

console.log('Build complete. Output in', outDir);
