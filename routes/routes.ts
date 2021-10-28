import express from "express";
import passport from "passport";
import { AuthenticateController } from "../controller/authenticate/authenticate.controller";
import { LoginController } from "../controller/login/login.controller";
import { RegisterController } from "../controller/register/register.controller";
export class Routes {
  public routes: express.Router = express.Router();
  private loginController: LoginController = new LoginController();
  private registerController: RegisterController = new RegisterController();
  private authenticateController: AuthenticateController =
    new AuthenticateController();

  // @TODO: ALL HTTP GET ROUTE
  public GET_REQUEST(): any {
    this.routes.get(
      this.authenticateController.AUTHENTICATE_ROUTE,
      this.authenticateController.checkAuthenticated
    );
    this.routes.get(
      this.loginController.LOGIN_PATH,
      this.loginController.getLoginPage
    );
    this.routes.get(
      this.registerController.REGISTER_PATH,
      this.registerController.getRegisterForm
    );
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public POST_REQUEST(): any {
    this.routes.post(
      this.registerController.REGISTER_PATH,
      this.registerController.postRegisterAccount
    );
    this.routes.post(
      this.loginController.LOGIN_PATH,
      (req: express.Request, res: express.Response) => {
        console.log(req.body);
        passport.authenticate("local", (err, user, info) => {
          if (err) {
            throw err;
          }

          if (user) {
            req.logIn(user, (err) => {
              if (err) {
                throw err;
              }
              req.session.cookie.maxAge = 360 * 60 * 60 * 1000;
              return res.status(200).json({
                message: "Successfully Logged in",
                success: true,
                isAuthenticated: true,
                user: user,
                path: "/dashboard",
              });
            });
          } else {
            return res.status(401).json({
              message: "Email or Password is incorrect",
              success: false,
              isAuthenticated: false,
              user: null,
              path: "/authencate",
            });
          }
          console.log(info);
        })(req, res);
      }
    );
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public PUT_REQUEST(): any {
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public DELETE_REQUEST(): any {
    return this.routes;
  }
  public NOT_FOUND(): any {}
}
