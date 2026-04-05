import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { globSync } from 'glob';

type TagFamily = {
  family: string;
  required: boolean;
  allowed: string[];
};

type TagsMeta = {
  tagFamilies: {
    vertical: TagFamily[];
    horizontal: TagFamily[];
  };
};

const TAGS_FILE = path.resolve('test-metadata/tags.yml'); // adjust path
const TEST_GLOB = 'tests/**/*.spec.ts';

// ---------- helpers ----------
function loadMeta(): TagsMeta {
  const raw = fs.readFileSync(TAGS_FILE, 'utf-8');
  return yaml.parse(raw) as TagsMeta;
}

function buildFamilyIndex(meta: TagsMeta) {
  const families = [...meta.tagFamilies.vertical, ...meta.tagFamilies.horizontal];

  const requiredFamilies = families.filter(f => f.required);
  const allowedTagToFamily = new Map<string, string[]>();

  for (const fam of families) {
    for (const tag of fam.allowed) {
      const arr = allowedTagToFamily.get(tag) ?? [];
      arr.push(fam.family);
      allowedTagToFamily.set(tag, arr);
    }
  }

  return { families, requiredFamilies, allowedTagToFamily };
}

// Extract tags from:
// 1) test('name', { tag: '@x' }, ...) or { tag: ['@x','@y'] }
// 2) test.describe('name', { tag: ... }, () => ...)   (optional inheritance)
// 3) title tokens "@x" in test titles (optional support)
function extractTagsFromFile(content: string) {
  const tags = new Set<string>();

  // tags in { tag: '@foo' }
  for (const m of content.matchAll(/tag\s*:\s*['"](@[\w-]+)['"]/g)) {
    tags.add(m[1]);
  }

  // tags in { tag: ['@foo','@bar'] }
  for (const m of content.matchAll(/tag\s*:\s*\[\s*([^\]]+)\]/g)) {
    const inner = m[1];
    for (const t of inner.matchAll(/['"](@[\w-]+)['"]/g)) {
      tags.add(t[1]);
    }
  }

  // OPTIONAL legacy: tags in titles
  for (const m of content.matchAll(/@[\w-]+/g)) {
    tags.add(m[0]);
  }

  return [...tags];
}

function testHasFamily(tags: string[], family: TagFamily) {
  const allowed = new Set(family.allowed);
  return tags.some(t => allowed.has(t));
}

// ---------- main ----------
function main() {
  const meta = loadMeta();
  const { requiredFamilies, allowedTagToFamily } = buildFamilyIndex(meta);

  const files = globSync(TEST_GLOB, { nodir: true });

  const errors: string[] = [];

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const foundTags = extractTagsFromFile(content);

    // 1) Unknown tags (not defined anywhere in allowed lists)
    const unknown = foundTags.filter(t => !allowedTagToFamily.has(t));
    if (unknown.length) {
      errors.push(`[UNKNOWN TAG] ${file}: ${unknown.join(', ')}`);
    }

    // 2) Missing required families
    for (const fam of requiredFamilies) {
      if (!testHasFamily(foundTags, fam)) {
        errors.push(
          `[MISSING REQUIRED FAMILY] ${file}: missing one of ${fam.allowed.join(' | ')} (family=${fam.family})`
        );
      }
    }
  }

  if (errors.length) {
    console.error('\n❌ Tag validation failed:\n');
    for (const e of errors) console.error(' - ' + e);
    console.error('\n👉 Fix: add required tags and/or update test-metadata/tags1.yml\n');
    process.exit(1);
  }

  console.log('✅ Tag validation passed.');
}

main();