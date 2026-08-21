import Link from "next/link";
import { Users, ShieldAlert, HeartHandshake, School, Award, LogIn, Clock, AlertTriangle } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function PublicDashboard() {
  const totalSiswa = await prisma.siswa.count();
  const totalKelas = await prisma.kelas.count();
  
  const totalTerlambat = await prisma.keterlambatan.count();
  const totalPelanggaran = await prisma.pelanggaran.count();
  const layananSelesai = totalTerlambat + totalPelanggaran;

  // Waktu bulan ini
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const siswaWithStats = await prisma.siswa.findMany({
    include: {
      kelas: true,
      keterlambatan: {
        where: { tanggal: { gte: startOfMonth, lte: endOfMonth } }
      },
      pelanggaran: {
        where: { tanggal: { gte: startOfMonth, lte: endOfMonth } }
      },
      prestasi: {
        where: { tanggal: { gte: startOfMonth, lte: endOfMonth } }
      }
    }
  });

  const siswaData = siswaWithStats.map(s => {
    const poinKeterlambatan = s.keterlambatan.reduce((sum, k) => sum + k.poin, 0);
    const poinPelanggaran = s.pelanggaran.reduce((sum, p) => sum + p.poin, 0);
    const poinPrestasi = s.prestasi.reduce((sum, p) => sum + p.poin, 0);
    const poinMelanggar = poinKeterlambatan + poinPelanggaran;
    const jumlahKeterlambatan = s.keterlambatan.length;

    return {
      ...s,
      poinKeterlambatan,
      poinPelanggaran,
      poinPrestasi,
      poinMelanggar,
      jumlahKeterlambatan
    };
  });

  const siswaPrestasiList = [...siswaData].sort((a, b) => b.poinPrestasi - a.poinPrestasi);
  const siswaMelanggarList = [...siswaData].sort((a, b) => b.poinMelanggar - a.poinMelanggar);

  const topSiswaPrestasi = siswaPrestasiList.length > 0 ? siswaPrestasiList[0] : null;
  const topSiswaMelanggar = siswaMelanggarList.length > 0 ? siswaMelanggarList[0] : null;

  const kelasDataMap: Record<string, any> = {};
  siswaData.forEach(s => {
    const kId = s.kelasId;
    if (!kelasDataMap[kId]) {
      kelasDataMap[kId] = {
        id: s.kelasId,
        nama: s.kelas.nama,
        poinPrestasi: 0,
        poinMelanggar: 0,
        jumlahKeterlambatan: 0,
        jumlahSiswaTelat: 0
      };
    }
    kelasDataMap[kId].poinPrestasi += s.poinPrestasi;
    kelasDataMap[kId].poinMelanggar += s.poinMelanggar;
    kelasDataMap[kId].jumlahKeterlambatan += s.jumlahKeterlambatan;
    if (s.jumlahKeterlambatan > 0) {
      kelasDataMap[kId].jumlahSiswaTelat += 1;
    }
  });

  const kelasData = Object.values(kelasDataMap);
  const kelasPrestasiList = [...kelasData].sort((a, b) => b.poinPrestasi - a.poinPrestasi);
  const kelasMelanggarList = [...kelasData].sort((a, b) => b.poinMelanggar - a.poinMelanggar);
  
  const kelasDisiplinWaktuList = [...kelasData].sort((a, b) => {
    if (a.jumlahSiswaTelat !== b.jumlahSiswaTelat) return a.jumlahSiswaTelat - b.jumlahSiswaTelat;
    return a.jumlahKeterlambatan - b.jumlahKeterlambatan;
  });

  const kelasTelatTinggiList = [...kelasData].sort((a, b) => b.jumlahKeterlambatan - a.jumlahKeterlambatan);

  const topKelasPrestasi = kelasPrestasiList.length > 0 ? kelasPrestasiList[0] : null;
  const topKelasMelanggar = kelasMelanggarList.length > 0 ? kelasMelanggarList[0] : null;
  const topKelasDisiplinWaktu = kelasDisiplinWaktuList.length > 0 ? kelasDisiplinWaktuList[0] : null;
  const topKelasTelatTinggi = kelasTelatTinggiList.length > 0 ? kelasTelatTinggiList[0] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-100 py-4 px-4 md:px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-lg md:text-xl tracking-tight">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Users size={20} className="text-indigo-600" />
          </div>
          <span className="hidden md:inline">Sistem Guru Piket</span>
          <span className="md:hidden">SGP</span>
        </div>
        <Link 
          href="/login" 
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition text-sm md:text-base"
        >
          <LogIn size={18} />
          Login <span className="hidden md:inline">Pegawai</span>
        </Link>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 overflow-hidden">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-4 md:mb-6 tracking-tight">
            Portal Layanan Guru Piket
          </h1>
          <p className="text-slate-500 text-base md:text-lg max-w-3xl mx-auto px-2">
            Platform terpadu untuk memantau kedisiplinan, mencatat absensi keterlambatan, serta mendokumentasikan pelanggaran dan prestasi siswa secara tertib dan efisien.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10 md:mb-16">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Users size={32} className="text-blue-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{totalSiswa}</h3>
            <p className="text-slate-500 font-medium">Siswa Terdaftar</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="bg-emerald-50 p-4 rounded-full mb-4">
              <HeartHandshake size={32} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{layananSelesai}</h3>
            <p className="text-slate-500 font-medium">Layanan Selesai</p>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center sm:col-span-2 md:col-span-1">
            <div className="bg-orange-50 p-4 rounded-full mb-4">
              <School size={32} className="text-orange-500" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">{totalKelas}</h3>
            <p className="text-slate-500 font-medium">Kelas Dibina</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">
            Papan Peringkat (Bulan Ini)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* Siswa Berprestasi */}
            <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
              <div className="bg-green-50/50 px-4 py-3 border-b border-green-100 flex items-center gap-2 text-green-700 font-medium text-sm md:text-base">
                <Award size={18} /> Siswa Paling Berprestasi
              </div>
              <div className="p-4 flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold flex items-center justify-center shrink-0">1</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{topSiswaPrestasi?.nama || "-"}</div>
                  <div className="text-xs text-slate-500">{topSiswaPrestasi?.kelas.nama || "-"}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-green-600">{topSiswaPrestasi?.poinPrestasi || 0}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">POIN</div>
                </div>
              </div>
            </div>

            {/* Siswa Melanggar */}
            <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
              <div className="bg-red-50/50 px-4 py-3 border-b border-red-100 flex items-center gap-2 text-red-600 font-medium text-sm md:text-base">
                <ShieldAlert size={18} /> Siswa Paling Banyak Melanggar
              </div>
              <div className="p-4 flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center shrink-0">1</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">{topSiswaMelanggar?.nama || "-"}</div>
                  <div className="text-xs text-slate-500">{topSiswaMelanggar?.kelas.nama || "-"}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-red-600">{(topSiswaMelanggar?.poinMelanggar || 0) > 0 ? `-${topSiswaMelanggar?.poinMelanggar}` : '0'}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">POIN</div>
                </div>
              </div>
            </div>

            {/* Kelas Berprestasi */}
            <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
              <div className="bg-green-50/50 px-4 py-3 border-b border-green-100 flex items-center gap-2 text-green-700 font-medium text-sm md:text-base">
                <Award size={18} /> Kelas Paling Berprestasi
              </div>
              <div className="p-4 flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold flex items-center justify-center shrink-0">1</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">Kelas {topKelasPrestasi?.nama || "-"}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-green-600">{topKelasPrestasi?.poinPrestasi || 0}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">POIN TOTAL</div>
                </div>
              </div>
            </div>

            {/* Kelas Melanggar */}
            <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
              <div className="bg-red-50/50 px-4 py-3 border-b border-red-100 flex items-center gap-2 text-red-600 font-medium text-sm md:text-base">
                <ShieldAlert size={18} /> Kelas Paling Banyak Melanggar
              </div>
              <div className="p-4 flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center shrink-0">1</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">Kelas {topKelasMelanggar?.nama || "-"}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-red-600">{(topKelasMelanggar?.poinMelanggar || 0) > 0 ? `-${topKelasMelanggar?.poinMelanggar}` : '0'}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">POIN TOTAL</div>
                </div>
              </div>
            </div>

            {/* Kelas Paling Disiplin Waktu */}
            <div className="bg-white rounded-xl border border-blue-100 shadow-sm overflow-hidden">
              <div className="bg-blue-50/50 px-4 py-3 border-b border-blue-100 flex items-center gap-2 text-blue-700 font-medium text-sm md:text-base">
                <Clock size={18} /> Kelas Paling Disiplin Waktu
              </div>
              <div className="p-4 flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold flex items-center justify-center shrink-0">1</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">Kelas {topKelasDisiplinWaktu?.nama || "-"}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-blue-600">{topKelasDisiplinWaktu?.jumlahKeterlambatan || 0}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">KASUS TELAT</div>
                </div>
              </div>
            </div>

            {/* Kelas Keterlambatan Tinggi */}
            <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
              <div className="bg-orange-50/50 px-4 py-3 border-b border-orange-100 flex items-center gap-2 text-orange-600 font-medium text-sm md:text-base">
                <AlertTriangle size={18} /> Kelas Keterlambatan Paling Tinggi
              </div>
              <div className="p-4 flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold flex items-center justify-center shrink-0">1</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 truncate">Kelas {topKelasTelatTinggi?.nama || "-"}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-orange-600">{topKelasTelatTinggi?.jumlahKeterlambatan || 0}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">KASUS TELAT</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
