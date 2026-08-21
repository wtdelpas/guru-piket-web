import prisma from "@/lib/prisma";
import PengaturanWaktuForm from "./PengaturanWaktuForm";
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

        <PengaturanWaktuForm currentOffset={currentOffset} />
      </div>
    </div>
  );
}

