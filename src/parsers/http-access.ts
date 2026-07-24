import type {
  LogEntry,
  LogSeverity,
} from "../types.js";

import type {
  ParserDefinition,
} from "../parser.js";

/**
 * HTTP Access Log pattern.
 *
 * Compatible with:
 * - Apache Common Log Format
 * - Apache Combined Log Format
 * - Nginx default access log
 *
 * Example:
 *
 * 192.168.1.20 - - [23/Jul/2026:18:45:11 +0000]
 * "GET /index.html HTTP/1.1" 200 1024
 */
export const HTTP_ACCESS_PATTERN =
  /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d{3})\s+(\S+)/;


/**
 * Converts HTTP timestamp into a Date.
 *
 * Example:
 *
 * 23/Jul/2026:18:45:11 +0000
 */
function parseHttpTimestamp(
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
function detectHttpSeverity(
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
 * Extracts the HTTP request.
 */
function extractHttpRequest(
  request: string,
): string {
  return request.trim();
}


/**
 * Parses HTTP Access Logs.
 *
 * Compatible with Common Log Format
 * and Combined Log Format used by
 * Apache HTTP Server and Nginx.
 */
function parseHttpAccess(
  log: string,
): LogEntry {
  const match = HTTP_ACCESS_PATTERN.exec(
    log.trim(),
  );

  if (!match) {
    throw new Error(
      "Invalid HTTP Access Log format",
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
      "Incomplete HTTP Access Log data",
    );
  }

  const statusCode = Number(status);

  if (Number.isNaN(statusCode)) {
    throw new Error(
      "Invalid HTTP status code",
    );
  }

  return {
    source: "http-access",

    timestamp:
      parseHttpTimestamp(timestamp),

    severity:
      detectHttpSeverity(statusCode),

    message:
      extractHttpRequest(request),

    raw: log,
  };
}


/**
 * HTTP Access Log parser definition.
 */
export const httpAccessParser: ParserDefinition = {
  source: "http-access",

  canParse(
    log: string,
  ): boolean {
    return HTTP_ACCESS_PATTERN.test(
      log.trim(),
    );
  },

  parse: parseHttpAccess,
};