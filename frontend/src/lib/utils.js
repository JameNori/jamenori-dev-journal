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

// ฟังก์ชันสำหรับแปลงวันที่เป็น "X hours ago", "X minutes ago", etc.
export function formatTimeAgo(dateString) {
  if (!dateString) return "";

  try {
    let date = new Date(dateString);

    // Adjust for timezone if needed (similar to formatCommentDate)
    if (typeof dateString === "string" && dateString.includes("Z")) {
      date = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    }

    const now = new Date();
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} ${
        diffInMinutes === 1 ? "minute" : "minutes"
      } ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
    } else {
      // If more than 7 days, show full date
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  } catch (error) {
    console.error("Error formatting time ago:", error, dateString);
    return "";
  }
}
