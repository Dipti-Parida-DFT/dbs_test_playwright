import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import YAML from 'yaml';
import { globSync } from 'glob'; // named exports [3](https://www.dbs.com.sg/documents/276102/283026/ideal-start-guide.pdf)

/**
 * Enforces tag policy for Playwright test.describe and test blocks,
 * based on required tag families in tags.yml.
 *
 * Playwright supports tags via details object on tests and describe blocks: { tag: '@x' } or { tag: ['@x','@y'] } [2](https://www.dotlinux.net/blog/how-to-use-chown-command-to-change-file-ownership-11-examples/)
 */

const TAGS_YML = path.resolve('tests/metadata/tags.yml');          // <-- your attached file [1](https://drgnflytech-my.sharepoint.com/personal/dipti_parida_ctr_in_dragonflyft_com/Documents/Microsoft%20Copilot%20Chat%20Files/tags.yml)
const TEST_FILES_GLOB = 'tests/**/*.spec.ts';

type TagFamily = {
  family: string;
  required: boolean;
  allowed: string[];
};

type TagsSpec = {
  version: number;
  tagFamilies: {
    vertical: TagFamily[];
    horizontal: TagFamily[];
  };
};

type FoundIssue = {
  file: string;
  kind: 'describe' | 'test';
  message: string;
};

function loadSpec(ymlPath: string): TagsSpec {
  const raw = fs.readFileSync(ymlPath, 'utf-8');
  return YAML.parse(raw) as TagsSpec;
}

function buildRules(spec: TagsSpec) {
  const families: TagFamily[] = [
    ...(spec.tagFamilies.vertical ?? []),
    ...(spec.tagFamilies.horizontal ?? []),
  ];

  const allowedTags = new Set<string>();
  for (const fam of families) {
    for (const tag of fam.allowed ?? []) allowedTags.add(tag);
  }

  const requiredFamilies = families.filter(f => f.required);

  return { families, allowedTags, requiredFamilies };
}

function extractTagsFromOptionsObject(obj: ts.ObjectLiteralExpression): string[] {
  const tags: string[] = [];

  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;

    const name = prop.name;
    const key =
      ts.isIdentifier(name) ? name.text :
      ts.isStringLiteral(name) ? name.text :
      undefined;

    if (key !== 'tag') continue;

    const init = prop.initializer;

    // tag: '@smoke'
    if (ts.isStringLiteral(init)) tags.push(init.text);

    // tag: ['@smoke', '@payments']
    if (ts.isArrayLiteralExpression(init)) {
      for (const el of init.elements) {
        if (ts.isStringLiteral(el)) tags.push(el.text);
      }
    }
  }

  return tags;
}

function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function isTestDescribeCall(node: ts.CallExpression): boolean {
  // matches test.describe(...)
  const expr = node.expression;
  return (
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.expression) &&
    expr.expression.text === 'test' &&
    expr.name.text === 'describe'
  );
}

function isTestCall(node: ts.CallExpression): boolean {
  // matches test(...)
  return ts.isIdentifier(node.expression) && node.expression.text === 'test';
}

function hasAnyAllowed(tags: string[], allowed: string[]): boolean {
  const allowedSet = new Set(allowed);
  return tags.some(t => allowedSet.has(t));
}

function validateRequiredFamilies(
  issues: FoundIssue[],
  file: string,
  kind: 'describe' | 'test',
  effectiveTags: string[],
  requiredFamilies: TagFamily[]
) {
  for (const fam of requiredFamilies) {
    if (!hasAnyAllowed(effectiveTags, fam.allowed)) {
      issues.push({
        file,
        kind,
        message: `Missing required family "${fam.family}" (need one of: ${fam.allowed.join(' | ')})`,
      });
    }
  }
}

