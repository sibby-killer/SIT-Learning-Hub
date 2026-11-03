import { describe, expect, it } from "vitest";

import {
  unitPublicationReadiness,
  wouldCreatePrerequisiteCycle,
} from "./curriculum-rules";

describe("wouldCreatePrerequisiteCycle", () => {
  it("rejects a topic as its own prerequisite", () => {
    expect(wouldCreatePrerequisiteCycle("a", "a", [])).toBe(true);
  });

  it("allows the first prerequisite", () => {
    expect(wouldCreatePrerequisiteCycle("b", "a", [])).toBe(false);
  });

  it("rejects a direct reverse edge", () => {
    expect(
      wouldCreatePrerequisiteCycle("a", "b", [
        { topicId: "b", prerequisiteTopicId: "a" },
      ]),
    ).toBe(true);
  });

  it("rejects an indirect cycle", () => {
    expect(
      wouldCreatePrerequisiteCycle("a", "c", [
        { topicId: "b", prerequisiteTopicId: "a" },
        { topicId: "c", prerequisiteTopicId: "b" },
      ]),
    ).toBe(true);
  });

  it("allows a non-cyclic shortcut", () => {
    expect(
      wouldCreatePrerequisiteCycle("c", "a", [
        { topicId: "b", prerequisiteTopicId: "a" },
        { topicId: "c", prerequisiteTopicId: "b" },
      ]),
    ).toBe(false);
  });
});

describe("unitPublicationReadiness", () => {
  it("requires an outcome, a topic, and verification", () => {
    const result = unitPublicationReadiness({
      outcomeCount: 0,
      topicCount: 0,
      verificationStatus: "unverified",
    });

    expect(result.ready).toBe(false);
    expect(result.reasons).toHaveLength(3);
  });

  it("rejects verified content that still has no outcome or topic", () => {
    const result = unitPublicationReadiness({
      outcomeCount: 0,
      topicCount: 1,
      verificationStatus: "verified",
    });

    expect(result.ready).toBe(false);
    expect(result.reasons).toEqual([
      "Add at least one measurable learning outcome.",
    ]);
  });

  it("passes when the unit is complete and verified", () => {
    expect(
      unitPublicationReadiness({
        outcomeCount: 1,
        topicCount: 1,
        verificationStatus: "verified",
      }),
    ).toEqual({ ready: true, reasons: [] });
  });
});
