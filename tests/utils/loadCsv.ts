// framework/data/loadCsv.ts
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import type { Options as CsvParseOptions } from "csv-parse";

export function loadCsv<T extends Record<string, string> = Record<string, string>>(
  filePath: string,
  options?: {
    baseDir?: string;
    parseOptions?: CsvParseOptions;
    encoding?: BufferEncoding;
  }
): T[] {
  const repoRoot = path.resolve(__dirname, "..", "..");
  const baseDir = path.resolve(options?.baseDir ?? repoRoot);

  const absPath = path.isAbsolute(filePath)
    ? filePath
    : path.resolve(baseDir, filePath);

  if (!fs.existsSync(absPath)) {
    throw new Error(
      [
        `CSV file not found.`,
        `Resolved path: ${absPath}`,
        `Provided filePath: ${filePath}`,
        `BaseDir: ${baseDir}`,
      ].join("\n")
    );
  }

  const encoding = options?.encoding ?? "utf-8";
  const content = fs.readFileSync(absPath, encoding);

  const parseOptions: CsvParseOptions = {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    ...options?.parseOptions,
  };

  return parse(content, parseOptions) as unknown as T[];
}