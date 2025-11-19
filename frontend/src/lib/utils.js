import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ฟังก์ชันสำหรับแปลงวันที่จาก ISO 8601 format เป็น "11 September 2024"
export function formatDate(isoDateString) {
  const date = new Date(isoDateString);

  // ใช้ toLocaleDateString() เพื่อ format วันที่
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // ผลลัพธ์: "11 September 2024"
}
