"use client";

import { useState } from "react";
import { createUser, updateUser, deleteUser } from "./actions";
import { Trash2, Edit, Plus } from "lucide-react";

type User = {
  id: string;
  username: string;
  peran: string;
};

export default function AkunClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editData) {
        await updateUser(editData.id, new FormData(e.currentTarget));
        alert("Berhasil mengupdate akun.");
      } else {
        await createUser(new FormData(e.currentTarget));
        alert("Berhasil menambahkan akun.");
      }
      window.location.reload();
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan akun.");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
      setEditData(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus akun ini?")) {
      await deleteUser(id);
      window.location.reload();
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button 
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition"
        >
          <Plus size={18} /> Tambah Akun
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 font-semibold text-slate-600 w-16">No</th>
              <th className="p-4 font-semibold text-slate-600">Username</th>
              <th className="p-4 font-semibold text-slate-600">Peran</th>
              <th className="p-4 font-semibold text-slate-600 w-24 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-500">Belum ada data akun.</td>
              </tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="p-4 text-slate-600">{idx + 1}</td>
                  <td className="p-4 font-medium text-slate-800">{user.username}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold">
                      {user.peran}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button 
                      onClick={() => { setEditData(user); setIsModalOpen(true); }}
                      className="p-1.5 text-slate-500 hover:bg-slate-200 border border-slate-200 rounded transition" title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 border border-slate-200 rounded transition" title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">{editData ? "Edit Akun" : "Tambah Akun"}</h2>
              <button onClick={() => { setIsModalOpen(false); setEditData(null); }} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm text-slate-600 mb-1">Username</label>
                <input type="text" name="username" defaultValue={editData?.username} required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="mb-4">
                <label className="block text-sm text-slate-600 mb-1">Password {editData && <span className="text-xs text-slate-400">(Kosongkan jika tidak ingin diubah)</span>}</label>
                <input type="password" name="password" required={!editData} className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="mb-6">
                <label className="block text-sm text-slate-600 mb-1">Peran</label>
                <select name="peran" defaultValue={editData?.peran || "Guru"} required className="w-full border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                  <option value="Admin">Admin</option>
                  <option value="Guru">Guru</option>
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                  <option value="Pengawas">Pengawas</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setIsModalOpen(false); setEditData(null); }} className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                  {isLoading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
