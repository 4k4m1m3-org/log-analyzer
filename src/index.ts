/**
 * Public API
 *
 * Main log analysis function.
 */
export { analyze } from "./analyze.js";

/**
 * Public types.
 *
 * These types are part of the package contract
 * and can be safely imported by consumers.
 */
export type {
  AnalyzeFailure,
  AnalyzeResult,
  AnalyzeSuccess,
  LogEntry,
  LogSeverity,
  LogSource,
} from "./types.js";
