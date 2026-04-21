/**
  * Author: LC5741501
  * Created Date: 13/03/26
  * Class path "dbs_test_playwright\extract-alltests.js"
  * This specification extracts all Playwright test scripts located under the e2e folder 
  * and generates both CSV and JSON output files containing the test descriptions. 
  * These files are automatically saved to the user's Downloads directory.
 */
const fs = require("fs");
const path = require("path");
const os = require("os");

const folderPath = "./tests/e2e";

// Auto-detect Downloads folder
const downloadsFolder = path.join(os.homedir(), "Downloads");

const results = [];

// Recursively scan folders
function scanFolder(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      scanFolder(fullPath);
      continue;
    }

    if (file.endsWith(".spec.ts")) {
      extractTestsFromFile(fullPath);
    }
  }
}

// Extract test names along with their describe block context
function extractTestsFromFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");

  // Track nested describe blocks using a stack
  const describeStack = [];
  let braceDepth = 0;

  for (const line of lines) {
    // 1) Track brace depth first and pop closed describe blocks
    for (const ch of line) {
      if (ch === "{") braceDepth++;
      if (ch === "}") {
        braceDepth--;
        while (
          describeStack.length > 0 &&
          describeStack[describeStack.length - 1].depth > braceDepth
        ) {
          describeStack.pop();
        }
      }
    }

    // 2) Check for describe block opening (after braces are counted so
    //    inline objects like { tag: [...] } don't cause premature pops)
    const describeMatch = line.match(
      /test\.describe(?:\.serial|\.parallel|\.only|\.skip|\.fixme)?\s*\(\s*['"`](.*?)['"`]/
    );

    if (describeMatch) {
      describeStack.push({ name: describeMatch[1], depth: braceDepth });
    }

    // 3) Check for test declaration
    const testMatch = line.match(
      /\btest(?:\.only|\.skip|\.fixme)?\s*\(\s*['"`](.*?)['"`]/
    );

    // Exclude test.describe / test.describe.* / test.beforeEach / test.afterEach etc.
    const isDescribeOrHook = /test\.describe|test\.beforeEach|test\.afterEach|test\.beforeAll|test\.afterAll|test\.use|test\.setTimeout/.test(line);

    if (testMatch && !isDescribeOrHook) {
      const currentDescribe = describeStack.length > 0
        ? describeStack.map(d => d.name).join(" > ")
        : "";

      results.push({
        file: path.basename(filePath),
        describe: currentDescribe,
        test: testMatch[1]
      });
    }
  }
}

// Export CSV
function exportToCSV(data, outputFile) {
  const header = "File,Describe,Test Description\n";

  const rows = data
    .map(r => `"${r.file}","${(r.describe || "").replace(/"/g, '""')}","${r.test.replace(/"/g, '""')}"`)
    .join("\n");

  fs.writeFileSync(outputFile, header + rows);
  console.log(`✅ CSV saved: ${outputFile}`);
}

// Run extraction
scanFolder(folderPath);

// Save JSON to Downloads
const jsonPath = path.join(downloadsFolder, "extract-alltests.json");
fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
console.log(`✅ JSON saved: ${jsonPath}`);

// Save CSV to Downloads
const csvPath = path.join(downloadsFolder, "extract-alltests.csv");
exportToCSV(results, csvPath);
