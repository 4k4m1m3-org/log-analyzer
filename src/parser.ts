import type {
  LogEntry,
  LogSource,
} from "./types.js";

/**
 * Internal parser function.
 *
 * Every parser receives a raw log line
 * and returns a normalized LogEntry.
 */
export type Parser = (
  log: string,
) => LogEntry;

/**
 * Definition required by every parser.
 */
export interface ParserDefinition {
  /**
   * Public source identifier.
   */
  source: LogSource;

  /**
   * Determines whether this parser
   * supports the provided log.
   */
  canParse(
    log: string,
  ): boolean;

  /**
   * Converts raw text into
   * a normalized LogEntry.
   */
  parse: Parser;
}

/**
 * Result returned internally
 * after parser detection.
 */
export interface DetectionResult {
  /**
   * Detected source type.
   */
  source: LogSource;

  /**
   * Parser responsible for
   * processing the log.
   */
  parser: Parser;
}
