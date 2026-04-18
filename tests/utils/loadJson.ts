import fs from "fs";
import path from "path";

/**
 * Load a JSON file and return typed data.
 *
 * @param filePath - File name (e.g., "login.json") or relative path under baseDir
 * @param options
 *  - baseDir: defaults to "<repoRoot>/test-data"
 */
export function loadJson<T>(
  filePath: string,
  options?: {
    baseDir?: string;
    encoding?: BufferEncoding;
  }
): T {
  const repoRoot = process.cwd();
  const baseDir = options?.baseDir ?? path.join(repoRoot, "test-data");

  const absPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(baseDir, filePath);

  if (!fs.existsSync(absPath)) {
    throw new Error(
      [
        "JSON file not found.",
        `Resolved path: ${absPath}`,
        `Provided filePath: ${filePath}`,
        `BaseDir: ${baseDir}`,
      ].join("\n")
    );
  }

  const encoding = options?.encoding ?? "utf-8";
  const raw = fs.readFileSync(absPath, encoding);

  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    throw new Error(`Invalid JSON in file ${absPath}: ${(err as Error).message}`);
  }
}