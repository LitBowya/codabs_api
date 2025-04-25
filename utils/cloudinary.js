import cloudinary from "cloudinary";
import { v2 as cloudinaryV2 } from "cloudinary";

// Cloudinary configuration
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload images to Cloudinary
export const uploadServiceImages = async (images) => {
  try {
    const uploadedImages = [];

    for (const image of images) {
      // Upload each image (buffer) to Cloudinary
      const uploadResponse = await cloudinaryV2.uploader.upload(image, {
        resource_type: "auto", // Cloudinary automatically detects the file type (image/video/etc.)
        folder: "services", // Optional: specify the folder in Cloudinary
      });

      uploadedImages.push(uploadResponse.secure_url); // Push the image URL to the uploadedImages array
    }

    return uploadedImages; // Return the array of uploaded image URLs
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error uploading images to Cloudinary");
  }
};

export const uploadProjectImages = async (images) => {
  try {
    const uploadedImages = [];

    for (const image of images) {
      // Upload each image (buffer) to Cloudinary
      const uploadResponse = await cloudinaryV2.uploader.upload(image, {
        resource_type: "auto", // Cloudinary automatically detects the file type (image/video/etc.)
        folder: "projects", // Optional: specify the folder in Cloudinary
      });

      uploadedImages.push(uploadResponse.secure_url); // Push the image URL to the uploadedImages array
    }

    return uploadedImages; // Return the array of uploaded image URLs
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error uploading images to Cloudinary");
  }
};

export const uploadTestimonialImage = async (image) => {
  try {
    // Upload the image to Cloudinary
    const uploadResponse = await cloudinaryV2.uploader.upload(image, {
      resource_type: "auto", // Cloudinary will auto-detect the file type
      folder: "testimonials", // Optional: specify the folder in Cloudinary
    });

    // Return the image URL
    return uploadResponse.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};

export const uploadBlogCoverImage = async (image) => {
  try {
    // Upload the image to Cloudinary
    const uploadResponse = await cloudinaryV2.uploader.upload(image, {
      resource_type: "auto", // Cloudinary will auto-detect the file type
      folder: "blogs", // Optional: specify the folder in Cloudinary
    });

    // Return the image URL
    return uploadResponse.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};

export const uploadBlogImages = async (images) => {
  try {
    const uploadedImages = [];

    for (const image of images) {
      // Upload each image (buffer) to Cloudinary
      const uploadResponse = await cloudinaryV2.uploader.upload(image, {
        resource_type: "auto", // Cloudinary automatically detects the file type (image/video/etc.)
        folder: "blogs", // Optional: specify the folder in Cloudinary
      });

      uploadedImages.push(uploadResponse.secure_url); // Push the image URL to the uploadedImages array
    }

    return uploadedImages; // Return the array of uploaded image URLs
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error uploading images to Cloudinary");
  }
};

export const uploadTeamMemberImage = async (image) => {
  try {
    // Upload the image to Cloudinary
    const uploadResponse = await cloudinaryV2.uploader.upload(image, {
      resource_type: "auto", // Cloudinary will auto-detect the file type
      folder: "team", // Optional: specify the folder in Cloudinary
    });

    // Return the image URL
    return uploadResponse.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};

export const uploadProfileImage = async (image) => {
  try {
    // Upload the image to Cloudinary
    const uploadResponse = await cloudinaryV2.uploader.upload(image, {
      resource_type: "auto", // Cloudinary will auto-detect the file type
      folder: "profile", // Optional: specify the folder in Cloudinary
    });

    // Return the image URL
    return uploadResponse.secure_url; // Return the uploaded image URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Error uploading image to Cloudinary");
  }
};
