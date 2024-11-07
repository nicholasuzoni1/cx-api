import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { ProfileResponseEntity } from './profile.response';

export class GetProfileResponseType extends JsonResponseClass<ProfileResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to get profile',
    type: ProfileResponseEntity,
  })
  data: ProfileResponseEntity;
}
