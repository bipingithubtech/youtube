import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "datkot1fu",
  api_key: "296496785146721",
  api_secret: "n84ahqaugYvUfW_y7TfGKiJu3QM",
});

const uploadCloudinary = async (localpath) => {
  try {
    if (!localpath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });

    // Log the URL of the uploaded file
    console.log(response.url);

    // Remove the locally saved temporary file
    fs.unlinkSync(localpath);

    return response;
  } catch (error) {
    // Log the error for debugging
    console.error("Cloudinary upload error:", error.message);

    // Remove the locally saved temporary file in case of failure
    if (fs.existsSync(localpath)) {
      fs.unlinkSync(localpath);
    }

    return null;
  }
};

export default uploadCloudinary;
