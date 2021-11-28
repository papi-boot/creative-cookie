import { UserModel } from "./user";
export interface UserStatusModel {
  status_id: string;
  status_user_ref: UserModel;
  status_is_active: boolean,
  status_created_at: Date;
  status_updated_at: Date;
}
