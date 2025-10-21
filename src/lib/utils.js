import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ฟังก์ชันสำหรับแปลงวันที่จาก ISO 8601 format เป็น YYYY-MM-DD
export function formatDate(isoDateString) {
  const date = new Date(isoDateString);

  // แปลงเป็น YYYY-MM-DD format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
  // ผลลัพธ์: "2024-09-11"
}
