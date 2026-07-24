import { httpAccessParser } from "./parsers/http-access.js";
import { syslogParser } from "./parsers/syslog.js";

import type {
  DetectionResult,
  ParserDefinition,
} from "./parser.js";

const PARSERS: readonly ParserDefinition[] = [
  syslogParser,
  httpAccessParser,
];

export function detect(
  log: string,
): DetectionResult | null {
  const line = log.trim();

  for (const parser of PARSERS) {
    if (parser.canParse(line)) {
      return {
        source: parser.source,
        parser: parser.parse,
      };
    }
  }

  return null;
}
