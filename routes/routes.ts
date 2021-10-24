import express from "express";
import { LoginController } from "../controller/login/login.controller";
export class Routes {
  public routes: express.Router = express.Router();
  public GET_REQUEST(): any {
    // @TODO: ALL HTTP GET ROUTE
    this.routes.get(
      new LoginController().ROUTE_PATH,
      new LoginController().userLogin
    );
    return this.routes;
  }
  public POST_REQUEST(): any {
    // @TODO: ALL HTTP POST ROUTE
    this.routes.post(
      new LoginController().ROUTE_PATH,
      new LoginController().getLoginForm
    )
    return this.routes;
  }
  public PUT_REQUEST(): any {
    // @TODO: ALL HTTP POST ROUTE
    return this.routes;
  }
  public DELETE_REQUEST(): any {
    // @TODO: ALL HTTP POST ROUTE
    return this.routes;
  }
  public NOT_FOUND(): any{
    
  }
}
