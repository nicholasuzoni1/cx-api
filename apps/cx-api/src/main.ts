import { NestFactory } from '@nestjs/core';
import fs from 'fs';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './all-exceptions.filter';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';
import { ValidationErrorHttp } from '@app/shared-lib/http-errors';
import { LangKeys } from '@app/lang-lib/lang-keys';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  let app: any;
  if (process.env.HTTPS === 'true') {
    const httpsOptions = {
      key: fs.readFileSync('./key.pem'),
      cert: fs.readFileSync('./cert.pem'),
      ca: [
        fs.readFileSync('./1.pem'),
        fs.readFileSync('./2.pem'),
        fs.readFileSync('./3.pem'),
      ],
    };
    app = await NestFactory.create(AppModule, {
      snapshot: true,
      httpsOptions,
      logger: ['error', 'debug'],
    });
  } else {
    app = await NestFactory.create(AppModule, {
      snapshot: true,
    });
  }

  // Handle unhandled exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, { reason });
  });

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const errorMessages = errors.map((error) => {
          const messages = Object.values(error.constraints);
          return `${error.property}: ${messages.join(', ')}`;
        });
        const formattedErrors = errorMessages.join('; ');
        throw new ValidationErrorHttp(
          LangKeys.ValidationErrorKey,
          formattedErrors,
        );
      },
      transform: true,
      stopAtFirstError: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Carrier Express APIs.')
    .setDescription('')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalParameters({
      name: 'lang',
      description: 'Language code (e.g., en, es)',
      required: false,
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: false,
  });

  app.use(
    ['/api'], // Protect Swagger UI Docs
    basicAuth({
      challenge: true,
      users: {
        admin: 'cx-admin-404', //verifyx env file - add this later to the env file and change password.
      },
    }),
  );

  app.use('/api', swaggerUi.serve, swaggerUi.setup(document));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders:
      'X-Requested-With, X-HTTP-Method-Override, Observe, Content-Type, Accept, Authorization, lang',
    credentials: true,
  });

  // Get the seeder service from the app context
  const seederService = app.get(SeederService);

  // Run the seeder before starting the app
  await seederService.seed();

  const appPort = process.env.HTTP_PORT || 3000;

  await app.listen(appPort);

  console.log('CX_API running at port:', appPort);
}
bootstrap();
