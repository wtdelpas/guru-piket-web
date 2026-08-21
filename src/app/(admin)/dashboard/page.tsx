import prisma from "@/lib/prisma";
import { Users, AlertTriangle, Clock, Trophy } from "lucide-react";
import { getTimezoneOffset, formatDateSync } from "@/lib/timezone";

export default async function Dashboard() {
  const totalSiswa = await prisma.siswa.count();
  const totalKelas = await prisma.kelas.count();
  
  // Get today's stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const terlambatHariIni = await prisma.keterlambatan.count({
    where: {
      tanggal: {
        gte: today,
      },
    },
  });

  const pelanggaranHariIni = await prisma.pelanggaran.count({
    where: {
      tanggal: {
        gte: today,
      },
    },
  });

  const recentTerlambat = await prisma.keterlambatan.findMany({ take: 3, orderBy: { tanggal: 'desc' }, include: { siswa: { include: { kelas: true } } } });
  const recentPelanggaran = await prisma.pelanggaran.findMany({ take: 3, orderBy: { tanggal: 'desc' }, include: { siswa: { include: { kelas: true } } } });
  const recentPrestasi = await prisma.prestasi.findMany({ take: 3, orderBy: { tanggal: 'desc' }, include: { siswa: { include: { kelas: true } } } });

  const allRecent = [
    ...recentTerlambat.map(t => ({ ...t, type: 'Terlambat' })),
    ...recentPelanggaran.map(p => ({ ...p, type: 'Pelanggaran' })),
    ...recentPrestasi.map(p => ({ ...p, type: 'Prestasi' }))
  ].sort((a, b) => b.tanggal.getTime() - a.tanggal.getTime()).slice(0, 5);

  const recentActivities = allRecent;
  const tzOffset = await getTimezoneOffset();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Siswa</p>
            <p className="text-2xl font-bold text-slate-800">{totalSiswa}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Terlambat Hari Ini</p>
            <p className="text-2xl font-bold text-slate-800">{terlambatHariIni}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pelanggaran Hari Ini</p>
            <p className="text-2xl font-bold text-slate-800">{pelanggaranHariIni}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Kelas</p>
            <p className="text-2xl font-bold text-slate-800">{totalKelas}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Aktivitas Terbaru</h2>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-slate-500 text-sm">Belum ada aktivitas yang tercatat.</p>
            ) : (
              recentActivities.map((act: any, idx: number) => (
                <div key={idx} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className={`p-2 rounded-full ${
                    act.type === 'Terlambat' ? 'bg-orange-100 text-orange-600' :
                    act.type === 'Pelanggaran' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {act.type === 'Terlambat' ? <Clock size={16} /> :
                     act.type === 'Pelanggaran' ? <AlertTriangle size={16} /> : <Trophy size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {act.siswa.nama} <span className="text-slate-500 font-normal">({act.siswa.kelas.nama})</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {act.type === 'Terlambat' ? `Terlambat: ${act.alasan || '-'}` :
                       act.type === 'Pelanggaran' ? `Pelanggaran: ${act.deskripsi} (-${act.poin} Poin)` : 
                       `Prestasi: ${act.deskripsi} (+${act.poin} Poin)`}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDateSync(act.tanggal, tzOffset)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

