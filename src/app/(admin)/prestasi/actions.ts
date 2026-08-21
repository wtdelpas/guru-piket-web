"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { parseTimezoneDate } from "@/lib/timezone";

export async function createPrestasi(formData: FormData) {
  const siswaId = formData.get("siswaId") as string;
  const aturanId = formData.get("aturanId") as string;
  const keterangan = formData.get("keterangan") as string;
  const waktuStr = formData.get("waktu") as string;

  if (!siswaId || !aturanId) return;

  try {
    const aturan = await prisma.aturanPrestasi.findUnique({ where: { id: aturanId } });
    if (!aturan) return;

    await prisma.prestasi.create({
      data: {
        siswaId,
        deskripsi: aturan.deskripsi,
        poin: aturan.poin,
        keterangan: keterangan || null,
      },
    });
    
    await prisma.siswa.update({
      where: { id: siswaId },
      data: { totalPoin: { increment: aturan.poin } },
    });

    revalidatePath("/prestasi");
    revalidatePath("/siswa");
  } catch (error) {
    console.error("Failed to create prestasi", error);
  }
}

export async function deletePrestasi(id: string, siswaId: string, poin: number) {
  await prisma.prestasi.delete({
    where: { id },
  });

  // Revert poin
  await prisma.siswa.update({
    where: { id: siswaId },
    data: { totalPoin: { decrement: poin } },
  });

  revalidatePath("/prestasi");
  revalidatePath("/siswa");
}


