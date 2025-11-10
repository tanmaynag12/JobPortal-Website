import multer from "multer";

const storage = multer.memoryStorage(); // keep in memory for datauri
const upload = multer({ storage });

export default upload;
