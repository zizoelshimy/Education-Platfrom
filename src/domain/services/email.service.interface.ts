export interface IEmailService {
  sendVerificationEmail(
    email: string,
    verificationToken: string,
    firstName: string,
  ): Promise<void>;
  sendPasswordResetEmail(
    email: string,
    resetToken: string,
    firstName: string,
  ): Promise<void>;
  sendWelcomeEmail(email: string, firstName: string): Promise<void>;
}
