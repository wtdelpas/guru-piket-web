export const dynamic = 'force-dynamic';
import LayoutWrapper from "@/components/LayoutWrapper";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("logged_in")?.value === "true";

  if (!isLoggedIn) {
    redirect("/login");
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
}

