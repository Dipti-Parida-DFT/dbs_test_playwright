const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const yaml = require('yaml');

const TAG_FILE = path.resolve(__dirname, '../tests/metadata/tags.yml');

function loadKnownTags() {
  const content = fs.readFileSync(TAG_FILE, 'utf-8');
  const parsed = yaml.parse(content);
  const tags = parsed?.tags?.map(t => t.id) ?? [];
  return new Set(tags);
}

// Extract @tags from:
// 1) tag: '@smoke' or tag: ['@smoke', '@payments']
// 2) test('title', { tag: ... })  (Playwright test options)
function extractTagsFromText(text) {
  const tags = new Set();

  // Remove import statements to avoid matching @playwright
  const cleanedText = text.replace(/^import\s+.*from\s+['"][^'"]*['"];?$/gm, '');

  // tag: '@foo'
  const singleTagMatches = cleanedText.matchAll(/tag\s*:\s*['"](@[\w-]+)['"]/g);
  for (const m of singleTagMatches) tags.add(m[1]);

  // tag: ['@foo', '@bar']
  const arrayTagMatches = cleanedText.matchAll(/tag\s*:\s*\[\s*([^\]]+)\]/g);
  for (const m of arrayTagMatches) {
    const inner = m[1];
    const items = inner.matchAll(/['"](@[\w-]+)['"]/g);
    for (const it of items) tags.add(it[1]);
  }

  // test('title @foo @bar', ...) - tags in test titles (optional legacy support)
  // Only match tags that appear after test/describe and are followed by closing brace/paren
  const testTagMatches = cleanedText.matchAll(/(?:test|describe)\s*\([^)]*\s+(@[\w-]+)/g);
  for (const m of testTagMatches) tags.add(m[1]);

  return [...tags];
}

function main() {
  try {
    const known = loadKnownTags();

    const specFiles = glob.sync('tests/**/*.spec.ts');
    const unknownByFile = {};

    for (const file of specFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const found = extractTagsFromText(content);

      const unknown = found.filter(t => !known.has(t));
      if (unknown.length) unknownByFile[file] = unknown;
    }

    if (Object.keys(unknownByFile).length) {
      console.error('\n❌ Unknown tags found (not defined in tests/metadata/tags.yml):\n');
      for (const [file, tags] of Object.entries(unknownByFile)) {
        console.error(`- ${file}: ${tags.join(', ')}`);
      }
      console.error('\n👉 Fix by adding tags to tests/metadata/tags.yml OR correcting typos.\n');
      process.exit(1);
    }

    console.log('✅ Tag validation passed: all tags are defined in tests/metadata/tags.yml');
    process.exit(0);
  } catch (error) {
    console.error('Error during validation:', error);
    process.exit(1);
  }
}

main();
