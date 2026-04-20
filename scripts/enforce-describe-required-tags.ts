import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import YAML from 'yaml';
import { globSync } from 'glob'; // named export [3](https://www.dbs.com.sg/documents/276102/283026/ideal-start-guide.pdf)

/**
 * Enforce REQUIRED tag families ONLY on test.describe blocks.
 * Still validate that all tags used in describe/test blocks exist in YAML allowed lists.
 *
 * Playwright supports tags via details object on both test and describe: { tag: '@x' } or { tag: ['@x','@y'] } [2](https://www.dotlinux.net/blog/how-to-use-chown-command-to-change-file-ownership-11-examples/)
 */

const TAGS_YML = path.resolve('tests/metadata/tags.yml');  

const TEST_FILES_GLOB = 'tests/**/*.spec.ts';

// Optional: if true, enforce required families ONLY for top-level describes
const TOP_LEVEL_DESCRIBE_ONLY = false;

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

type Issue = {
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

  const requiredFamilies = families.filter(f => f.required); // required:true families [1](https://drgnflytech-my.sharepoint.com/personal/dipti_parida_ctr_in_dragonflyft_com/Documents/Microsoft%20Copilot%20Chat%20Files/tags.yml)
  return { allowedTags, requiredFamilies };
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
  // test.describe(...)
  const expr = node.expression;
  return (
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.expression) &&
    expr.expression.text === 'test' &&
    expr.name.text === 'describe'
  );
}

function isTestCall(node: ts.CallExpression): boolean {
  // test(...)
  return ts.isIdentifier(node.expression) && node.expression.text === 'test';
}

function hasAnyAllowed(tags: string[], allowed: string[]): boolean {
  const allowedSet = new Set(allowed);
  return tags.some(t => allowedSet.has(t));
}

function validateUnknownTags(
  issues: Issue[],
  file: string,
  kind: 'describe' | 'test',
  tags: string[],
  allowedTags: Set<string>
) {
  const unknown = tags.filter(t => !allowedTags.has(t));
  if (unknown.length) {
    issues.push({
      file,
      kind,
      message: `Unknown/unsupported tag(s): ${unknown.join(', ')}`,
    });
  }
}

function validateRequiredFamiliesOnDescribe(
  issues: Issue[],
  file: string,
  tags: string[],
  requiredFamilies: TagFamily[]
) {
  for (const fam of requiredFamilies) {
    if (!hasAnyAllowed(tags, fam.allowed)) {
      issues.push({
        file,
        kind: 'describe',
        message: `Missing required family "${fam.family}" (need one of: ${fam.allowed.join(' | ')})`,
      });
    }
  }
}

function main() {
  if (!fs.existsSync(TAGS_YML)) {
    console.error(`❌ Tags YAML not found: ${TAGS_YML}`);
    process.exit(1);
  }

  const spec = loadSpec(TAGS_YML);
  const { allowedTags, requiredFamilies } = buildRules(spec);

  const files = globSync(TEST_FILES_GLOB, { nodir: true }); // [3](https://www.dbs.com.sg/documents/276102/283026/ideal-start-guide.pdf)
  if (!files.length) {
    console.log(`ℹ️ No spec files found: ${TEST_FILES_GLOB}`);
    process.exit(0);
  }

  const issues: Issue[] = [];

  for (const file of files) {
    const srcText = fs.readFileSync(file, 'utf-8');
    const sf = ts.createSourceFile(file, srcText, ts.ScriptTarget.Latest, true);

    // track nesting depth of describes to support TOP_LEVEL_DESCRIBE_ONLY
    let describeDepth = 0;

    function visit(node: ts.Node) {
      if (ts.isCallExpression(node)) {
        // --- test.describe(...) ---
        if (isTestDescribeCall(node)) {
          const args = node.arguments;
          const optionsArg = args[1];

          let describeTags: string[] = [];
          if (optionsArg && ts.isObjectLiteralExpression(optionsArg)) {
            describeTags = extractTagsFromOptionsObject(optionsArg);
          }
          describeTags = uniq(describeTags);

          // Always validate describe tags exist in YAML
          validateUnknownTags(issues, file, 'describe', describeTags, allowedTags);

          // Enforce required families only on describe blocks
          const shouldEnforce =
            !TOP_LEVEL_DESCRIBE_ONLY || (TOP_LEVEL_DESCRIBE_ONLY && describeDepth === 0);

          if (shouldEnforce) {
            validateRequiredFamiliesOnDescribe(issues, file, describeTags, requiredFamilies);
          }

          describeDepth++;
          ts.forEachChild(node, visit);
          describeDepth--;
          return;
        }

        // --- test(...) ---
        if (isTestCall(node)) {
          const args = node.arguments;
          const optionsArg = args[1];

          let testTags: string[] = [];
          if (optionsArg && ts.isObjectLiteralExpression(optionsArg)) {
            testTags = extractTagsFromOptionsObject(optionsArg);
          }
          testTags = uniq(testTags);

          // Validate test tags exist in YAML (but do NOT enforce required families here)
          validateUnknownTags(issues, file, 'test', testTags, allowedTags);

          ts.forEachChild(node, visit);
          return;
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(sf);
  }

  if (issues.length) {
    console.error('\n❌ Describe-only required tag policy failed:\n');
    for (const i of issues) {
      console.error(` - ${i.file} [${i.kind}]: ${i.message}`);
    }

    console.error(`\nRules source: ${TAGS_YML}`);
    console.error(
      `Required families are enforced ONLY on test.describe blocks where required:true in YAML (ex: type + component).`
    ); // [1](https://drgnflytech-my.sharepoint.com/personal/dipti_parida_ctr_in_dragonflyft_com/Documents/Microsoft%20Copilot%20Chat%20Files/tags.yml)
    process.exit(1);
  }

  console.log(`✅ Tag policy enforcement passed (${files.length} files checked).`);
}

main();