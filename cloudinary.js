import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME ||"dnujvovep",
  api_key: process.env.API_KEY ||"896483486495194",
  api_secret: process.env.API_SECRET||"spDlb4Sh6SV39Fjv5Vwl76kG7mU",
});

export default cloudinary;
