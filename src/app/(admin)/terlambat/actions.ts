"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createKeterlambatan(formData: FormData) {
  const siswaId = formData.get("siswaId") as string;
  const alasan = formData.get("alasan") as string;

  if (!siswaId) return;

  try {
    const setting = await prisma.setting.findUnique({ where: { key: "poin_terlambat" } });
    const poin = setting ? parseInt(setting.value) : 5;

    await prisma.keterlambatan.create({
      data: {
        siswaId,
        alasan,
        poin,
      },
    });
    
    // Kurangi poin siswa karena terlambat
    await prisma.siswa.update({
      where: { id: siswaId },
      data: { totalPoin: { decrement: poin } },
    });

    revalidatePath("/terlambat");
    revalidatePath("/siswa");
  } catch (error) {
    console.error("Failed to create keterlambatan", error);
  }
}

export async function deleteKeterlambatan(id: string, siswaId: string, poin: number) {
  await prisma.keterlambatan.delete({
    where: { id },
  });

  // Revert poin
  await prisma.siswa.update({
    where: { id: siswaId },
    data: { totalPoin: { increment: poin } },
  });

  revalidatePath("/terlambat");
  revalidatePath("/siswa");
}

export async function updatePoinTerlambat(formData: FormData) {
  const poin = formData.get("poin") as string;
  if (!poin) return;

  await prisma.setting.upsert({
    where: { key: "poin_terlambat" },
    update: { value: poin },
    create: { key: "poin_terlambat", value: poin },
  });

  revalidatePath("/terlambat");
}
