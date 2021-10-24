import express from "express";
import { LoginInterface } from "./login.interface";

export class LoginController {
  public ROUTE_PATH: string = "/login";
  public userLogin = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    console.log("HELLO COCONUT");
    let loginOption: LoginInterface = {
      page_title: "Sign in | Creative Cookie",
    };
    res.render("login/index", loginOption);
  };

  public getLoginForm = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    console.log(req.body);
  };
}
