"use client";

import { useState } from "react";
import { saveTimezone } from "./actions";

export default function PengaturanWaktuForm({ currentOffset }: { currentOffset: number }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  async function handleSave(formData: FormData) {
    setIsSaving(true);
    setIsSaved(false);
    await saveTimezone(formData);
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  }

  return (
    <form action={handleSave} className="space-y-6">
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
        disabled={isSaving}
        className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSaving ? "Menyimpan..." : isSaved ? "Berhasil Disimpan!" : "Simpan Pengaturan Waktu"}
      </button>
    </form>
  );
}
