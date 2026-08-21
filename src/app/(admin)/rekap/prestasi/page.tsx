import prisma from "@/lib/prisma";
import RekapFilter from "@/components/RekapFilter";

export default async function RekapPrestasiPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const kelasId = resolvedParams.kelasId as string | undefined;
  const bulanParam = resolvedParams.bulan as string | undefined;
  const tahunParam = resolvedParams.tahun as string | undefined;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const bulan = bulanParam ? parseInt(bulanParam) : currentMonth;
  const tahun = tahunParam ? parseInt(tahunParam) : currentYear;

  const startDate = new Date(tahun, bulan, 1);
  const endDate = new Date(tahun, bulan + 1, 0, 23, 59, 59, 999);

  const filter: any = {
    tanggal: {
      gte: startDate,
      lte: endDate,
    },
  };

  if (kelasId) {
    filter.siswa = { kelasId };
  }

  const prestasiList = await prisma.prestasi.findMany({
    where: filter,
    include: {
      siswa: {
        include: { kelas: true },
      },
    },
    orderBy: { tanggal: "desc" },
  });

  const kelasList = await prisma.kelas.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Rekap Prestasi</h1>

      <RekapFilter kelasList={kelasList} />

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Total Prestasi: {prestasiList.length}</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 font-semibold text-slate-600">Tanggal</th>
              <th className="p-4 font-semibold text-slate-600">Nama Siswa</th>
              <th className="p-4 font-semibold text-slate-600">Prestasi</th>
              <th className="p-4 font-semibold text-slate-600">Keterangan</th>
              <th className="p-4 font-semibold text-slate-600">Poin Plus</th>
            </tr>
          </thead>
          <tbody>
            {prestasiList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">
                  Tidak ada data untuk periode ini.
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


