/**
 * Internal parser function.
 *
 * Every parser receives a raw log line
 * and returns a normalized LogEntry.
 */
export type Parser = (log: string) => import("./types.js").LogEntry;

/**
 * Definition required by every parser module.
 *
 * Each parser is responsible for:
 * - identifying its own format
 * - parsing the log content
 */
export interface ParserDefinition {
  /**
   * Public source identifier.
   */
  source: import("./types.js").LogSource;

  /**
   * Pattern used to detect the log format.
   */
  pattern: RegExp;

  /**
   * Function that converts raw text
   * into a normalized LogEntry.
   */
  parse: Parser;
}

/**
 * Result returned internally after detection.
 */
export interface DetectionResult {
  /**
   * Detected source type.
   */
  source: import("./types.js").LogSource;

  /**
   * Parser responsible for processing
   * the detected log.
   */
  parser: Parser;
}
