"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSiswa(formData: FormData) {
  const nis = formData.get("nis") as string;
  const nama = formData.get("nama") as string;
  const kelasNama = formData.get("kelasNama") as string;

  if (!nis || !nama || !kelasNama) return;

  try {
    // Cari kelas atau buat baru
    let kelas = await prisma.kelas.findFirst({
      where: { nama: kelasNama }
    });

    if (!kelas) {
      kelas = await prisma.kelas.create({
        data: { nama: kelasNama }
      });
    }

    await prisma.siswa.create({
      data: {
        nis,
        nama,
        kelasId: kelas.id,
      },
    });
    revalidatePath("/siswa");
  } catch (error) {
    console.error("Failed to create siswa", error);
    throw new Error("Gagal menambahkan siswa. Mungkin NIS sudah ada.");
  }
}

export async function deleteSiswa(id: string) {
  await prisma.siswa.delete({
    where: { id },
  });
  revalidatePath("/siswa");
  revalidatePath("/");
}

export async function deleteAllSiswa() {
  await prisma.siswa.deleteMany({});
  revalidatePath("/siswa");
  revalidatePath("/");
}

export async function updateSiswa(id: string, formData: FormData) {
  const nis = formData.get("nis") as string;
  const nama = formData.get("nama") as string;
  const kelasNama = formData.get("kelasNama") as string;

  if (!id || !nis || !nama || !kelasNama) return;

  try {
    let kelas = await prisma.kelas.findFirst({
      where: { nama: kelasNama }
    });

    if (!kelas) {
      kelas = await prisma.kelas.create({
        data: { nama: kelasNama }
      });
    }

    await prisma.siswa.update({
      where: { id },
      data: {
        nis,
        nama,
        kelasId: kelas.id,
      },
    });
    revalidatePath("/siswa");
  } catch (error) {
    console.error("Failed to update siswa", error);
    throw new Error("Gagal mengupdate siswa.");
  }
}

export async function moveSiswaClass(siswaIds: string[], kelasId: string) {
  if (!siswaIds.length || !kelasId) return;

  try {
    await prisma.siswa.updateMany({
      where: {
        id: { in: siswaIds }
      },
      data: {
        kelasId
      }
    });
    revalidatePath("/siswa");
  } catch (error) {
    console.error("Failed to move siswa", error);
    throw new Error("Gagal memindahkan siswa.");
  }
}

export async function importSiswaBatch(data: { nis: string; nama: string; kelasNama: string }[]) {
  try {
    // Cari semua kelas yang ada
    const kelasList = await prisma.kelas.findMany();
    const kelasMap = new Map(kelasList.map(k => [k.nama.toLowerCase(), k.id]));

    let createdCount = 0;

    for (const item of data) {
      if (!item.nis || !item.nama || !item.kelasNama) continue;
      
      let kelasId = kelasMap.get(item.kelasNama.toLowerCase());
      
      // Jika kelas belum ada, buat otomatis (opsional) atau lewati.
      // Di sini kita buat otomatis jika tidak ada
      if (!kelasId) {
        const newKelas = await prisma.kelas.create({
          data: { nama: item.kelasNama }
        });
        kelasId = newKelas.id;
        kelasMap.set(item.kelasNama.toLowerCase(), kelasId);
      }

      // Upsert siswa based on NIS
      await prisma.siswa.upsert({
        where: { nis: item.nis.toString() },
        update: {
          nama: item.nama,
          kelasId: kelasId,
        },
        create: {
          nis: item.nis.toString(),
          nama: item.nama,
          kelasId: kelasId,
        }
      });
      createdCount++;
    }

    revalidatePath("/siswa");
    revalidatePath("/kelas");
    return createdCount;
  } catch (error) {
    console.error("Failed to import siswa", error);
    throw new Error("Gagal import data siswa.");
  }
}
