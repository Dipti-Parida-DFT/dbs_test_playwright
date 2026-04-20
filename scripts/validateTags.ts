import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import YAML from 'yaml';
import { globSync } from 'glob'; // named export [3](https://techcommunity.microsoft.com/discussions/azure/scaling-cicd-pipelines-with-azure-devops--yaml-based-approach/3868396)

/**
 * Validates that tags used in test.describe and test blocks are listed in tags1.updated.yml
 * - Supports Playwright's structured tag syntax: { tag: '@foo' } or { tag: ['@foo', '@bar'] } [2](https://www.golinuxcloud.com/chown-command-in-linux/)
 */

const TAGS_YML = path.resolve('tests/metadata/tags.yml'); 
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

function loadAllowedTags(ymlPath: string): Set<string> {
  const raw = fs.readFileSync(ymlPath, 'utf-8');
  const spec = YAML.parse(raw) as TagsSpec;

  const allowed = new Set<string>();
  for (const fam of spec.tagFamilies.vertical ?? []) {
    for (const t of fam.allowed ?? []) allowed.add(t);
  }
  for (const fam of spec.tagFamilies.horizontal ?? []) {
    for (const t of fam.allowed ?? []) allowed.add(t);
  }

  return allowed; // derived from tagFamilies.*.allowed [1](https://drgnflytech-my.sharepoint.com/personal/dipti_parida_ctr_in_dragonflyft_com/Documents/Microsoft%20Copilot%20Chat%20Files/tags1.updated.yml)
}

function extractTagsFromOptionsObject(obj: ts.ObjectLiteralExpression): string[] {
  const tags: string[] = [];

  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;

    // property name: tag
    const name = prop.name;
    const key =
      ts.isIdentifier(name) ? name.text :
      ts.isStringLiteral(name) ? name.text :
      undefined;

    if (key !== 'tag') continue;

    const init = prop.initializer;

    // tag: '@smoke'
    if (ts.isStringLiteral(init)) {
      tags.push(init.text);
    }

    // tag: ['@smoke', '@payments']
    if (ts.isArrayLiteralExpression(init)) {
      for (const el of init.elements) {
        if (ts.isStringLiteral(el)) tags.push(el.text);
      }
    }
  }

  return tags;
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

type FoundTag = {
  file: string;
  where: 'describe' | 'test';
  tags: string[];
};

function validateFile(file: string, allowedTags: Set<string>): string[] {
  const srcText = fs.readFileSync(file, 'utf-8');
  const sf = ts.createSourceFile(file, srcText, ts.ScriptTarget.Latest, true);

  const errors: string[] = [];

  function checkTags(found: FoundTag) {
    const invalid = found.tags.filter(t => !allowedTags.has(t));
    if (invalid.length) {
      errors.push(
        `[INVALID TAG] ${found.file} (${found.where}): ${invalid.join(', ')}`
      );
    }
  }

  function visit(node: ts.Node) {
    if (ts.isCallExpression(node)) {
      // test.describe('name', { tag: ... }, () => {}) [2](https://www.golinuxcloud.com/chown-command-in-linux/)
      if (isTestDescribeCall(node)) {
        const optionsArg = node.arguments[1];
        if (optionsArg && ts.isObjectLiteralExpression(optionsArg)) {
          const tags = extractTagsFromOptionsObject(optionsArg);
          if (tags.length) checkTags({ file, where: 'describe', tags });
        }
      }

      // test('name', { tag: ... }, async () => {}) [2](https://www.golinuxcloud.com/chown-command-in-linux/)
      if (isTestCall(node)) {
        const optionsArg = node.arguments[1];
        if (optionsArg && ts.isObjectLiteralExpression(optionsArg)) {
          const tags = extractTagsFromOptionsObject(optionsArg);
          if (tags.length) checkTags({ file, where: 'test', tags });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sf);
  return errors;
}

function main() {
  if (!fs.existsSync(TAGS_YML)) {
    console.error(`❌ Tags YAML not found: ${TAGS_YML}`);
    process.exit(1);
  }

  const allowedTags = loadAllowedTags(TAGS_YML);

  const files = globSync(TEST_FILES_GLOB, { nodir: true }); // named export [3](https://techcommunity.microsoft.com/discussions/azure/scaling-cicd-pipelines-with-azure-devops--yaml-based-approach/3868396)
  if (!files.length) {
    console.log(`ℹ️ No test files found: ${TEST_FILES_GLOB}`);
    process.exit(0);
  }

  const allErrors: string[] = [];
  for (const f of files) {
    allErrors.push(...validateFile(f, allowedTags));
  }

  if (allErrors.length) {
    console.error('\n❌ Tag validation failed. Invalid tags found:\n');
    allErrors.forEach(e => console.error(' - ' + e));
    console.error(`\nRules source: ${TAGS_YML}`);
    console.error(`Allowed tags are defined in tagFamilies.*.allowed in the YAML.`); // [1](https://drgnflytech-my.sharepoint.com/personal/dipti_parida_ctr_in_dragonflyft_com/Documents/Microsoft%20Copilot%20Chat%20Files/tags1.updated.yml)
    process.exit(1);
  }

  console.log(`✅ Tag validation passed (${files.length} files checked).`);
}

main();