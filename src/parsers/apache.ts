import type { ParserDefinition } from "../parser.js";
import type {
  LogEntry,
  LogSeverity,
} from "../types.js";


/**
 * Apache Common / Combined Access Log format.
 *
 * Example:
 *
 * 127.0.0.1 - - [23/Jul/2026:18:45:11 +0000]
 * "GET /admin HTTP/1.1" 404 512
 */
const APACHE_PATTERN =
  /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d{3})\s+(\S+)/;


/**
 * Converts Apache timestamp format
 * into a JavaScript Date object.
 *
 * Example:
 *
 * 23/Jul/2026:18:45:11 +0000
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
 * Maps HTTP status codes into
 * normalized severity levels.
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
 * Extracts HTTP request information.
 *
 * Example:
 *
 * GET /admin HTTP/1.1
 */
function extractRequest(
  request: string,
): string {
  return request.trim();
}


/**
 * Parses Apache access logs.
 */
function parseApache(
  log: string,
): LogEntry {
  const match = APACHE_PATTERN.exec(
    log.trim(),
  );


  if (!match) {
    throw new Error(
      "Invalid Apache access log format",
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
      "Incomplete Apache access log data",
    );
  }


  const statusCode = Number(status);


  if (Number.isNaN(statusCode)) {
    throw new Error(
      "Invalid Apache HTTP status code",
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
 * Apache Access Log parser definition.
 */
export const apacheParser: ParserDefinition = {
  source: "apache-access",

  pattern: APACHE_PATTERN,

  parse: parseApache,
};
