import { describe, expect, it } from "vitest";

import { cn } from "./utils";

describe("cn", () => {
  it("merges conflicting Tailwind utilities", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("keeps non-conflicting classes", () => {
    expect(cn("font-medium", "text-sm")).toBe("font-medium text-sm");
  });

  it("supports conditional values", () => {
    expect(cn("text-sm", false && "hidden", "font-medium")).toBe(
      "text-sm font-medium",
    );
  });
});
