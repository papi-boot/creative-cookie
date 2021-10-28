import { Helper } from "./helper";
import { API } from "../api/api";
export class RegisterService extends Helper {
  private api: API = new API();
  private registerFullname = this.querySel(".register-fullname");
  private registerEmail = this.querySel(".register-email");
  private registerPassword = this.querySel(".register-password");
  private registerConfirmPassword = this.querySel(".register-confirm-password");
  private registerForm = this.querySel(".register-form");
  private registerSpinner = this.querySel(".spinner-register-btn");
  public sendRegisterRequest(): void {
    if (this.registerForm) {
      this.registerForm.addEventListener("submit", (e: any) => {
        this.registerSpinner.classList.remove("d-none");
      });
    }
  }
}

const registerService = new RegisterService();
registerService.sendRegisterRequest();
