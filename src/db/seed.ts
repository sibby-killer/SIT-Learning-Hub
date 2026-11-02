import { getDb } from "./client";
import { systemSettings } from "./schema";

const settings = [
  { key: "platform.name", value: "SIT Learning Hub" },
  { key: "platform.phase", value: "1" },
  { key: "platform.content_status", value: "draft" },
  { key: "platform.curriculum_verified", value: "false" },
  { key: "platform.exam_bank_status", value: "unavailable" },
];

async function seed() {
  const db = getDb();

  for (const setting of settings) {
    await db
      .insert(systemSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: { value: setting.value, updatedAt: new Date() },
      });
  }

  console.log(`Seeded ${settings.length} system settings.`);
}

seed().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
