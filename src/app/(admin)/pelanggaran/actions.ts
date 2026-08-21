"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPelanggaran(formData: FormData) {
  const siswaId = formData.get("siswaId") as string;
  const aturanId = formData.get("aturanId") as string;
  const keterangan = formData.get("keterangan") as string;
  const tindakLanjut = formData.get("tindakLanjut") as string;
  const waktuStr = formData.get("waktu") as string;

  if (!siswaId || !aturanId) return;

  try {
    const aturan = await prisma.aturanTataTertib.findUnique({ where: { id: aturanId } });
    if (!aturan) return;

    await prisma.pelanggaran.create({
      data: {
        siswaId,
        deskripsi: aturan.deskripsi,
        poin: aturan.poin,
        keterangan: keterangan || null,
        tindakLanjut: tindakLanjut || null,
      },
    });
    
    await prisma.siswa.update({
      where: { id: siswaId },
      data: { totalPoin: { decrement: aturan.poin } },
    });

    revalidatePath("/pelanggaran");
    revalidatePath("/siswa");
  } catch (error) {
    console.error("Failed to create pelanggaran", error);
  }
}

export async function deletePelanggaran(id: string, siswaId: string, poin: number) {
  await prisma.pelanggaran.delete({
    where: { id },
  });

  // Revert poin
  await prisma.siswa.update({
    where: { id: siswaId },
    data: { totalPoin: { increment: poin } },
  });

  revalidatePath("/pelanggaran");
  revalidatePath("/siswa");
}

