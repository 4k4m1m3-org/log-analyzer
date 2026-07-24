import { detect } from "./detect.js";

import type {
  AnalyzeResult,
  LogEntry,
} from "./types.js";

/**
 * Analyzes a raw log line and converts it
 * into a normalized LogEntry.
 *
 * This is the main public function
 * of the package.
 *
 * @param log Raw log line.
 * @returns AnalyzeResult.
 */
export function analyze(
  log: string,
): AnalyzeResult {
  const detection = detect(log);

  /**
   * Unknown log format.
   */
  if (!detection) {
    return {
      ok: false,
      error: "Unsupported or unknown log format",
      raw: log,
    };
  }

  try {
    const entry: LogEntry = detection.parser(log);

    return {
      ok: true,
      entry,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to parse log",
      raw: log,
    };
  }
}
