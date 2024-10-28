import { Injectable } from '@nestjs/common';
import SendGridMail from '@sendgrid/mail';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailClientService {
  constructor(private readonly configService: ConfigService) {
    const sendGridApiKey = this.configService.get<string>('SEND_GRID_API_KEY');
    SendGridMail.setApiKey(sendGridApiKey);
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    const msg = {
      to,
      from: {
        email: 'no-reply@carrierxpress.io',
        name: 'Carrier Xpress',
      },
      subject,
      text,
      html,
    };
    try {
      await SendGridMail.send(msg);
      console.log('Email sent');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
