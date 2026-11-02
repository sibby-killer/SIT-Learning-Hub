import { describe, expect, it } from "vitest";

import { assertPermission, hasPermission } from "./permissions";

describe("role permissions", () => {
  it("allows students only into the student area", () => {
    expect(hasPermission("student", "view_student_area")).toBe(true);
    expect(hasPermission("student", "view_admin_area")).toBe(false);
    expect(hasPermission("student", "manage_users")).toBe(false);
  });

  it("allows reviewers to review exams but not manage users", () => {
    expect(hasPermission("reviewer", "view_admin_area")).toBe(true);
    expect(hasPermission("reviewer", "review_exams")).toBe(true);
    expect(hasPermission("reviewer", "manage_users")).toBe(false);
  });

  it("allows administrators every permission", () => {
    expect(hasPermission("admin", "manage_users")).toBe(true);
    expect(hasPermission("admin", "manage_curriculum")).toBe(true);
    expect(hasPermission("admin", "manage_settings")).toBe(true);
  });

  it("throws when a permission is missing", () => {
    expect(() => assertPermission("student", "manage_users")).toThrow(
      /not allowed/,
    );
  });
});
