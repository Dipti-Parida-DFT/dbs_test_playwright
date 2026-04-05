import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import ts from 'typescript';
import { globSync } from 'glob';

type TagFamily = { family: string; required: boolean; allowed: string[] };
type TagsMeta = {
  tagFamilies: { vertical: TagFamily[]; horizontal: TagFamily[] };
};

const TAGS_FILE = path.resolve('tests/metadata/tags1.yml');
const TEST_FILES = globSync('tests/**/*.spec.ts', { nodir: true });

console.log(`📁 Loading tags from: ${TAGS_FILE}`);
console.log(`📊 Found ${TEST_FILES.length} test files`);

function loadMeta(): TagsMeta {
  return yaml.parse(fs.readFileSync(TAGS_FILE, 'utf-8')) as TagsMeta;
}

function getFamily(meta: TagsMeta, familyName: string): TagFamily | undefined {
  return [...meta.tagFamilies.vertical, ...meta.tagFamilies.horizontal]
    .find(f => f.family === familyName);
}

function extractTagsFromDetailsObject(node: ts.ObjectLiteralExpression): string[] {
  const tags: string[] = [];
  for (const prop of node.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    if (!ts.isIdentifier(prop.name) || prop.name.text !== 'tag') continue;

    const init = prop.initializer;

    // tag: '@payments'
    if (ts.isStringLiteral(init)) {
      tags.push(init.text);
    }

    // tag: ['@payments', '@smoke']
    if (ts.isArrayLiteralExpression(init)) {
      for (const el of init.elements) {
        if (ts.isStringLiteral(el)) tags.push(el.text);
      }
    }
  }
  return tags;
}

function isTestDescribeCall(node: ts.CallExpression): boolean {
  // matches: test.describe(...)
  const expr = node.expression;
  return (
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.expression) &&
    expr.expression.text === 'test' &&
    expr.name.text === 'describe'
  );
}

function hasAnyAllowed(tags: string[], allowed: string[]): boolean {
  const allowedSet = new Set(allowed);
  return tags.some(t => allowedSet.has(t));
}

function main() {
  const meta = loadMeta();

  // Policy A: Require domain tag on describe blocks.
  const domainFamily = getFamily(meta, 'domain');
  if (!domainFamily) throw new Error('domain family not found in tags.yml');

  const errors: string[] = [];

  for (const file of TEST_FILES) {
    const sourceText = fs.readFileSync(file, 'utf-8');
    const sf = ts.createSourceFile(file, sourceText, ts.ScriptTarget.Latest, true);

    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && isTestDescribeCall(node)) {
        const args = node.arguments;

        // Expected forms:
        // test.describe('name', { tag: ... }, () => {})
        // test.describe('name', () => {})  <-- should fail enforcement
        const detailsArg = args.length >= 2 && ts.isObjectLiteralExpression(args[1]) ? args[1] : undefined;

        if (!detailsArg) {
          errors.push(`[DESCRIBE TAG MISSING] ${file}: test.describe(...) has no details object with tags.`);
          return;
        }

        const tags = extractTagsFromDetailsObject(detailsArg);

        if (tags.length === 0) {
          errors.push(`[DESCRIBE TAG EMPTY] ${file}: test.describe(...) details object has no "tag".`);
          return;
        }

        // Enforce: domain must exist
        if (!hasAnyAllowed(tags, domainFamily!.allowed)) {
          errors.push(
            `[DESCRIBE MISSING DOMAIN] ${file}: describe must include one of ${domainFamily!.allowed.join(' | ')}`
          );
        }
      }
      ts.forEachChild(node, visit);
    }

    visit(sf);
  }

  if (errors.length) {
    console.error('\n❌ Describe tag enforcement failed:\n');
    errors.forEach(e => console.error(' - ' + e));
    console.error('\n👉 Fix: Add domain tags to test.describe blocks using { tag: [...] }.\n');
    process.exit(1);
  }

  console.log('✅ Describe tag enforcement passed.');
}

main();