import supabase from "../utils/supabase.js";

// Fallback when env is unset — same default bucket as before (local/dev).
const BUCKET_NAME =
  process.env.SUPABASE_BUCKET_NAME || "my-personal-blog";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export class ImageUploadError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "ImageUploadError";
    this.statusCode = statusCode;
  }
}

export async function uploadImage(file, folder) {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new ImageUploadError(
      "Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, WebP).",
      400
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new ImageUploadError(
      "File size too large. Please upload an image smaller than 5MB.",
      400
    );
  }

  const filePath = `${folder}/${Date.now()}_${file.originalname}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error("Supabase Storage upload error:", error);
    throw new ImageUploadError("Server could not upload image to storage", 500);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);

  return publicUrl;
}
