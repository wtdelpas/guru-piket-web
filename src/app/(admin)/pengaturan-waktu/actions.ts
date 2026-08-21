"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveTimezone(formData: FormData) {
  const offset = formData.get("offset") as string;
  if (!offset) return;

  await prisma.setting.upsert({
    where: { key: "timezone_offset" },
    update: { value: offset },
    create: { key: "timezone_offset", value: offset },
  });

  revalidatePath("/", "layout");
}
