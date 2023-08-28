import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  return {
    id: req.user.id,
    name: req.user.name,
  };
});
