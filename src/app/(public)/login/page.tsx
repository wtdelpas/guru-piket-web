import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function LoginPage() {
  async function handleLogin(formData: FormData) {
    "use server";
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) return;

    // Default admin fallback if db is empty
    const userCount = await prisma.user.count();
    if (userCount === 0 && username === "admin" && password === "admin123") {
      const cookieStore = await cookies();
      cookieStore.set("logged_in", "true");
      cookieStore.set("peran", "Admin");
      cookieStore.set("username", "admin");
      redirect("/dashboard");
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (user && user.password === password) {
      const cookieStore = await cookies();
      cookieStore.set("logged_in", "true");
      cookieStore.set("peran", user.peran);
      cookieStore.set("username", user.username);
      redirect("/dashboard");
    } else {
      // For simplicity in this demo, we just return. In real app, we'd show error state.
      // Or redirect to /login?error=1
      redirect("/login?error=1");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 w-full max-w-md">
        <div className="flex justify-center mb-6 text-indigo-600">
          <Lock size={48} />
        </div>
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Login Pegawai</h1>
        <p className="text-slate-500 text-center mb-8">Silakan masukkan username dan password Anda</p>
        
        <form action={handleLogin} className="space-y-4">
          <div>
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <input 
              type="password" 
              name="password" 
              placeholder="Kata Sandi" 
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Masuk
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-slate-500 hover:text-indigo-600 text-sm">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
