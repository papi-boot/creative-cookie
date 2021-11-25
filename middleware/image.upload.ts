const cloudinary = require("cloudinary").v2;
import express from "express";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_PUBLIC_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_API_KEY,
  secure: true,
});
export class ImageUpload {
  public uploadImage = async (imageBase64: string): Promise<any> =>
    cloudinary.uploader.upload(imageBase64, { resource_type: "auto", folder: "profile_picture" }, (err: any, result: any) => {
      if (err) {
        console.log(err);
      }
      return result;
    });
}
