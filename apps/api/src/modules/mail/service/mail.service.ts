export abstract class MailService {
  abstract sendRegisterOtpEmail(payload: {
    to: string;
    fullName: string;
    otpCode: string;
  }): Promise<void>;
}
