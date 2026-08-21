import prisma from "./prisma";

export async function getTimezoneOffset() {
  const setting = await prisma.setting.findUnique({ where: { key: "timezone_offset" } });
  // Default to 7 (WIB)
  return setting ? parseInt(setting.value) : 7;
}

export async function getDefaultDateTimeLocal() {
  const offset = await getTimezoneOffset();
  const d = new Date(new Date().getTime() + offset * 60 * 60 * 1000);
  return d.toISOString().slice(0, 16);
}

export async function parseTimezoneDate(waktuStr: string) {
  const offset = await getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const absOffset = Math.abs(offset);
  const padOffset = absOffset.toString().padStart(2, "0");
  return new Date(waktuStr + `${sign}${padOffset}:00`);
}

export async function formatDate(date: Date) {
  const offset = await getTimezoneOffset();
  const localTime = new Date(date.getTime() + offset * 60 * 60 * 1000);
  
  const day = localTime.getUTCDate().toString().padStart(2, "0");
  const month = (localTime.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = localTime.getUTCFullYear();
  const hour = localTime.getUTCHours().toString().padStart(2, "0");
  const minute = localTime.getUTCMinutes().toString().padStart(2, "0");
  
  return `${day}/${month}/${year} ${hour}.${minute}`;
}

export function formatDateSync(date: Date, offset: number) {
  const localTime = new Date(date.getTime() + offset * 60 * 60 * 1000);
  const day = localTime.getUTCDate().toString().padStart(2, "0");
  const month = (localTime.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = localTime.getUTCFullYear();
  const hour = localTime.getUTCHours().toString().padStart(2, "0");
  const minute = localTime.getUTCMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hour}.${minute}`;
}

