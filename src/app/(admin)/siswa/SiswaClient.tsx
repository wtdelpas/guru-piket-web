"use client";

import { useState, useRef } from "react";
import { createSiswa, deleteSiswa, moveSiswaClass, importSiswaBatch, deleteAllSiswa, updateSiswa } from "./actions";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Trash2, Edit, ArrowRightLeft, FileSpreadsheet, Download, FileUp, Plus } from "lucide-react";
import * as XLSX from "xlsx";

type Kelas = { id: string; nama: string };
type Siswa = { id: string; nis: string; nama: string; kelasId: string; totalPoin: number; kelas: Kelas };

export default function SiswaClient({ initialSiswa, kelasList }: { initialSiswa: Siswa[], kelasList: Kelas[] }) {
  const [siswaList, setSiswaList] = useState(initialSiswa);
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<Siswa | null>(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter & Search
  const filteredSiswa = siswaList.filter(s => {
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nis.toLowerCase().includes(search.toLowerCase());
    const matchKelas = filterKelas === "all" || s.kelasId === filterKelas;
    return matchSearch && matchKelas;
  });

  // Checkbox handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSiswa.length && filteredSiswa.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSiswa.map(s => s.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  // Actions
  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([{ NISN: "", Nama: "", Kelas: "" }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Siswa");
    XLSX.writeFile(wb, "Template_Siswa.xlsx");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];

        const formattedData = data.map(row => ({
          nis: String(row.NISN || row.NIS || ""),
          nama: String(row.Nama || row.NAMA || ""),
          kelasNama: String(row.Kelas || row.KELAS || "")
        })).filter(item => item.nis && item.nama && item.kelasNama);

        if (formattedData.length === 0) {
          alert("Data kosong atau format salah. Pastikan ada kolom NISN, Nama, dan Kelas.");
          return;
        }

        await importSiswaBatch(formattedData);
        alert(`Berhasil import ${formattedData.length} siswa! (Silakan refresh halaman jika data belum muncul)`);
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("Gagal mengimport data.");
      } finally {
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleMoveClass = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const targetKelas = formData.get("targetKelas") as string;
    
    if (!targetKelas || selectedIds.size === 0) return;
    
    setIsLoading(true);
    try {
      await moveSiswaClass(Array.from(selectedIds), targetKelas);
      alert("Berhasil memindahkan siswa.");
      window.location.reload();
    } catch (error) {
      alert("Gagal memindahkan siswa.");
    } finally {
      setIsLoading(false);
      setIsMoveModalOpen(false);
      setSelectedIds(new Set());
    }
  };

  const handleAddSiswa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createSiswa(new FormData(e.currentTarget));
      alert("Berhasil menambah siswa.");
      window.location.reload();
    } catch (error) {
      alert("Gagal menambah siswa (mungkin NISN sudah ada).");
    } finally {
      setIsLoading(false);
      setIsAddModalOpen(false);
    }
  };



  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editData) return;
    setIsLoading(true);
    try {
      await updateSiswa(editData.id, new FormData(e.currentTarget));
      alert("Berhasil mengupdate siswa.");
      window.location.reload();
    } catch (error) {
      alert("Gagal mengupdate siswa.");
    } finally {
      setIsLoading(false);
      setIsEditModalOpen(false);
      setEditData(null);
    }
  };

  const handleDeleteAll = async () => {
    setIsLoading(true);
    try {
      await deleteAllSiswa();
      alert("Semua data siswa beserta catatan terkait berhasil dihapus.");
      window.location.reload();
    } catch (error) {
      alert("Gagal menghapus data.");
    } finally {
      setIsLoading(false);
      setIsDeleteAllModalOpen(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Data Siswa', {
        pageSetup: { paperSize: 9, orientation: 'portrait' }
      });

      // Header Kop
      worksheet.mergeCells('A1:D1');
      const kopCell = worksheet.getCell('A1');
      kopCell.value = 'DATA SISWA TAHUN AJARAN 2026/2027';
      kopCell.font = { size: 14, bold: true };
      kopCell.alignment = { vertical: 'middle', horizontal: 'center' };

      worksheet.addRow([]); // Empty row

      // Table Header
      const headerRow = worksheet.addRow(['NO', 'NISN', 'NAMA SISWA', 'KELAS']);
      headerRow.font = { bold: true };
      headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

      // Table Data
      filteredSiswa.forEach((siswa, index) => {
        const row = worksheet.addRow([index + 1, siswa.nis, siswa.nama, siswa.kelas.nama]);
        row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }; // NO
        row.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' }; // NISN
        row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle' }; // NAMA
        row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' }; // KELAS
      });

      // Add borders
      const tableRows = filteredSiswa.length + 1; // data + header row
      for (let i = 0; i < tableRows; i++) {
        const row = worksheet.getRow(3 + i); // Start from row 3
        row.eachCell((cell) => {
          cell.border = {
            top: {style:'thin'},
            left: {style:'thin'},
            bottom: {style:'thin'},
            right: {style:'thin'}
          };
        });
      }

      // Column widths
      worksheet.getColumn(1).width = 5;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 40;
      worksheet.getColumn(4).width = 15;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Data_Siswa.xlsx');
    } catch(err) {
      alert("Gagal membuat excel.");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Data Siswa</h1>
          <p className="text-slate-500">Tahun Ajaran: 2026/2027</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setIsDeleteAllModalOpen(true)} className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition">
            <Trash2 size={16} /> Hapus Semua
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition">
            <Plus size={16} /> Tambah Siswa
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 items-center min-w-[300px]">
          <input
            type="text"
            placeholder="Cari Nama / NISN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">Semua Kelas</option>
            {kelasList.map(k => (
              <option key={k.id} value={k.id}>{k.nama}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition">
            Tampilkan
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDownloadTemplate} className="px-4 py-2 bg-white border border-slate-200 text-green-700 font-medium rounded-lg flex items-center gap-2 hover:bg-slate-50 transition">
            <FileSpreadsheet size={16} /> Template
          </button>
          <input type="file" accept=".xlsx, .xls, .csv" className="hidden" ref={fileInputRef} onChange={handleImport} />
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg flex items-center gap-2 hover:bg-slate-50 transition">
            <FileUp size={16} /> Import
          </button>
          <button onClick={handleExportExcel} className="px-4 py-2 bg-white border border-slate-200 text-green-600 font-medium rounded-lg flex items-center gap-2 hover:bg-slate-50 transition">
            <FileSpreadsheet size={16} /> Excel
          </button>
        </div>
      </div>

      {/* Selection Action Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 flex justify-between items-center">
        <div className="text-slate-600">
          <span className="font-semibold text-slate-800">{selectedIds.size} Siswa Terpilih</span> (Gunakan kotak centang di tabel untuk memilih banyak siswa sekaligus)
        </div>
        <button 
          onClick={() => selectedIds.size > 0 && setIsMoveModalOpen(true)}
          disabled={selectedIds.size === 0}
          className="px-4 py-2 bg-indigo-300 text-indigo-900 font-medium rounded-lg flex items-center gap-2 hover:bg-indigo-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRightLeft size={16} /> Pindah / Naik Kelas Terpilih
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 w-12">
                <input 
                  type="checkbox" 
                  checked={selectedIds.size === filteredSiswa.length && filteredSiswa.length > 0}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
              </th>
              <th className="p-4 font-semibold text-slate-600 text-xs">NO</th>
              <th className="p-4 font-semibold text-slate-600 text-xs">NISN</th>
              <th className="p-4 font-semibold text-slate-600 text-xs">NAMA SISWA</th>
              <th className="p-4 font-semibold text-slate-600 text-xs">KELAS</th>
              <th className="p-4 font-semibold text-slate-600 text-xs text-right">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {filteredSiswa.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-500">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              filteredSiswa.map((siswa, index) => (
                <tr key={siswa.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(siswa.id)}
                      onChange={() => toggleSelect(siswa.id)}
                      className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                    />
                  </td>
                  <td className="p-4 text-slate-600">{index + 1}</td>
                  <td className="p-4 text-slate-600">{siswa.nis}</td>
                  <td className="p-4 font-medium text-slate-800">{siswa.nama}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                      {siswa.kelas.nama}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => { setEditData(siswa); setIsEditModalOpen(true); }} className="p-1.5 text-slate-500 hover:bg-slate-200 border border-slate-200 rounded transition" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => { setSelectedIds(new Set([siswa.id])); setIsMoveModalOpen(true); }} className="p-1.5 text-indigo-500 hover:bg-indigo-100 border border-slate-200 rounded transition" title="Pindah Kelas">
                      <ArrowRightLeft size={16} />
                    </button>
                    <form action={async () => {
                      if(confirm('Yakin hapus siswa ini?')) {
                        await deleteSiswa(siswa.id);
                        window.location.reload();
                      }
                    }}>
                      <button type="submit" className="p-1.5 text-red-500 hover:bg-red-50 border border-slate-200 rounded transition" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Tambah Data Siswa</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleAddSiswa} className="p-4">
              <div className="mb-4">
                <label className="block text-sm text-slate-600 mb-1">NISN</label>
                <input type="text" name="nis" required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-slate-600 mb-1">Nama Siswa</label>
                <input type="text" name="nama" required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-slate-600 mb-1">Kelas</label>
                <input 
                  type="text" 
                  name="kelasNama" 
                  list="kelasList" 
                  required 
                  placeholder="Contoh: 7.1"
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
                <datalist id="kelasList">
                  {kelasList.map(k => <option key={k.id} value={k.nama} />)}
                </datalist>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {/* Edit Modal */}
      {isEditModalOpen && editData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Edit Data Siswa</h2>
              <button onClick={() => {setIsEditModalOpen(false); setEditData(null);}} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm text-slate-600 mb-1">NISN</label>
                <input type="text" name="nis" defaultValue={editData.nis} required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-slate-600 mb-1">Nama Siswa</label>
                <input type="text" name="nama" defaultValue={editData.nama} required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-slate-600 mb-1">Kelas</label>
                <input 
                  type="text" 
                  name="kelasNama" 
                  list="kelasList" 
                  defaultValue={editData.kelas.nama}
                  required 
                  className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => {setIsEditModalOpen(false); setEditData(null);}} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                  {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Move Class Modal */}
      {isMoveModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Pindah / Naik Kelas</h2>
              <button onClick={() => setIsMoveModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleMoveClass} className="p-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm mb-4">
                Menyasar <span className="font-semibold text-slate-800">{selectedIds.size} Siswa</span> Terpilih
              </div>
              <div className="mb-6">
                <label className="block text-sm text-slate-600 mb-1">Pilih Kelas Tujuan</label>
                <select name="targetKelas" required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="">Pilih Kelas...</option>
                  {kelasList.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsMoveModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                  {isLoading ? "Memproses..." : "Proses"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete All Modal */}
      {isDeleteAllModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-red-100 bg-red-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-red-700">Peringatan Penghapusan!</h2>
              <button onClick={() => setIsDeleteAllModalOpen(false)} className="text-red-400 hover:text-red-600">×</button>
            </div>
            <div className="p-4">
              <p className="text-slate-700 mb-4 text-sm leading-relaxed">
                Anda akan menghapus <strong>semua data siswa</strong>. Tindakan ini akan <strong>menghapus secara permanen</strong> data:
              </p>
              <ul className="list-disc pl-5 text-sm text-slate-600 mb-6 space-y-1">
                <li>Semua Siswa Terdaftar</li>
                <li>Semua Catatan Keterlambatan</li>
                <li>Semua Catatan Pelanggaran</li>
                <li>Semua Catatan Prestasi</li>
              </ul>
              <p className="text-sm font-semibold text-red-600 mb-6">Tindakan ini tidak dapat dibatalkan!</p>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsDeleteAllModalOpen(false)} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Batal</button>
                <button type="button" onClick={handleDeleteAll} disabled={isLoading} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50">
                  {isLoading ? "Menghapus..." : "Ya, Hapus Semua Data"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}


