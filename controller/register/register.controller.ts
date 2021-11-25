import { databaseHelper } from "../../helper/database.helper";
import { RegisterInterface } from "../interface/interface";
import { QueryTypes } from "sequelize";
import { Clean } from "../../middleware/clean";
import bcrypt from "bcryptjs";
import express from "express";
export class RegisterController {
  public REGISTER_PATH: string = "/register";
  private c: Clean = new Clean();
  private registerOption: RegisterInterface = {
    page_title: "Sign Up | Creative Cookie",
    paths: {
      login_path: "/login",
      self_path: this.REGISTER_PATH,
    },
  };
  public getRegisterForm = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      res.status(200).render("register/index", this.registerOption);
    } catch (err) {
      console.error(err);
    }
  };

  public postRegisterAccount = async (req: express.Request, res: express.Response): Promise<any> => {
    try {
      const { fullname, email, password, confirm_password } = req.body;
      console.log(req.body);
      if (!fullname && !email && !password && !confirm_password) {
        return res.status(401).json({ message: "All field is required", success: false });
      }
      if (!fullname) {
        return res.status(401).json({ message: "Full Name is required.", success: false });
      }
      if (!email) {
        return res.status(401).json({ message: "Email is required.", success: false });
      }
      if (!password) {
        return res.status(401).json({ message: "Password is required.", success: false });
      }
      if (password.length <= 6) {
        return res.status(401).json({
          message: "Password should be atleast 6 characters long.",
          success: false,
        });
      }
      if (confirm_password !== password) {
        return res.status(401).json({ message: "Password do not matched", success: false });
      }

      // @TODO: Register the Account Now Check if the email is already exist on database
      const checkEmail = await databaseHelper.db.query("SELECT * FROM users WHERE user_email = $1", {
        type: QueryTypes.SELECT,
        bind: [email],
      });
      if (checkEmail.length > 0) {
        return res.status(401).json({
          message: "The Email address is already exist",
          success: false,
        });
      } else {
        // @TODO: Save user to database if email does not exist;
        const hashPassword = await bcrypt.hash(password, 10);
        const cleanFullName = await this.c.cleanNow(fullname);
        const cleanEmail = await this.c.cleanNow(email);

        const insertUser: [any][any] = await databaseHelper.db.query(
          "INSERT INTO users(user_full_name, user_email, user_password, user_created_at, user_updated_at)VALUES($1, $2, $3, $4, $5) RETURNING *",
          {
            type: QueryTypes.INSERT,
            bind: [cleanFullName, cleanEmail, hashPassword, new Date(), new Date()],
          }
        );
        console.log(insertUser);
        return res.status(200).json({
          message: "Your account was successfully registered.",
          success: true,
          user: insertUser[0][0].user_email,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(200).json({
        message: "Something went wrong. Please try again or later",
        success: false,
      });
    }
  };
}
