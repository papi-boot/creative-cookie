import { databaseHelper } from "../../helper/database.helper";
import { Clean } from "../../middleware/clean";
import { PasswordResetModel } from "../../model/password-reset";
import { ResetPasswordEmail } from "../../middleware/reset.password.email";
import { formatDistanceToNow, add } from "date-fns";
import { QueryTypes } from "sequelize";
import { UserModel } from "../../model/user";
import express from "express";
import bcrypt from "bcryptjs";
export class ResetPasswordController {
  public RESET_PASSWORD_ROUTE: string = "/reset-password";
  public READ_RESET_PASSWORD_ROUTE: string = "/read-reset-password";
  private c: Clean = new Clean();
  private resetPasswordAPI: ResetPasswordEmail = new ResetPasswordEmail();
  public createResetPassword = async (
    req: express.Request,
    res: express.Response
  ): Promise<any> => {
    try {
      const { email } = req.body;

      //CHECK IF EMAIL EXISTING
      const checkEmailAddress: Array<UserModel> = await databaseHelper.db.query(
        "SELECT * FROM users WHERE user_email = $1",
        {
          type: QueryTypes.SELECT,
          bind: [email],
        }
      );
      if (checkEmailAddress.length > 0) {
        // CHECK IF email already request a reset password;
        const checkPasswordResetEmail: Array<PasswordResetModel> = await databaseHelper.db.query(
          "SELECT * FROM password_resets WHERE password_reset_email_ref = $1",
          {
            type: QueryTypes.SELECT,
            bind: [email],
          }
        );
        if (checkPasswordResetEmail.length > 0) {
          if (checkPasswordResetEmail[0].password_reset_expiration_date > new Date()) {
            return res.status(400).json({
              message: `You've already request reset password for this account. Please try again after  ${formatDistanceToNow(
                checkPasswordResetEmail[0].password_reset_expiration_date
              )}`,
              success: false,
            });
          } else {
            const deletePasswordReset = await databaseHelper.db.query(
              "DELETE FROM password_resets WHERE password_reset_id = $1",
              {
                type: QueryTypes.DELETE,
                bind: [checkPasswordResetEmail[0].password_reset_id],
              }
            );
            deletePasswordReset;
            await this.createPasswordMutate(email, res);
          }
        } else {
          await this.createPasswordMutate(email, res);
        }
      } else {
        return res.status(404).json({ message: "Email/User does not exist", success: false });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: "Something went wrong. Please try again or later.", success: false });
    }
  };

  private createPasswordMutate = async (email: string, res: express.Response): Promise<any> => {
    const cleanEmail = await this.c.cleanNow(email);
    const addPasswordReset: [any][any] = await databaseHelper.db.query(
      "INSERT INTO password_resets(password_reset_email_ref, password_reset_expiration_date, password_reset_created_at, password_reset_updated_at)VALUES($1, $2, $3, $4) RETURNING *",
      {
        type: QueryTypes.INSERT,
        bind: [cleanEmail, add(new Date(), { minutes: 30 }), new Date(), new Date()],
      }
    );
    this.resetPasswordAPI.sendResetPasswordEmail(addPasswordReset[0][0]);
    return res.status(200).json({
      message:
        "Reset password successfully sent to your email. Please check your email, the request will end after 30 minutes",
      success: true,
    });
  };

  public readPasswordResetRequest = async (req: express.Request, res: express.Response) => {
    try {
      const { token } = req.body;
      const getPasswordReset: Array<PasswordResetModel> = await databaseHelper.db.query(
        "SELECT * FROM password_resets WHERE password_reset_id = $1 ",
        {
          type: QueryTypes.SELECT,
          bind: [token],
        }
      );
      if (getPasswordReset.length > 0) {
        if (getPasswordReset[0].password_reset_expiration_date > new Date()) {
          return res.status(200).json({
            message: "Password Reset Request found",
            success: true,
            ...getPasswordReset[0],
          });
        } else {
          return res
            .status(400)
            .json({ message: "Request Expired. Please request again", success: false });
        }
      } else {
        return res.status(404).json({
          message: "Password Reset expired or couldn't find. Please request again",
          success: false,
        });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: "Something went wrong. Please try again or later", success: false });
    }
  };

  public updatePasswordReset = async (req: express.Request, res: express.Response) => {
    try {
      const { token, new_password, confirm_new_password } = req.body;
      if (!new_password || !confirm_new_password)
        return res.status(400).json({ message: "Please check all the fields", success: false });
      if (new_password < 6)
        return res.status(400).json({
          message: "Password should be atleast 6 characters long.",
          success: false,
        });
      if (confirm_new_password !== new_password)
        return res.status(401).json({ message: "Password do not matched", success: false });

      const getPasswordReset: Array<PasswordResetModel> = await databaseHelper.db.query(
        "SELECT * FROM password_resets WHERE password_reset_id = $1",
        {
          type: QueryTypes.SELECT,
          bind: [token],
        }
      );
      if (getPasswordReset.length > 0) {
        if (getPasswordReset[0].password_reset_expiration_date > new Date()) {
          // @TODO check the user info
          const getUser: Array<UserModel> = await databaseHelper.db.query(
            "SELECT * FROM users WHERE user_email = $1",
            {
              type: QueryTypes.SELECT,
              bind: [getPasswordReset[0].password_reset_email_ref],
            }
          );
          if (getUser.length > 0) {
            const cleanPassword = await this.c.cleanNow(new_password);
            const hashPassword = await bcrypt.hash(cleanPassword, 10);
            const updateUser = await databaseHelper.db.query(
              "UPDATE users SET user_password = $1, user_updated_at = $2 WHERE user_id = $3",
              {
                type: QueryTypes.UPDATE,
                bind: [hashPassword, new Date(), getUser[0].user_id],
              }
            );
            updateUser;
            const deletePasswordReset = await databaseHelper.db.query(
              "DELETE FROM password_resets WHERE password_reset_id = $1",
              {
                type: QueryTypes.DELETE,
                bind: [getPasswordReset[0].password_reset_id],
              }
            );
            deletePasswordReset;
            return res.status(200).json({ message: "Reset Password Successfully", success: true });
          } else {
            return res.status(404).json({ message: "Email/User not found", success: false });
          }
        } else {
          return res
            .status(400)
            .json({ message: "Request Expired. Please request again", success: false });
        }
      } else {
        return res.status(404).json({
          message: "Password Reset expired or couldn't find. Please request again",
          success: false,
        });
      }
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: "Something went wrong. Please try again or later", success: false });
    }
  };
}
