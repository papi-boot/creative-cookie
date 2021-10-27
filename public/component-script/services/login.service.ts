import { Helper } from "./helper";
import { API } from "../api/api";
export class LoginService extends Helper {
  // @TODO: Send Credentials to Server
  private api: API = new API();
  private loginEmailInput = this.querySel(".login-email");
  private loginPasswordInput = this.querySel(".login-password");
  private loginBtn = this.querySel(".login-btn");
  private loginForm = this.querySel(".login-form");
  private spinnerLoginBtn = this.querySel(".spinner-login-btn");
  public sendLoginRequest(): void {
    if (this.loginForm) {
      this.loginForm.addEventListener("submit", (e: any) => {
        this.spinnerLoginBtn.classList.remove("d-none");
      });
    }
  }
}
const loginService = new LoginService();
loginService.sendLoginRequest();
