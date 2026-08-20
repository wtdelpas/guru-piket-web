"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function RekapFilter({ kelasList }: { kelasList: { id: string, nama: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [kelasId, setKelasId] = useState(searchParams.get("kelasId") || "");
  const [bulan, setBulan] = useState(searchParams.get("bulan") || new Date().getMonth().toString());
  const [tahun, setTahun] = useState(searchParams.get("tahun") || new Date().getFullYear().toString());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const handleFilter = () => {
    const params = new URLSearchParams();
    if (kelasId) params.set("kelasId", kelasId);
    if (bulan) params.set("bulan", bulan);
    if (tahun) params.set("tahun", tahun);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex gap-4 items-end flex-wrap">
      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-slate-700 mb-1">Kelas</label>
        <select 
          value={kelasId} 
          onChange={e => setKelasId(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Semua Kelas</option>
          {kelasList.map(k => (
            <option key={k.id} value={k.id}>{k.nama}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-slate-700 mb-1">Bulan</label>
        <select 
          value={bulan} 
          onChange={e => setBulan(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {months.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[150px]">
        <label className="block text-sm font-medium text-slate-700 mb-1">Tahun</label>
        <select 
          value={tahun} 
          onChange={e => setTahun(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {years.map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleFilter}
        className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors h-[42px]"
      >
        Filter
      </button>
    </div>
  );
}
