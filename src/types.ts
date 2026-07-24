/**
 * Supported log sources exposed by the public API.
 */
export type LogSource =
  | "linux-syslog"
  | "apache-access"
  | "nginx-access";

/**
 * Normalized severity levels.
 */
export type LogSeverity =
  | "debug"
  | "info"
  | "notice"
  | "warning"
  | "error"
  | "critical"
  | "alert"
  | "emergency";

/**
 * Normalized log entry returned by analyze().
 *
 * This is the main public data structure
 * consumed by users of the package.
 */
export interface LogEntry {
  /**
   * Detected log source.
   */
  source: LogSource;

  /**
   * Parsed timestamp.
   *
   * Null when the source does not provide
   * enough information.
   */
  timestamp: Date | null;

  /**
   * Normalized severity.
   */
  severity: LogSeverity;

  /**
   * Human-readable message extracted
   * from the log.
   */
  message: string;

  /**
   * Original unmodified log line.
   */
  raw: string;
}

/**
 * Successful analysis result.
 */
export interface AnalyzeSuccess {
  ok: true;
  entry: LogEntry;
}

/**
 * Failed analysis result.
 */
export interface AnalyzeFailure {
  ok: false;
  error: string;
  raw: string;
}

/**
 * Public result returned by analyze().
 */
export type AnalyzeResult =
  | AnalyzeSuccess
  | AnalyzeFailure;
