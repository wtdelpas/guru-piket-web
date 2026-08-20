import prisma from "@/lib/prisma";
import AkunClient from "./AkunClient";

export default async function AkunPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Manajemen Akun</h1>
      <AkunClient initialUsers={users} />
    </div>
  );
}
