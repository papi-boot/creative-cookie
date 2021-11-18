import express from "express";
import cors from "cors";
import { AuthenticateController } from "../controller/authenticate/authenticate.controller";
import { LoginController } from "../controller/login/login.controller";
import { LikeController } from "../controller/post/like.controller";
import { PostController } from "../controller/post/post.controller";
import { RegisterController } from "../controller/register/register.controller";
import { CommentController } from "../controller/comment/comment.controller";
import { NotificationController } from "../controller/notification/notification.controller";
import { OnePostController } from "../controller/post/one.post.controller";
export class Routes {
  public routes: express.Router = express.Router();
  private loginController: LoginController = new LoginController();
  private registerController: RegisterController = new RegisterController();
  private authenticateController: AuthenticateController = new AuthenticateController();
  private postController: PostController = new PostController();
  private likeController: LikeController = new LikeController();
  private commentController: CommentController = new CommentController();
  private notificationController: NotificationController = new NotificationController();
  private onePostController: OnePostController = new OnePostController();

  // @TODO: ALL HTTP GET ROUTE
  public GET_REQUEST(): any {
    this.routes.get(this.authenticateController.AUTHENTICATE_ROUTE, this.authenticateController.checkAuthenticate);
    this.routes.get(this.loginController.LOGIN_PATH, this.loginController.getLoginPage);
    this.routes.get(this.registerController.REGISTER_PATH, this.registerController.getRegisterForm);
    this.routes.get(this.authenticateController.LOGOUT_ROUTE, this.authenticateController.logOutUser);
    // this.routes.options(this.postController.POST_ROUTE);
    this.routes.get(this.postController.POST_ROUTE, this.postController.readPost);
    this.routes.get(this.notificationController.NOTIIFICATION_ROUTE, this.notificationController.readNotification);
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public POST_REQUEST(): any {
    this.routes.post(this.registerController.REGISTER_PATH, this.registerController.postRegisterAccount);
    this.routes.post(this.loginController.LOGIN_PATH, this.loginController.postLogin);
    this.routes.post(this.postController.POST_ROUTE, this.postController.createPost);
    this.routes.post(this.likeController.LIKE_ROUTE, this.likeController.createLikePost);
    this.routes.post(this.commentController.COMMENT_ROUTE, this.commentController.createComment);
    this.routes.post(this.onePostController.ONE_POST_ROUTE, this.onePostController.readOnePost);
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public PUT_REQUEST(): any {
    this.routes.put(this.postController.POST_ROUTE, this.postController.updatePost);
    this.routes.put(this.commentController.COMMENT_ROUTE, this.commentController.updateComment);
    this.routes.put(this.notificationController.NOTIIFICATION_ROUTE, this.notificationController.updateNotification);
    return this.routes;
  }

  // @TODO: ALL HTTP POST ROUTE
  public DELETE_REQUEST(): any {
    this.routes.delete(this.postController.POST_ROUTE, this.postController.deletePost);
    this.routes.delete(this.commentController.COMMENT_ROUTE, this.commentController.deleteComment);
    return this.routes;
  }
  public NOT_FOUND(): any {}
}
