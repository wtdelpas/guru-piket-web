import prisma from "@/lib/prisma";
import { createPrestasi, deletePrestasi } from "./actions";
import { Trash2 } from "lucide-react";
import PrestasiClient from "./PrestasiClient";
import { getDefaultDateTimeLocal, getTimezoneOffset, formatDateSync } from "@/lib/timezone";

export default async function PrestasiPage() {
  const prestasiList = await prisma.prestasi.findMany({
    include: {
      siswa: {
        include: { kelas: true },
      },
    },
    orderBy: { tanggal: "desc" },
  });

  const siswaList = await prisma.siswa.findMany({
    include: { kelas: true },
    orderBy: { nama: "asc" },
  });

  const aturanList = await prisma.aturanPrestasi.findMany({
    orderBy: { deskripsi: "asc" },
  });
  
  const defaultWaktu = await getDefaultDateTimeLocal();
  const tzOffset = await getTimezoneOffset();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Catatan Prestasi</h1>

      <PrestasiClient 
        defaultWaktu={defaultWaktu}
        siswaList={siswaList.map(s => ({ value: s.id, label: `${s.nis} - ${s.nama} (${s.kelas.nama})` }))}
        aturanList={aturanList.map(a => ({ value: a.id, label: `${a.deskripsi} (+${a.poin} Poin)` }))}
        createAction={createPrestasi}
      />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 font-semibold text-slate-600">Tanggal</th>
              <th className="p-4 font-semibold text-slate-600">Nama Siswa</th>
              <th className="p-4 font-semibold text-slate-600">Prestasi</th>
              <th className="p-4 font-semibold text-slate-600">Keterangan</th>
              <th className="p-4 font-semibold text-slate-600">Poin Plus</th>
              <th className="p-4 font-semibold text-slate-600 w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {prestasiList.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  Belum ada catatan prestasi.
                </td>
              </tr>
            ) : (
              prestasiList.map((item: any) => (
                <tr key={item.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50">
                  <td className="p-4 text-slate-600">
                    {formatDateSync(item.tanggal, tzOffset)}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{item.siswa.nama}</div>
                    <div className="text-xs text-slate-500">{item.siswa.kelas.nama}</div>
                  </td>
                  <td className="p-4 text-slate-600">{item.deskripsi}</td>
                  <td className="p-4 text-sm text-slate-600">
                    {item.keterangan || <span className="text-slate-400">-</span>}
                  </td>
                  <td className="p-4 text-green-600 font-medium">+{item.poin}</td>
                  <td className="p-4">
                    <form action={async () => {
                      "use server";
                      await deletePrestasi(item.id, item.siswaId, item.poin);
                    }}>
                      <button
                        type="submit"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}





