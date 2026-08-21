import prisma from "@/lib/prisma";
import { createJenisPrestasi, deleteJenisPrestasi } from "./actions";
import { Trash2 } from "lucide-react";

export default async function JenisPrestasiPage() {
  const prestasiList = await prisma.aturanPrestasi.findMany({
    orderBy: { deskripsi: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Data Jenis Prestasi</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-green-600">Tambah Jenis Prestasi & Konsekuensi Poin Plus</h2>
        <form action={createJenisPrestasi} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Prestasi</label>
            <input
              type="text"
              name="deskripsi"
              required
              placeholder="Contoh: Juara 1 Olimpiade Matematika, Hafal 1 Juz..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Poin Plus (Pengurang Minus)</label>
            <input
              type="number"
              name="poin"
              required
              min="1"
              placeholder="Misal: 50"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors h-10"
          >
            Simpan Prestasi
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 font-semibold text-slate-600 w-16">No</th>
              <th className="p-4 font-semibold text-slate-600">Jenis Prestasi</th>
              <th className="p-4 font-semibold text-slate-600">Konsekuensi (Poin Plus)</th>
              <th className="p-4 font-semibold text-slate-600 w-24 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {prestasiList.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">
                  Belum ada master jenis prestasi.
                </td>
              </tr>
            ) : (
              prestasiList.map((item: any, idx: number) => (
                <tr key={item.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50">
                  <td className="p-4 text-slate-600">{idx + 1}</td>
                  <td className="p-4 font-medium text-slate-800">{item.deskripsi}</td>
                  <td className="p-4 text-green-600 font-bold">+{item.poin}</td>
                  <td className="p-4 text-right">
                    <form action={async () => {
                      "use server";
                      await deleteJenisPrestasi(item.id);
                    }}>
                      <button
                        type="submit"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
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


