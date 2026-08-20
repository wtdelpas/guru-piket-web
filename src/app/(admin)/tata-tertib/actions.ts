"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTataTertib(formData: FormData) {
  const deskripsi = formData.get("deskripsi") as string;
  const poin = parseInt(formData.get("poin") as string);

  await prisma.aturanTataTertib.create({
    data: { deskripsi, poin },
  });
  revalidatePath("/tata-tertib");
}

export async function deleteTataTertib(id: string) {
  await prisma.aturanTataTertib.delete({
    where: { id },
  });
  revalidatePath("/tata-tertib");
}
