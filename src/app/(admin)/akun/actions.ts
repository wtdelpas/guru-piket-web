"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const peran = formData.get("peran") as string;

  if (!username || !password || !peran) return;

  try {
    await prisma.user.create({
      data: { username, password, peran },
    });
    revalidatePath("/akun");
  } catch (error) {
    console.error("Failed to create user", error);
    throw new Error("Gagal membuat akun. Username mungkin sudah ada.");
  }
}

export async function updateUser(id: string, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const peran = formData.get("peran") as string;

  if (!id || !username || !peran) return;

  try {
    const data: any = { username, peran };
    if (password) {
      data.password = password; // Only update if provided
    }

    await prisma.user.update({
      where: { id },
      data,
    });
    revalidatePath("/akun");
  } catch (error) {
    console.error("Failed to update user", error);
    throw new Error("Gagal mengupdate akun.");
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id },
    });
    revalidatePath("/akun");
  } catch (error) {
    console.error("Failed to delete user", error);
    throw new Error("Gagal menghapus akun.");
  }
}
