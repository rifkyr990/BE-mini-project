import cloudinary from 'cloudinary';

// Konfigurasi Cloudinary menggunakan v2
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Ganti dengan cloud_name dari dashboard Cloudinary
  api_key: process.env.CLOUDINARY_API_KEY,       // Ganti dengan api_key dari dashboard Cloudinary
  api_secret: process.env.CLOUDINARY_API_SECRET  // Ganti dengan api_secret dari dashboard Cloudinary
});

export default cloudinary;
