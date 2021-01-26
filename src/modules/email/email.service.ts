import { Email } from '@modules/user/domain/value-objects/email.value-object';

export class EmailService {
  async send(email: Email, message: string): Promise<void> {
    // Sending email implementation goes here
  }
}
