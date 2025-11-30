import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// โหลดตัวแปรจาก .env
dotenv.config();

// สร้าง Supabase client instance
// ใช้ environment variables จาก .env
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default supabase;
