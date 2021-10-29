import express from "express";
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
      this.authenticateController.checkAuthenticate
    );
    this.routes.get(
      this.loginController.LOGIN_PATH,
      this.loginController.getLoginPage
    );
    this.routes.get(
      this.registerController.REGISTER_PATH,
      this.registerController.getRegisterForm
    );
    this.routes.get(
      this.authenticateController.LOGOUT_ROUTE,
      this.authenticateController.logOutUser
    )
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
      this.loginController.postLogin
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
