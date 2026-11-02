import { describe, expect, it } from "vitest";

import { getSetupStatus } from "./setup";

describe("getSetupStatus", () => {
  it("reports every required setup item without exposing values", () => {
    const status = getSetupStatus();

    expect(status.items.map((item) => item.key)).toEqual([
      "database",
      "clerk",
      "groq",
      "admin",
    ]);
    expect(status.totalCount).toBe(4);
    expect(status.configuredCount).toBeGreaterThanOrEqual(0);
    expect(status.configuredCount).toBeLessThanOrEqual(status.totalCount);
    expect(status.appUrl).toMatch(/^https?:\/\//);
  });

  it("never places configuration values in the details", () => {
    const status = getSetupStatus();
    const serialized = JSON.stringify(status);

    expect(serialized).not.toContain("TURSO_AUTH_TOKEN=");
    expect(serialized).not.toContain("CLERK_SECRET_KEY=");
    expect(serialized).not.toContain("GROQ_API_KEY=");
  });
});
