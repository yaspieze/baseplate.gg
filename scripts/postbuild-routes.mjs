import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const baseHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(baseHtmlPath)) {
  console.error('dist/index.html not found!');
  process.exit(1);
}

const baseHtml = fs.readFileSync(baseHtmlPath, 'utf-8');

const routes = [
  {
    slug: 'studio',
    title: 'Baseplate Studio Agent — Live Luau & Game Builder | baseplate.gg',
    desc: 'Generate server-authoritative Luau scripts, GUIs, and full Roblox Studio systems with instant Auto-Sync. 100% Free Forever.',
  },
  {
    slug: 'gui',
    title: 'GUI & Asset Forge — AI Roblox UI Kit Generator | baseplate.gg',
    desc: 'Create production-ready Roblox ScreenGuis, Gamepass icons, Shop frames, and TweenService controllers in seconds. Free Forever.',
  },
  {
    slug: 'connect',
    title: 'Connect Roblox Studio & BaseplateMCP | baseplate.gg',
    desc: 'Pair Roblox Studio via the official Baseplate Bridge plugin or configure BaseplateMCP for bidirectional Explorer sync.',
  },
  {
    slug: 'showcase',
    title: 'Community Games & Systems Showcase | baseplate.gg',
    desc: 'Explore 640K+ creators building front-page Roblox experiences with Baseplate.gg AI.',
  },
  {
    slug: 'pricing',
    title: 'Plans & Open Creator Grant — $0 Forever | baseplate.gg',
    desc: 'Every AI model, unlimited Luau prompts, GUI Forge, and Studio Auto-Sync — $0/month forever for Roblox creators.',
  },
  {
    slug: 'docs',
    title: 'Documentation & Prompt Guide | baseplate.gg',
    desc: 'Learn how to connect the Roblox Studio plugin, reference instances with @mentions, and export .rbxmx kits.',
  },
];

for (const route of routes) {
  const dir = path.join(distDir, route.slug);
  fs.mkdirSync(dir, { recursive: true });
  let html = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)
    .replace(
      /<meta property="og:title" content=".*?" \/>/,
      `<meta property="og:title" content="${route.title}" />`
    )
    .replace(
      /<meta property="og:description" content=".*?" \/>/,
      `<meta property="og:description" content="${route.desc}" />`
    )
    .replace(
      /<meta name="description" content=".*?" \/>/,
      `<meta name="description" content="${route.desc}" />`
    );
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf-8');
}

// 404.html fallback so any deep sub-route boots the SPA cleanly without .html
fs.writeFileSync(path.join(distDir, '404.html'), baseHtml, 'utf-8');
// .nojekyll so GitHub Pages serves all assets cleanly
fs.writeFileSync(path.join(distDir, '.nojekyll'), '', 'utf-8');

console.log(`Generated ${routes.length} clean directory routes + 404.html + .nojekyll`);
