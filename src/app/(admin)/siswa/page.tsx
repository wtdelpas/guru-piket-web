import prisma from "@/lib/prisma";
import SiswaClient from "./SiswaClient";

export default async function SiswaPage() {
  const siswaList = await prisma.siswa.findMany({
    include: { kelas: true },
    orderBy: { nama: "asc" },
  });

  const kelasList = await prisma.kelas.findMany({
    orderBy: { nama: "asc" },
  });

  return <SiswaClient initialSiswa={siswaList} kelasList={kelasList} />;
}
