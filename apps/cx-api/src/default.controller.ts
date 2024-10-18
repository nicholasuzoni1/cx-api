import { Controller, Get } from '@nestjs/common';

@Controller()
export class DefaultController {
  @Get('/')
  getDefault() {
    return {
        message: 'Welcome to the CX API Server',
        version: '0.0.1',
        api_doc: `${process.env.BACKEND_HOST}/api`
    };
  }
}
