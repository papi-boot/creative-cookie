import { databaseHelper } from "../../helper/database.helper";
import { ImageUpload } from "../../middleware/image.upload";
import { QueryTypes } from "sequelize";
import { ProfileInformationModel } from "../../model/profile-information";
import express from "express";
export class UploadController {
  public UPLOAD_IMAGE_ROUTE: string = "/upload-image";
  public upload: ImageUpload = new ImageUpload();
  public uploadImage = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.session.user) {
        const { image_uri } = req.body;
        const { user_id } = req.session.user;
        // @TOOD: check profile info was existing
        const checkProfileInformation: Array<ProfileInformationModel> = await databaseHelper.db.query(
          "SELECT * FROM profile_informations WHERE prof_info_user_ref = $1",
          {
            type: QueryTypes.SELECT,
            bind: [user_id],
          }
        );
        if (checkProfileInformation.length > 0) {
          if (image_uri) {
            const uploadResponse = await this.upload.uploadImage(image_uri);
            if (uploadResponse) {
              const insertUploadPicture = await databaseHelper.db.query(
                "UPDATE profile_informations SET prof_info_image_link = $1, profile_info_updated_at = $2 WHERE prof_info_user_ref = $3",
                {
                  type: QueryTypes.UPDATE,
                  bind: [uploadResponse.secure_url, new Date(), user_id],
                }
              );
              insertUploadPicture;
              return res.status(200).json({ message: "Image successfully upload", success: true });
            }
          } else {
            return res.status(404).json({ message: "No image source provided", success: false });
          }
        } else {
          return res.status(404).json({ message: "Could not found the user. Please reload the page" });
        }
      } else {
        return res.status(401).json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Something went wrong. Please try again or later", success: false });
    }
  };
}
