import prisma from "@/lib/prisma";
import { createKeterlambatan, deleteKeterlambatan, updatePoinTerlambat } from "./actions";
import { getDefaultDateTimeLocal, getTimezoneOffset, formatDateSync } from "@/lib/timezone";
import { Trash2, Settings } from "lucide-react";
import SearchableSelect from "@/components/SearchableSelect";

export default async function TerlambatPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const terlambatList = await prisma.keterlambatan.findMany({
    where: {
      tanggal: {
        gte: today,
      },
    },
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

  const setting = await prisma.setting.findUnique({ where: { key: "poin_terlambat" } });
  const poinTerlambat = setting ? parseInt(setting.value) : 5;
  const defaultWaktu = await getDefaultDateTimeLocal();
  const tzOffset = await getTimezoneOffset();

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Absen Terlambat Hari Ini</h1>
        
        <form action={updatePoinTerlambat} className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
          <Settings size={18} className="text-slate-400 ml-2" />
          <span className="text-sm font-medium text-slate-600">Poin Keterlambatan:</span>
          <input 
            type="number" 
            name="poin" 
            defaultValue={poinTerlambat} 
            className="w-16 px-2 py-1 border border-slate-200 rounded text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button type="submit" className="text-xs bg-slate-100 px-2 py-1.5 rounded text-slate-600 hover:bg-slate-200 font-medium">Ubah</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-8">
        <h2 className="text-lg font-semibold mb-4 text-orange-600">Catat Siswa Terlambat (-{poinTerlambat} Poin)</h2>
        <form action={createKeterlambatan} className="flex gap-4 items-end flex-wrap">
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Siswa</label>
            <SearchableSelect 
              name="siswaId" 
              placeholder="-- Cari & Pilih Siswa --"
              options={siswaList.map(s => ({
                value: s.id,
                label: `${s.nis} - ${s.nama} (${s.kelas.nama})`
              }))} 
            />
          </div>
                    <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal & Waktu</label>
            <input
              type="datetime-local"
              name="waktu"
              defaultValue={defaultWaktu}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <input
              type="text"
              name="alasan"
              placeholder="Contoh: Macet, Bangun Kesiangan"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors h-10"
          >
            Catat
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 font-semibold text-slate-600">Jam</th>
              <th className="p-4 font-semibold text-slate-600">Nama Siswa</th>
              <th className="p-4 font-semibold text-slate-600">Kelas</th>
              <th className="p-4 font-semibold text-slate-600">Alasan</th>
              <th className="p-4 font-semibold text-slate-600">Poin Minus</th>
              <th className="p-4 font-semibold text-slate-600 w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {terlambatList.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  Belum ada siswa yang terlambat hari ini. Bagus!
                </td>
              </tr>
            ) : (
              terlambatList.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 last:border-b-0 hover:bg-slate-50">
                  <td className="p-4 text-slate-600">
                    {formatDateSync(item.tanggal, tzOffset)}
                  </td>
                  <td className="p-4 font-medium text-slate-800">{item.siswa.nama}</td>
                  <td className="p-4 text-slate-600">{item.siswa.kelas.nama}</td>
                  <td className="p-4 text-slate-600">{item.alasan || '-'}</td>
                  <td className="p-4 text-red-600 font-medium">-{item.poin}</td>
                  <td className="p-4">
                    <form action={async () => {
                      "use server";
                      await deleteKeterlambatan(item.id, item.siswaId, item.poin);
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




