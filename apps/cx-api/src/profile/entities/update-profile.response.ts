import { ApiProperty } from '@nestjs/swagger';
import { JsonResponseClass } from '@app/shared-lib/json-response';
import { ProfileResponseEntity } from './profile.response';

export class UpdateProfileResponseType extends JsonResponseClass<ProfileResponseEntity> {
  @ApiProperty({
    description: 'Data of the response specific to update profile',
    type: ProfileResponseEntity,
  })
  data: ProfileResponseEntity;
}
