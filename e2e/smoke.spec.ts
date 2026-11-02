import { expect, test } from "@playwright/test";

test("public landing page renders", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /learning hub that has to prove it works/i,
    }),
  ).toBeVisible();
  await expect(page.getByText("Foundation checklist")).toBeVisible();
});

test("health endpoint reports a safe status", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  const body = (await response.json()) as {
    status: string;
    checks: Record<string, string>;
  };

  expect(body.status).toBe("ok");
  expect(body.checks.app).toBe("ok");
  expect(JSON.stringify(body)).not.toContain("TURSO_AUTH_TOKEN");
  expect(JSON.stringify(body)).not.toContain("GROQ_API_KEY");
});
