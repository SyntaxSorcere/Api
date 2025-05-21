const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dugrudmsa",
  api_key: "484527986746826",
  api_secret: "-KHdsyz4yQ46C1sMZldRgsNISJI",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Food_Images",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
