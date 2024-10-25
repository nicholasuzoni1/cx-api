import { Injectable } from '@nestjs/common';
import SendGridMail from '@sendgrid/mail';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailClientService {
  constructor(private readonly configService: ConfigService) {
    const sendGridApiKey = this.configService.get<string>('SEND_GRID_API_KEY');

    SendGridMail.setApiKey(sendGridApiKey); // Use API key from config
  }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    // console.log(
    //   'SEND_GRID_API_KEY',
    //   this.configService.get<string>('SEND_GRID_API_KEY'),
    // );
    const msg = {
      to,
      from: 'habibchk123@mail.com', // verified sender address
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
