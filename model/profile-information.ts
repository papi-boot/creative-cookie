import { UserModel } from "./user";
export interface ProfileInformationModel {
  prof_info_id: string;
  prof_info_user_ref: UserModel;
  prof_info_image_link: string;
  prof_info_about_me: string;
  prof_info_social_link: string;
  profile_info_created_at: Date;
  profile_info_updated_at: Date;
}
