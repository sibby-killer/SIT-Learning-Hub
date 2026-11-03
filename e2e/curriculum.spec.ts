import { expect, test } from "@playwright/test";

const hasCurriculumDatabase = Boolean(process.env.TURSO_DATABASE_URL);

test.describe("curriculum admin preview", () => {
  test.describe.configure({ timeout: 90_000 });

  test.skip(
    !hasCurriculumDatabase,
    "Requires a migrated and seeded TURSO_DATABASE_URL.",
  );

  test("shows seeded MMUST records without exposing published units", async ({
    page,
  }) => {
    await page.goto("/admin/curriculum");

    await expect(
      page.getByRole("heading", { level: 1, name: "Curriculum" }),
    ).toBeVisible();
    await expect(page.getByText("Preview mode")).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Masinde Muliro University of Science and Technology",
      }),
    ).toBeVisible();
    await expect(
      page.getByText("BIT 111 · Discrete Structures for IT", { exact: true }),
    ).toBeVisible();

    await page.goto("/learning");
    await expect(page.getByText(/catalog is empty/i)).toBeVisible();
    await expect(page.getByText("BIT 111 · Discrete Structures for IT")).toHaveCount(0);
  });

  test("unit editor shows publication blockers", async ({ page }) => {
    await page.goto("/admin/curriculum/units/unit_bit_111");

    await expect(
      page.getByRole("heading", { level: 1, name: /BIT 111/i }),
    ).toBeVisible();
    await expect(page.getByText("Publish requirements not met")).toBeVisible();
    await expect(page.getByText(/Add at least one measurable learning outcome/i)).toBeVisible();
  });
});