function validateUnknownTags(
  issues: FoundIssue[],
  file: string,
  kind: 'describe' | 'test',
  effectiveTags: string[],
  allowedTags: Set<string>
) {
  const unknown = effectiveTags.filter(t => !allowedTags.has(t));
  if (unknown.length) {
    issues.push({
      file,
      kind,
      message: `Unknown/unsupported tag(s): ${unknown.join(', ')}`,
    });
  }
}

function main() {
  if (!fs.existsSync(TAGS_YML)) {
    console.error(`❌ Tags YAML not found: ${TAGS_YML}`);
    process.exit(1);
  }

  const spec = loadSpec(TAGS_YML);
  const { allowedTags, requiredFamilies } = buildRules(spec);

  const files = globSync(TEST_FILES_GLOB, { nodir: true }); // named export [3](https://www.dbs.com.sg/documents/276102/283026/ideal-start-guide.pdf)
  if (!files.length) {
    console.log(`ℹ️ No spec files found: ${TEST_FILES_GLOB}`);
    process.exit(0);
  }

  const issues: FoundIssue[] = [];

  for (const file of files) {
    const srcText = fs.readFileSync(file, 'utf-8');
    const sf = ts.createSourceFile(file, srcText, ts.ScriptTarget.Latest, true);

    // Keep a stack of inherited tags from nested describe blocks
    const describeTagStack: string[][] = [];

    function visit(node: ts.Node) {
      if (ts.isCallExpression(node)) {
        // ---- test.describe ---- [2](https://www.dotlinux.net/blog/how-to-use-chown-command-to-change-file-ownership-11-examples/)
        if (isTestDescribeCall(node)) {
          const args = node.arguments;
          const optionsArg = args[1];

          // tags on THIS describe block
          let ownDescribeTags: string[] = [];
          if (optionsArg && ts.isObjectLiteralExpression(optionsArg)) {
            ownDescribeTags = extractTagsFromOptionsObject(optionsArg);
          }

          // effective tags = inherited + own
          const inherited = uniq(describeTagStack.flat());
          const effectiveDescribeTags = uniq([...inherited, ...ownDescribeTags]);

          // enforce policy on describe itself
          validateUnknownTags(issues, file, 'describe', effectiveDescribeTags, allowedTags);
          validateRequiredFamilies(issues, file, 'describe', effectiveDescribeTags, requiredFamilies);

          // now push tags for nested content
          describeTagStack.push(ownDescribeTags);
          ts.forEachChild(node, visit);
          describeTagStack.pop();
          return;
        }

        // ---- test(...) ---- [2](https://www.dotlinux.net/blog/how-to-use-chown-command-to-change-file-ownership-11-examples/)
        if (isTestCall(node)) {
          const args = node.arguments;
          const optionsArg = args[1];

          let ownTestTags: string[] = [];
          if (optionsArg && ts.isObjectLiteralExpression(optionsArg)) {
            ownTestTags = extractTagsFromOptionsObject(optionsArg);
          }

          const inherited = uniq(describeTagStack.flat());
          const effectiveTestTags = uniq([...inherited, ...ownTestTags]);

          // enforce policy on test
          validateUnknownTags(issues, file, 'test', effectiveTestTags, allowedTags);
          validateRequiredFamilies(issues, file, 'test', effectiveTestTags, requiredFamilies);

          ts.forEachChild(node, visit);
          return;
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sf);
  }

  if (issues.length) {
    console.error('\n❌ Tag policy enforcement failed:\n');
    for (const i of issues) {
      console.error(` - ${i.file} [${i.kind}]: ${i.message}`);
    }

    console.error(`\nRules source: ${TAGS_YML}`);
    console.error(`Required families come from tagFamilies.* where required: true (e.g., type + component in your file).`); // [1](https://drgnflytech-my.sharepoint.com/personal/dipti_parida_ctr_in_dragonflyft_com/Documents/Microsoft%20Copilot%20Chat%20Files/tags.yml)
    process.exit(1);
  }

  console.log(`✅ Tag policy enforcement passed (${files.length} files checked).`);
}

main();