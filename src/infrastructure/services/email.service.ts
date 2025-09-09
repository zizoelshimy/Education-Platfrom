import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IEmailService } from '@domain/services/email.service.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('EMAIL_HOST'),
      port: this.configService.get('EMAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    verificationToken: string,
    firstName: string,
  ): Promise<void> {
    try {
      const verificationUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3001')}/auth/verify-email?token=${verificationToken}`;

      // FOR DEVELOPMENT/TESTING: Log the verification token
      this.logger.log(
        `🔑 VERIFICATION TOKEN for ${email}: ${verificationToken}`,
      );
      this.logger.log(`🔗 VERIFICATION URL: ${verificationUrl}`);

      const mailOptions = {
        from: this.configService.get(
          'EMAIL_FROM',
          'noreply@education-platform.com',
        ),
        to: email,
        subject: 'Verify Your Email - Education Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Education Platform!</h2>
            <p>Hello ${firstName},</p>
            <p>Thank you for registering with Education Platform. To complete your registration, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email Address
              </a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
            
            <p><strong>Note:</strong> This verification link will expire in 24 hours.</p>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}:`,
        error,
      );
      throw new Error('Failed to send verification email');
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    firstName: string,
  ): Promise<void> {
    try {
      const resetUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3001')}/auth/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: this.configService.get(
          'EMAIL_FROM',
          'noreply@education-platform.com',
        ),
        to: email,
        subject: 'Password Reset - Education Platform',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello ${firstName},</p>
            <p>We received a request to reset your password for your Education Platform account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p>If the button doesn't work, you can also copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>
            
            <p><strong>Note:</strong> This reset link will expire in 1 hour.</p>
            
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}:`,
        error,
      );
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get(
          'EMAIL_FROM',
          'noreply@education-platform.com',
        ),
        to: email,
        subject: 'Welcome to Education Platform!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Education Platform!</h2>
            <p>Hello ${firstName},</p>
            <p>Your email has been successfully verified and your account is now active!</p>
            
            <p>You can now start exploring our platform and access all the features:</p>
            <ul>
              <li>Browse and enroll in courses</li>
              <li>Access learning materials</li>
              <li>Track your progress</li>
              <li>Connect with instructors and peers</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${this.configService.get('FRONTEND_URL', 'http://localhost:3001')}/dashboard" 
                 style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            
            <p>If you have any questions, feel free to contact our support team.</p>
            
            <p>Happy learning!</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      // Don't throw error for welcome email as it's not critical
    }
  }
}
