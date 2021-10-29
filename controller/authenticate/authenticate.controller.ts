import express from "express";
export class AuthenticateController {
  public AUTHENTICATE_ROUTE: string = "/authenticate";
  public LOGOUT_ROUTE: string = "/logout";
  public checkAuthenticate = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      if (req.session.user) {
        console.log(req.session);
        const { user_full_name } = req.session.user;
        return res.status(200).json({
          message: `Welcome Back ${user_full_name}`,
          success: true,
          isAuthenticated: true,
          user: req.session.user,
        });
      } else {
        return res.status(200).json({
          message: `Session Expired`,
          success: false,
          isAuthenticated: false,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Something went wrong. Please try again or later",
        success: false,
      });
    }
  };

  public logOutUser = (req: express.Request, res: express.Response) => {
    try {
      if (req.session.user) {
        req.session.user = null;
        req.session.resetMaxAge();
        req.logOut();
        req.session.destroy((err) => {
          if (err) {
            throw err;
          }
        });
        return res.status(200).json({
          message: "Successfully Logout",
          success: true,
          isAuthenticated: false,
          user: null,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Something went wrong. Please try again or later",
        success: false,
      });
    }
  };
}
