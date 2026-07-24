import type { ParserDefinition } from "../parser.js";
import type {
  LogEntry,
  LogSeverity,
} from "../types.js";


/**
 * Nginx Default Access Log format.
 *
 * Example:
 *
 * 127.0.0.1 - - [23/Jul/2026:18:45:11 +0000]
 * "GET /admin HTTP/1.1" 404 512
 */
const NGINX_PATTERN =
  /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d{3})\s+(\S+)/;


/**
 * Converts Nginx timestamp format
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
 */
function extractRequest(
  request: string,
): string {
  return request.trim();
}


/**
 * Parses Nginx access logs.
 */
function parseNginx(
  log: string,
): LogEntry {
  const match = NGINX_PATTERN.exec(
    log.trim(),
  );


  if (!match) {
    throw new Error(
      "Invalid Nginx access log format",
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
      "Incomplete Nginx access log data",
    );
  }


  const statusCode = Number(status);


  if (Number.isNaN(statusCode)) {
    throw new Error(
      "Invalid Nginx HTTP status code",
    );
  }


  return {
    source: "nginx-access",

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
 * Nginx Access Log parser definition.
 */
export const nginxParser: ParserDefinition = {
  source: "nginx-access",

  pattern: NGINX_PATTERN,

  parse: parseNginx,
};
