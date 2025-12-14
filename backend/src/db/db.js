import postgres from "postgres";
import dotenv from "dotenv";

// โหลดตัวแปรจาก .env
dotenv.config();

// สร้าง client หลักสำหรับคุยกับ Supabase Postgres
// postgres() จะจัดการ connection pool ให้ในตัว
const sql = postgres(process.env.DATABASE_URL, {
  ssl: "require", // Supabase ต้องการ SSL เสมอ
});

// export default เป็น instance ตัวเดียวใช้ทั้งโปรเจกต์
export default sql;
