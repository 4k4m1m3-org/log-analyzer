import type { ParserDefinition } from "../parser.js";
import type {
  LogEntry,
  LogSeverity,
} from "../types.js";

/**
 * HTTP Access Log format.
 *
 * Currently mapped to Apache Access Logs.
 *
 * Supported formats:
 * - Apache Common Log Format
 * - Apache Combined Log Format (partial)
 *
 * Nginx support will be extracted
 * into a dedicated parser in v0.2.0.
 */
const HTTP_PATTERN =
  /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d{3})\s+(\S+)/;


/**
 * Supported HTTP severity levels.
 */
type HttpSeverity =
  | "info"
  | "warning"
  | "error";


/**
 * Converts Apache/Nginx timestamp format
 * into a JavaScript Date object.
 *
 * Example:
 *
 * 23/Jul/2026:18:45:11 +0000
 *
 */
function parseTimestamp(
  value: string,
): Date | null {
  const normalized = value.replace(
    /^(\d{2})\/([A-Za-z]{3})\/(\d{4}):/,
    "$2 $1 $3 ",
  );

  const date = new Date(normalized);

  return Number.isNaN(date.getTime())
    ? null
    : date;
}


/**
 * Maps HTTP status codes
 * into normalized severity.
 */
function detectSeverity(
  statusCode: number,
): LogSeverity {
  if (statusCode >= 500) {
    return "error";
  }

  if (statusCode >= 400) {
    return "warning";
  }

  return "info";
}


/**
 * Extracts request information
 * from an HTTP access log.
 *
 * Example:
 *
 * GET /admin HTTP/1.1
 */
function extractRequest(
  value: string,
): string {
  return value.trim();
}


/**
 * Parses HTTP access log entries.
 *
 * Currently exposed as Apache access parser.
 */
function parseHttp(
  log: string,
): LogEntry {
  const match = HTTP_PATTERN.exec(
    log.trim(),
  );

  if (!match) {
    throw new Error(
      "Invalid HTTP access log format",
    );
  }


  const timestamp = match[2];
  const request = match[3];
  const status = match[4];


  if (
    !timestamp ||
    !request ||
    !status
  ) {
    throw new Error(
      "Incomplete HTTP access log data",
    );
  }


  const statusCode = Number(status);


  if (Number.isNaN(statusCode)) {
    throw new Error(
      "Invalid HTTP status code",
    );
  }


  return {
    source: "apache-access",

    timestamp:
      parseTimestamp(timestamp),

    severity:
      detectSeverity(statusCode),

    message:
      extractRequest(request),

    raw: log,
  };
}


/**
 * Apache HTTP Access parser definition.
 *
 * Registered by detect.ts.
 */
export const httpParser: ParserDefinition = {
  source: "apache-access",

  pattern: HTTP_PATTERN,

  parse: parseHttp,
};
