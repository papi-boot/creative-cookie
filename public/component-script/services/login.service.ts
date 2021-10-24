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
    this.loginForm.addEventListener("submit", (e: any) => {
      e.preventDefault();
      this.spinnerLoginBtn.classList.remove()
      console.log(this.loginEmailInput);
      this.api
        .sendApiRequest({
          params: {
            email: this.loginEmailInput.value,
            password: this.loginPasswordInput.value,
          },
          httpMethod: "POST",
          routes: "/login",
        })
        .then()
        .catch();
    });
  }

  public inputChecker(): void {
    this.loginEmailInput.addEventListener("input", (e: any) => {
      if (e.target.value && this.loginPasswordInput.value) {
        this.loginBtn.removeAttribute("disabled");
      } else {
        this.loginBtn.setAttribute("disabled", "true");
      }
    });
  }
}
const loginService = new LoginService();
loginService.sendLoginRequest();
loginService.inputChecker();
