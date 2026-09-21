/**
 * Gaming Wiki - Static Site Generator
 * Pure Node.js, 0 external dependencies, builds in < 1 second on Netlify & local
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const GUIDES_DIR = path.join(ROOT_DIR, 'guides');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Find all .html files in directory recursively
function findHtmlFiles(dir, baseDir = dir) {
  if (!fs.existsSync(dir)) return [];
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(findHtmlFiles(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      const relPath = path.relative(baseDir, fullPath);
      files.push({
        fullPath,
        relPath,
        fileName: entry.name,
      });
    }
  }
  return files;
}

// Extract Title, Game Name, Description, Word count
function parseHtmlMetadata(filePath, relPath, content) {
  const stats = fs.statSync(filePath);

  // 1. Extract Title
  let title = '';
  const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (titleMatch && titleMatch[1].trim()) {
    title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
  } else {
    const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match && h1Match[1].trim()) {
      title = h1Match[1].replace(/<[^>]*>/g, '').trim();
    } else {
      // Fallback: file name without .html
      const baseName = path.basename(relPath, path.extname(relPath));
      title = baseName.replace(/^[\[\(].*?[\]\)]\s*/, '').replace(/[-_]/g, ' ');
      title = title.charAt(0).toUpperCase() + title.slice(1);
    }
  }

  // 2. Extract Game Category
  let game = '';
  // Check meta tag: <meta name="game" content="...">
  const metaGameMatch = content.match(/<meta[^>]+name=["']game["'][^>]+content=["']([^"']+)["']/i);
  if (metaGameMatch && metaGameMatch[1].trim()) {
    game = metaGameMatch[1].trim();
  }

  // Check subfolder: guides/Elden Ring/boss.html -> game = "Elden Ring"
  if (!game) {
    const dirParts = path.dirname(relPath).split(path.sep).filter(p => p && p !== '.');
    if (dirParts.length > 0) {
      game = dirParts[0];
    }
  }

  // Check filename prefix: [Elden Ring] Boss Guide.html
  if (!game) {
    const prefixMatch = path.basename(relPath).match(/^[\[\(](.*?)[\]\)]/);
    if (prefixMatch && prefixMatch[1].trim()) {
      game = prefixMatch[1].trim();
    }
  }

  // Check common game names in title or filename if still not found
  if (!game) {
    const textToCheck = `${relPath} ${title}`.toLowerCase();
    if (textToCheck.includes('wukong') || textToCheck.includes('hắc thần thoại')) game = 'Black Myth: Wukong';
    else if (textToCheck.includes('elden ring')) game = 'Elden Ring';
    else if (textToCheck.includes('cyberpunk')) game = 'Cyberpunk 2077';
    else if (textToCheck.includes('genshin')) game = 'Genshin Impact';
    else if (textToCheck.includes('honkai')) game = 'Honkai: Star Rail';
    else if (textToCheck.includes('monster hunter')) game = 'Monster Hunter';
    else if (textToCheck.includes('zelda')) game = 'Zelda';
    else if (textToCheck.includes('valorant')) game = 'Valorant';
    else if (textToCheck.includes('league') || textToCheck.includes('lol')) game = 'League of Legends';
    else if (textToCheck.includes('witcher')) game = 'The Witcher 3';
    else if (textToCheck.includes('sekiro')) game = 'Sekiro';
    else if (textToCheck.includes('dark souls')) game = 'Dark Souls';
    else if (textToCheck.includes('diablo')) game = 'Diablo IV';
    else if (textToCheck.includes('gta')) game = 'GTA V';
    else game = 'Khác';
  }

  // 3. Extract Description
  let description = '';
  const metaDescMatch = content.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  if (metaDescMatch && metaDescMatch[1].trim()) {
    description = metaDescMatch[1].trim();
  } else {
    // First paragraph
    const pMatch = content.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch && pMatch[1].trim()) {
      description = pMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
      if (description.length > 200) {
        description = description.slice(0, 197) + '...';
      }
    }
  }

  // 4. Calculate Read Time & Word Count
  const textOnly = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const wordCount = textOnly.split(' ').filter(w => w.length > 0).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 220));

  return {
    title,
    game,
    description,
    readTimeMinutes,
    mtime: stats.mtime.toISOString(),
  };
}

