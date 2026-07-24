import { describe, expect, it } from "vitest";

import { analyze } from "../src/index.js";

describe("Linux Syslog parser", () => {
  it("should parse a valid Linux Syslog entry", () => {
    const log =
      "Jul 23 18:45:11 ubuntu sshd[1234]: Accepted password for root";

    const result = analyze(log);

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.entry.source)
      .toBe("linux-syslog");

    expect(result.entry.severity)
      .toBe("info");

    expect(result.entry.message)
      .toBe(
        "Accepted password for root",
      );

    expect(result.entry.raw)
      .toBe(log);

    expect(result.entry.timestamp)
      .toBeInstanceOf(Date);
  });
});
