import { SetMetadata } from '@nestjs/common';

export type PermissionDecoratorType = {
  module: string;
  key: string;
};

export const PermissionsDecorator = ({
  module,
  key,
}: PermissionDecoratorType) => {
  return SetMetadata('permissions', { module, key });
};
