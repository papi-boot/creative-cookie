import express from "express";
import { LoginInterface } from "./login.interface";
import path from "path";

export class LoginController {
  public ROUTE_PATH: string = "/login";
  public userLogin = async (
    req: express.Request,
    res: express.Response
  ): Promise<void> => {
    let loginOption: LoginInterface = {
      page_title: "Sign in to Creative Cookie",
    };
    res.render("login/index", loginOption);
  };
}
