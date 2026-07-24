import type { ParserDefinition } from "../parser.js";
import type { LogEntry } from "../types.js";

/**
 * HTTP Access Log format.
 *
 * Compatible with:
 * - Apache Common Log Format
 * - Apache Combined Log Format
 * - Nginx default access log
 */
const HTTP_PATTERN =
  /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([^"]+)"\s+(\d{3})\s+(\S+)/;

/**
 * Converts HTTP timestamp into Date.
 */
function parseTimestamp(
  value: string,
): Date | null {
  const date = new Date(
    value.replace(
      /^(\d{2})\/([A-Za-z]{3})\/(\d{4}):/,
      "$2 $1 $3 ",
    ),
  );

  return Number.isNaN(date.getTime())
    ? null
    : date;
}

/**
 * Maps HTTP status codes into severity.
 */
function detectSeverity(
  statusCode: number,
):
  | "info"
  | "warning"
  | "error" {
  if (statusCode >= 500) {
    return "error";
  }

  if (statusCode >= 400) {
    return "warning";
  }

  return "info";
}

/**
 * Parses HTTP access logs.
 */
function parseHttp(log: string): LogEntry {
  const match = HTTP_PATTERN.exec(log.trim());

  if (!match) {
    throw new Error("Invalid HTTP access log format");
  }

  const timestamp = match[2];
  const request = match[3];
  const status = match[4];

  if (
    !timestamp ||
    !request ||
    !status
  ) {
    throw new Error("Incomplete HTTP access log data");
  }

  const statusCode = Number(status);

  return {
    source: "http-access",

    timestamp: parseTimestamp(timestamp),

    severity: detectSeverity(statusCode),

    message: request,

    raw: log,
  };
}

/**
 * HTTP access parser definition.
 */
export const httpParser: ParserDefinition = {
  source: "http-access",
  pattern: HTTP_PATTERN,
  parse: parseHttp,
};
