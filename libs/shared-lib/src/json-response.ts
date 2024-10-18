import { ApiProperty } from '@nestjs/swagger';

export class JsonResponseClass<T> {
  //used for default error or success responses
  @ApiProperty({
    description:
      'Data of the response, which can be of any type specified by the generic parameter T',
    type: Object,
  })
  data: T | any;

  @ApiProperty({
    description: 'Message',
    example: 'message',
  })
  message?: string;

  @ApiProperty({
    description: 'Real error',
    example: 'real error',
  })
  realError?: string;

  @ApiProperty({
    description: 'Status',
    example: 'success',
  })
  status: 'success' | 'error';
}

export type JsonResponseType = {
  //used for default error or success responses
  data?: any;
  message?: string;
  realError?: string;
  status: 'success' | 'error';
};

export const responseWrapper = (args: {
  message?: string;
  data?: any;
  status?: JsonResponseType['status'];
}) => {
  const result: JsonResponseType = {
    data: args?.data !== undefined ? args?.data : null,
    message: args.message,
    status: args?.status || 'success',
  };
  return result;
};
