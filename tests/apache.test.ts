import { describe, expect, it } from "vitest";

import { analyze } from "../src/index.js";


describe("Apache Access parser", () => {
  it("should parse a valid Apache access log entry", () => {
    const log =
      '127.0.0.1 - - [23/Jul/2026:18:45:11 +0000] "GET /admin HTTP/1.1" 404 512';


    const result = analyze(log);


    expect(result.ok)
      .toBe(true);


    if (!result.ok) {
      return;
    }


    expect(result.entry.source)
      .toBe("apache-access");


    expect(result.entry.severity)
      .toBe("warning");


    expect(result.entry.message)
      .toBe("GET /admin HTTP/1.1");


    expect(result.entry.raw)
      .toBe(log);


    expect(result.entry.timestamp)
      .toBeInstanceOf(Date);
  });


  it("should classify successful requests as info", () => {
    const log =
      '192.168.1.10 - - [23/Jul/2026:18:45:11 +0000] "GET /index.html HTTP/1.1" 200 1024';


    const result = analyze(log);


    expect(result.ok)
      .toBe(true);


    if (!result.ok) {
      return;
    }


    expect(result.entry.source)
      .toBe("apache-access");


    expect(result.entry.severity)
      .toBe("info");
  });


  it("should classify server errors as error", () => {
    const log =
      '10.0.0.15 - - [23/Jul/2026:18:45:11 +0000] "GET /api HTTP/1.1" 503 256';


    const result = analyze(log);


    expect(result.ok)
      .toBe(true);


    if (!result.ok) {
      return;
    }


    expect(result.entry.source)
      .toBe("apache-access");


    expect(result.entry.severity)
      .toBe("error");
  });


  it("should reject invalid HTTP access logs", () => {
    const log =
      "invalid apache access log";


    const result = analyze(log);


    expect(result.ok)
      .toBe(false);
  });
});
