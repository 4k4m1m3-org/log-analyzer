import { apacheParser } from "./parsers/apache.js";
import { syslogParser } from "./parsers/syslog.js";

import type {
  DetectionResult,
  ParserDefinition,
} from "./parser.js";


/**
 * Registered parsers.
 *
 * To add support for a new log format:
 *
 * 1. Create a new parser in src/parsers/
 * 2. Export its ParserDefinition
 * 3. Register it here
 */
const PARSERS: readonly ParserDefinition[] = [
  syslogParser,
  apacheParser,
];


/**
 * Detects the parser responsible
 * for handling a log entry.
 *
 * @param log Raw log line.
 * @returns Detection result or null.
 */
export function detect(
  log: string,
): DetectionResult | null {
  const line = log.trim();


  for (const parser of PARSERS) {
    if (parser.pattern.test(line)) {
      return {
        source: parser.source,
        parser: parser.parse,
      };
    }
  }


  return null;
}
