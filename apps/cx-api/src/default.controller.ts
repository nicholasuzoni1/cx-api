import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailClientService } from './mail-client/mail-client.service';
import { ApiBody, ApiProperty } from '@nestjs/swagger';

export class TestMailDto {
  @ApiProperty({
    description: 'Receiver Email Address',
  })
  to: string;
  @ApiProperty({
    description: 'Subject',
  })
  subject: string;
  @ApiProperty({
    description: 'text',
  })
  text: string;

  @ApiProperty({
    description: 'html',
  })
  html: string;
}

@Controller()
export class DefaultController {
  constructor(private readonly mailClientService: MailClientService) {}
  @Get('/')
  getDefault() {
    return {
      message: 'Welcome to the CX API Server',
      version: '0.0.1',
      api_doc: `${process.env.BACKEND_HOST}/api`,
    };
  }

  @Post('/send-mail')
  @ApiBody({
    description: 'Data for sending an email',
    type: TestMailDto,
  })
  async sendEmail(
    @Body() body: { to: string; subject: string; text: string; html: string },
  ) {
    try {
      const { to, subject, text, html } = body;
      await this.mailClientService.sendMail(to, subject, text, html);
      return { message: 'Email sent successfully!' };
    } catch (error) {
      console.log('Mail Error ==>', error);
      return { message: 'Email sending failed' };
    }
  }
}
