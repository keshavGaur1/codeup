import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "Codeline");

  try {
    const res = await axios.post(import.meta.env.VITE_UPLOAD_LINK, data);

    const { url } = res.data;
    return url;
  } catch (err) {
    console.error("Upload error:", err); // Log the error for debugging
    throw new Error('Upload failed'); // Throw an error to be caught in the calling function
  }
};

export default upload;
