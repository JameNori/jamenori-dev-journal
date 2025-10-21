import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ฟังก์ชันสำหรับแปลงวันที่จาก ISO 8601 format
export function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
  // ผลลัพธ์: "11 September 2024"
}
