import { describe, expect, it } from "vitest";

import { analyze } from "../src/index.js";

describe("analyze()", () => {
  it("should analyze a supported log format", () => {
    const log =
      "Jul 23 18:45:11 ubuntu sshd[1234]: Accepted password for root";

    const result = analyze(log);

    expect(result.ok)
      .toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.entry.source)
      .toBe("linux-syslog");
  });


  it("should reject unknown log formats", () => {
    const log =
      "This is not a supported log format";

    const result = analyze(log);

    expect(result.ok)
      .toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.error)
      .toBe(
        "Unsupported or unknown log format",
      );

    expect(result.raw)
      .toBe(log);
  });


  it("should handle empty logs", () => {
    const log = "";

    const result = analyze(log);

    expect(result.ok)
      .toBe(false);

    if (result.ok) {
      return;
    }

    expect(result.raw)
      .toBe(log);
  });
});
