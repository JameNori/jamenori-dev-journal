import multer from "multer";

const multerUpload = multer({ storage: multer.memoryStorage() });

export const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);

export const createFieldsUpload = (fields) => multerUpload.fields(fields);

export default multerUpload;
