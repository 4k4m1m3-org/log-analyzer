import type { ParserDefinition } from "../parser.js";
import type {
  LogEntry,
  LogSeverity,
} from "../types.js";


/**
 * Matches Linux Syslog format.
 *
 * Example:
 *
 * Jul 23 18:45:11 ubuntu sshd[1234]: Accepted password for root
 *
 * Groups:
 * 1 - Month
 * 2 - Day
 * 3 - Time
 * 4 - Host
 * 5 - Process/message payload
 */
const SYSLOG_PATTERN =
  /^([A-Z][a-z]{2})\s+(\d{1,2})\s(\d{2}:\d{2}:\d{2})\s+(\S+)\s+(.*)$/;


/**
 * Converts syslog timestamp into Date.
 *
 * Syslog does not include the year,
 * so the current year is assumed.
 */
function parseTimestamp(
  month: string,
  day: string,
  time: string,
): Date | null {
  const currentYear = new Date().getFullYear();

  const date = new Date(
    `${month} ${day}, ${currentYear} ${time}`,
  );

  return Number.isNaN(date.getTime())
    ? null
    : date;
}


/**
 * Detects normalized severity from message content.
 *
 * This is intentionally simple for v0.1.0.
 * Future versions can support RFC5424 severity codes.
 */
function detectSeverity(
  message: string,
): LogSeverity {
  const lower = message.toLowerCase();

  if (
    lower.includes("emergency") ||
    lower.includes("panic") ||
    lower.includes("critical")
  ) {
    return "critical";
  }

  if (
    lower.includes("failed") ||
    lower.includes("failure") ||
    lower.includes("error") ||
    lower.includes("denied")
  ) {
    return "error";
  }

  if (
    lower.includes("warning") ||
    lower.includes("warn")
  ) {
    return "warning";
  }

  return "info";
}


/**
 * Removes process metadata from syslog payload.
 *
 * Example:
 *
 * sshd[1234]: Accepted password
 *
 * becomes:
 *
 * Accepted password
 */
function normalizeMessage(
  value: string,
): string {
  return value
    .replace(
      /^[^\s:]+(?:\[\d+\])?:\s*/,
      "",
    )
    .trim();
}


/**
 * Parses a Linux Syslog line.
 */
function parseSyslog(
  log: string,
): LogEntry {
  const match = SYSLOG_PATTERN.exec(
    log.trim(),
  );

  if (!match) {
    throw new Error(
      "Invalid Linux Syslog format",
    );
  }

  const month = match[1];
  const day = match[2];
  const time = match[3];
  const payload = match[5];

  if (
    !month ||
    !day ||
    !time ||
    !payload
  ) {
    throw new Error(
      "Incomplete Linux Syslog data",
    );
  }

  const message = normalizeMessage(
    payload,
  );

  if (!message) {
    throw new Error(
      "Empty Linux Syslog message",
    );
  }

  return {
    source: "linux-syslog",

    timestamp: parseTimestamp(
      month,
      day,
      time,
    ),

    severity: detectSeverity(
      message,
    ),

    message,

    raw: log,
  };
}


/**
 * Linux Syslog parser definition.
 *
 * Uses capability detection instead
 * of exposing the internal regex.
 */
export const syslogParser: ParserDefinition = {
  source: "linux-syslog",

  canParse(log: string): boolean {
    return SYSLOG_PATTERN.test(log.trim());
  },

  parse: parseSyslog,
};