// Injects the <wiki-nav-hud> header component into the HTML guide
function injectNavHud(content, metadata, relPath) {
  // If already injected, strip old one to avoid duplicates
  content = content.replace(/<!-- WIKI_NAV_HUD_START -->[\s\S]*?<!-- WIKI_NAV_HUD_END -->/g, '');
  content = content.replace(/<wiki-nav-hud[\s\S]*?<\/wiki-nav-hud>/g, '');
  content = content.replace(/<script[^>]*nav-hud\.js[^>]*><\/script>/g, '');

  // Calculate relative path back to /components/ and /index.html
  const dirParts = path.dirname(relPath).split(path.sep).filter(p => p && p !== '.');
  const depth = dirParts.length; // e.g. guides/wukong.html => 1 subdirectory relative to dist/
  const upPrefix = depth > 0 ? '../'.repeat(depth) : './';
  const scriptPath = `${upPrefix}components/nav-hud.js`;
  const homeUrl = `${upPrefix}index.html`;

  const safeTitle = metadata.title.replace(/"/g, '&quot;');
  const safeGame = metadata.game.replace(/"/g, '&quot;');

  const hudInjection = `
<!-- WIKI_NAV_HUD_START -->
<script src="${scriptPath}"></script>
<wiki-nav-hud title="${safeTitle}" game="${safeGame}" home-url="${homeUrl}"></wiki-nav-hud>
<!-- WIKI_NAV_HUD_END -->
`;

  // Insert right after <body ...>
  if (/<body[^>]*>/i.test(content)) {
    return content.replace(/(<body[^>]*>)/i, `$1\n${hudInjection}`);
  }

  // If incomplete snippet, wrap cleanly
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
</head>
<body>
${hudInjection}
${content}
</body>
</html>`;
}

function build() {
  console.log('🚀 [Wiki-Game] Bắt đầu quá trình build...');
  const startTime = Date.now();

  // 1. Ensure directories and clean stale guides in dist
  ensureDir(GUIDES_DIR);
  ensureDir(DIST_DIR);
  const distGuidesDir = path.join(DIST_DIR, 'guides');
  if (fs.existsSync(distGuidesDir)) {
    fs.rmSync(distGuidesDir, { recursive: true, force: true });
  }

  // 2. Copy static assets and components to dist
  copyDir(path.join(SRC_DIR, 'assets'), path.join(DIST_DIR, 'assets'));
  copyDir(path.join(SRC_DIR, 'components'), path.join(DIST_DIR, 'components'));

  // 3. Process all guide HTML files
  const htmlFiles = findHtmlFiles(GUIDES_DIR);
  const guidesData = [];

  for (const file of htmlFiles) {
    const rawContent = fs.readFileSync(file.fullPath, 'utf-8');
    const metadata = parseHtmlMetadata(file.fullPath, file.relPath, rawContent);

    // Output path in dist/guides/
    const outRelPath = path.join('guides', file.relPath);
    const outFullPath = path.join(DIST_DIR, outRelPath);
    ensureDir(path.dirname(outFullPath));

    // Inject HUD and write to dist
    const finalHtml = injectNavHud(rawContent, metadata, outRelPath);
    fs.writeFileSync(outFullPath, finalHtml, 'utf-8');

    guidesData.push({
      title: metadata.title,
      game: metadata.game,
      description: metadata.description,
      readTimeMinutes: metadata.readTimeMinutes,
      mtime: metadata.mtime,
      fileName: file.fileName,
      url: outRelPath.replace(/\\/g, '/'),
    });
  }

  // Sort guides newest first by default
  guidesData.sort((a, b) => new Date(b.mtime) - new Date(a.mtime));

  // 4. Generate dist/index.html from template
  const templatePath = path.join(SRC_DIR, 'template.html');
  let indexHtml = fs.readFileSync(templatePath, 'utf-8');
  indexHtml = indexHtml.replace('/* [[GUIDES_DATA_PLACEHOLDER]] */', JSON.stringify(guidesData, null, 2));
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), indexHtml, 'utf-8');

  // 5. Output guides.json
  fs.writeFileSync(path.join(DIST_DIR, 'guides.json'), JSON.stringify(guidesData, null, 2), 'utf-8');

  const elapsed = Date.now() - startTime;
  console.log(`✨ [Wiki-Game] Build hoàn tất thành công trong ${elapsed}ms!`);
  console.log(`📁 Đã xử lý ${guidesData.length} bài guide vào thư mục 'dist/'.`);
  console.log(`🌐 Trang chủ sẵn sàng tại 'dist/index.html'.\n`);
}

if (require.main === module) {
  build();
}

module.exports = { build };
