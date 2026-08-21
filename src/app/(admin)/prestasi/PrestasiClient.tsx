"use client";

import { useState } from "react";
import SearchableSelect from "@/components/SearchableSelect";
import { Plus } from "lucide-react";

export default function PrestasiClient({ 
  defaultWaktu,
  siswaList, 
  aturanList, 
  createAction 
}: { 
  defaultWaktu: string,
  siswaList: any[], 
  aturanList: any[], 
  createAction: (formData: FormData) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mb-6"
      >
        <Plus size={20} />
        Catat Prestasi
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Catat Prestasi Siswa</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2"
              >
                ✕
              </button>
            </div>
            
            <form 
              action={(formData) => {
                createAction(formData);
                setIsOpen(false);
              }} 
              className="p-6 flex flex-col gap-4"
            >
              <div className="flex flex-col gap-4">
                                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal & Waktu</label>
                  <input
                    type="datetime-local"
                    name="waktu"
                    defaultValue={defaultWaktu}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Siswa</label>
                  <SearchableSelect 
                    name="siswaId" 
                    placeholder="-- Cari & Pilih Siswa --"
                    options={siswaList} 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Prestasi (Dari Data Prestasi)</label>
                  <SearchableSelect 
                    name="aturanId" 
                    placeholder="-- Pilih Prestasi --"
                    options={aturanList} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan <span className="text-slate-400 font-normal">(Opsional)</span></label>
                  <input 
                    type="text" 
                    name="keterangan" 
                    placeholder="Detail kejadian / acara..." 
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}


