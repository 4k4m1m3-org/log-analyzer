import { describe, expect, it } from "vitest";

import { analyze } from "../src/index.js";


describe("Nginx Access parser", () => {
  it("should parse a valid Nginx access log entry", () => {
    const log =
      '192.168.1.20 - - [23/Jul/2026:18:45:11 +0000] "GET /index.html HTTP/1.1" 200 1024';


    const result = analyze(log);


    expect(result.ok)
      .toBe(true);


    if (!result.ok) {
      return;
    }


    expect(result.entry.source)
      .toBe("http-access");


    expect(result.entry.severity)
      .toBe("info");


    expect(result.entry.message)
      .toBe("GET /index.html HTTP/1.1");


    expect(result.entry.raw)
      .toBe(log);


    expect(result.entry.timestamp)
      .toBeInstanceOf(Date);
  });


  it("should classify client errors as warning", () => {
    const log =
      '10.0.0.25 - - [23/Jul/2026:18:45:11 +0000] "GET /admin HTTP/1.1" 404 512';


    const result = analyze(log);


    expect(result.ok)
      .toBe(true);


    if (!result.ok) {
      return;
    }


    expect(result.entry.source)
      .toBe("http-access");


    expect(result.entry.severity)
      .toBe("warning");
  });


  it("should classify server errors as error", () => {
    const log =
      '10.0.0.30 - - [23/Jul/2026:18:45:11 +0000] "POST /api/login HTTP/1.1" 500 256';


    const result = analyze(log);


    expect(result.ok)
      .toBe(true);


    if (!result.ok) {
      return;
    }


    expect(result.entry.source)
      .toBe("http-access");


    expect(result.entry.severity)
      .toBe("error");
  });


  it("should reject invalid Nginx access logs", () => {
    const log =
      "invalid nginx access log";


    const result = analyze(log);


    expect(result.ok)
      .toBe(false);
  });
});
