import prisma from "@/lib/prisma";
import { saveTimezone } from "./actions";
import { Clock } from "lucide-react";

export default async function PengaturanWaktuPage() {
  const setting = await prisma.setting.findUnique({ where: { key: "timezone_offset" } });
  const currentOffset = setting ? parseInt(setting.value) : 7;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Pengaturan Waktu</h1>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-xl">
        <div className="flex items-center gap-3 mb-6 text-indigo-600">
          <Clock size={24} />
          <h2 className="text-xl font-semibold text-slate-800">Pilih Zona Waktu</h2>
        </div>
        
        <p className="text-slate-500 mb-6">
          Pilih zona waktu yang sesuai dengan lokasi sekolah Anda. Semua pengaturan tanggal dan jam di aplikasi (termasuk absensi dan pelanggaran) akan otomatis mengikuti zona waktu ini.
        </p>

        <form action={saveTimezone} className="space-y-6">
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
              <input type="radio" name="offset" value="7" defaultChecked={currentOffset === 7} className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="font-semibold text-slate-800">WIB (Waktu Indonesia Barat)</div>
                <div className="text-sm text-slate-500">UTC+07:00 (Sumatera, Jawa, Kalbar, Kalteng)</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
              <input type="radio" name="offset" value="8" defaultChecked={currentOffset === 8} className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="font-semibold text-slate-800">WITA (Waktu Indonesia Tengah)</div>
                <div className="text-sm text-slate-500">UTC+08:00 (Kalsel, Kaltim, Kaltara, Sulawesi, Bali, Nusa Tenggara)</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50">
              <input type="radio" name="offset" value="9" defaultChecked={currentOffset === 9} className="w-5 h-5 text-indigo-600" />
              <div>
                <div className="font-semibold text-slate-800">WIT (Waktu Indonesia Timur)</div>
                <div className="text-sm text-slate-500">UTC+09:00 (Maluku, Papua)</div>
              </div>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Simpan Pengaturan Waktu
          </button>
        </form>
      </div>
    </div>
  );
}
