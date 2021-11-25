import { databaseHelper } from "../../helper/database.helper";
import { QueryTypes } from "sequelize";
import { UserModel } from "../../model/user";
import { ProfileInformationModel } from "../../model/profile-information";
import { Clean } from "../../middleware/clean";
import express from "express";
import bcrypt from "bcryptjs";
export class ProfileController {
  public PROFILE_ROUTE: string = "/profile";
  public EMAIL_CHECKER_ROUTE: string = "/email-validate";
  public CHANGE_PASSWORD_ROUTE: string = "/change-password";
  private c: Clean = new Clean();
  public createProfileInformation = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        const { user_id, user_full_name } = req.session.user;
        const checkProfInfo: Array<ProfileInformationModel> = await databaseHelper.db.query(
          "SELECT * FROM profile_informations WHERE prof_info_user_ref = $1",
          {
            type: QueryTypes.SELECT,
            bind: [user_id],
          }
        );
        if (checkProfInfo.length > 0) {
          return res.status(200).json({ message: "Already have registered info", success: true });
        } else {
          const insertNewProfInfo = await databaseHelper.db.query(
            "INSERT INTO profile_informations(prof_info_user_ref, prof_info_image_link, prof_info_about_me, prof_info_social_link, profile_info_created_at, profile_info_updated_at)VALUES($1,$2,$3,$4,$5,$6)",
            {
              type: QueryTypes.INSERT,
              bind: [user_id, `https://avatars.dicebear.com/api/initials/${user_full_name}.svg`, null, null, new Date(), new Date()],
            }
          );
          insertNewProfInfo;
          return res.status(200).json({ message: "Profile Information Succesfully Created", success: true });
        }
      } else {
        return res.status(401).json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.error(err);
    }
  };

  public updateBasicInformation = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        const { user_email, user_id } = req.session.user;
        const { updated_user_email, updated_user_full_name, updated_about_me, updated_social_link } = req.body;
        console.log(req.body);
        const checkUser: Array<UserModel> = await databaseHelper.db.query("SELECT * FROM users WHERE user_id = $1", {
          type: QueryTypes.SELECT,
          bind: [user_id],
        });
        if (!updated_user_email && !updated_user_full_name)
          return res.status(400).json({ message: "Email Address and Full Name is required", success: false });
        if (!updated_user_email) return res.status(400).json({ message: "Email Address is required", success: false });
        if (!updated_user_full_name) return res.status(400).json({ message: "Full Name is required", success: false });

        if (checkUser.length > 0) {
          const cleanUpdatedEmail = await this.c.cleanNow(updated_user_email);
          const cleanUpdateUserFullName = await this.c.cleanNow(updated_user_full_name);
          const cleanUpdateAboutMe = await this.c.cleanContent(updated_about_me);
          const cleanUpdateSocialLink = await this.c.cleanNow(JSON.stringify(updated_social_link));
          const updateUser = await databaseHelper.db.query(
            "UPDATE users SET user_email = $1, user_full_name = $2, user_updated_at = $3 WHERE user_id = $4",
            {
              type: QueryTypes.UPDATE,
              bind: [cleanUpdatedEmail, cleanUpdateUserFullName, new Date(), checkUser[0].user_id],
            }
          );
          updateUser;
          const updateProfileInformation = await databaseHelper.db.query(
            "UPDATE profile_informations SET prof_info_about_me = $1, prof_info_social_link = $2, profile_info_updated_at = $3 WHERE prof_info_user_ref = $4",
            {
              type: QueryTypes.SELECT,
              bind: [
                updated_about_me ? cleanUpdateAboutMe : "",
                updated_social_link ? cleanUpdateSocialLink : null,
                new Date(),
                checkUser[0].user_id,
              ],
            }
          );
          updateProfileInformation;
          return res.status(200).json({ message: "Profile Information Successfully Update", success: true });
        } else {
          return res.status(404).json({ message: "User could not found. Please reload your page", success: false });
        }
      } else {
        return res.status(401).json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Something went wrong ", success: false });
    }
  };

  public updateRestrictedInformation = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      if (req.session.user) {
        const { current_password, new_password, confirm_new_password, user_id } = req.body;
        // @TODO check user if exist
        const checkUser: Array<UserModel> = await databaseHelper.db.query("SELECT * FROM users WHERE user_id = $1", {
          type: QueryTypes.SELECT,
          bind: [user_id],
        });
        if (checkUser.length > 0) {
          if (!current_password && !new_password && !confirm_new_password)
            return res.status(400).json({ message: "All field is required", success: false });
          if (!current_password) return res.status(400).json({ message: "Current password is required", success: false });
          if (!new_password) return res.status(400).json({ message: "New password is required", success: false });
          if (!confirm_new_password) return res.status(400).json({ message: "Confirm password is required", success: false });
          if (new_password !== confirm_new_password) return res.status(400).json({ message: "Password don't matched", success: false });
          if (new_password.length < 6)
            return res.status(400).json({ message: "New password should be atleast 6 characters long", success: false });
          bcrypt.compare(current_password, checkUser[0].user_password, async (err, isMatched) => {
            if (err) throw err;
            if (isMatched) {
              // Clean password
              const cleanNewPassword = await this.c.cleanNow(new_password);
              const hashNewPassword = await bcrypt.hash(cleanNewPassword, 10);
              const changePassword = await databaseHelper.db.query(
                "UPDATE users SET user_password = $1, user_updated_at = $2 WHERE user_id = $3",
                {
                  type: QueryTypes.UPDATE,
                  bind: [hashNewPassword, new Date(), checkUser[0].user_id],
                }
              );
              changePassword;
              return res.status(200).json({ message: "You've successfuly change your account password.", success: true });
            } else {
              return res.status(401).json({ message: "The current password is incorrect", success: false });
            }
          });
        } else {
          return res.status(404).json({
            message: "Could not find the user. Please reload the page or contact the administrator of this application",
            success: true,
          });
        }
      } else {
        return res.status(401).json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Something went wronng. Please try again or later", success: false });
    }
  };

  public profileUpdateEmailValidator = async (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        const { user_email } = req.body;
        if (user_email.includes("@")) {
          const checkEmail: Array<UserModel> = await databaseHelper.db.query("SELECT * FROM users WHERE user_email = $1", {
            type: QueryTypes.SELECT,
            bind: [user_email],
          });
          if (checkEmail.length > 0) {
            return res.status(400).json({ message: "Email Address already exist", success: false });
          } else {
            return res.status(200).json({ message: "Email Address available", success: true });
          }
        } else {
          return res.status(400).json({ message: "Email Address must be a valid type", success: false });
        }
      } else {
        return res.status(401).json({ message: "Not Authorized", success: false });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Something went wrong. Please try again or later", success: false });
    }
  };
}
