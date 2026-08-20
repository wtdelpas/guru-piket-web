"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createJenisPrestasi(formData: FormData) {
  const deskripsi = formData.get("deskripsi") as string;
  const poin = parseInt(formData.get("poin") as string);

  await prisma.aturanPrestasi.create({
    data: { deskripsi, poin },
  });
  revalidatePath("/jenis-prestasi");
}

export async function deleteJenisPrestasi(id: string) {
  await prisma.aturanPrestasi.delete({
    where: { id },
  });
  revalidatePath("/jenis-prestasi");
}
