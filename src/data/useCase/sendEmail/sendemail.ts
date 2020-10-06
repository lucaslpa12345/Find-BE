import {sendEmail} from '../../../domain/useCase/sendEmail';
import {transporterAdapter} from '../../../domain/utils/transporterEmailAdapter';

export class SendEmail implements sendEmail {
  constructor(private transporter: transporterAdapter) {}
  send(email: string): void {
    this.transporter.send(email);
    return;
  }
}