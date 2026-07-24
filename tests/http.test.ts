import { describe, expect, it } from "vitest";

import { analyze } from "../src/index.js";

describe("HTTP Access parser", () => {
  it("should parse a valid HTTP access log entry", () => {
    const log =
      '127.0.0.1 - - [23/Jul/2026:18:45:11 +0000] "GET /admin HTTP/1.1" 404 512';

    const result = analyze(log);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.entry.source)
      .toBe("http-access");

    expect(result.entry.severity)
      .toBe("warning");

    expect(result.entry.message)
      .toBe("GET /admin HTTP/1.1");

    expect(result.entry.raw)
      .toBe(log);

    expect(result.entry.timestamp)
      .toBeInstanceOf(Date);
  });
});
