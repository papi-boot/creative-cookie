import express from "express";
export class AuthenticateController {
  public AUTHENTICATE_ROUTE: string = "/authenticate";
  public checkAuthenticated = async (
    req: express.Request,
    res: express.Response,
  ): Promise<any> => {
    try {
      if (req.isAuthenticated()) {
        return res.status(200).json({
          message: "Welcome Back",
          success: true,
          isAuthenticated: true,
          user: req.user,
          path: "/dashboard",
        });
      } else {
        return res
          .status(401)
          .json({
            message: "Session Expired, Please sign in again.",
            success: false,
            isAuthencated: false,
            user: null,
            path: "/authenticate",
          });
      }
    } catch (err) {
      console.error(err);
      return this.catchError(res);
    }
  };
  // public checkNotAuthenticated = async (
  //   req: express.Request,
  //   res: express.Response,
  //   next: express.NextFunction
  // ): Promise<any> => {
  //   try {
  //     if(req.isAuthenticated()){}
  //   } catch (err) {
  //     console.error(err);
  //     return this.catchError(res);
  //   }
  // };
  public catchError(res: express.Response) {
    return res.status(400).json({
      message: "Something went wrong. Please try again or later",
      success: false,
      isAuthenticated: false,
    });
  }
}
