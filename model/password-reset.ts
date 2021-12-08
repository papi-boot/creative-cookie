export interface PasswordResetModel {
  password_reset_id: string;
  password_reset_email_ref: string;
  password_reset_expiration_date: Date;
  password_reset_created_at: Date;
  password_reset_updated_at: Date;
}
