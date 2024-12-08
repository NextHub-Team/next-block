import { createEnum } from '../../src/utils/types/helper.type';

export const UserLogEventEnum = createEnum([
  'login',
  'logout',
  'order',
  'buy',
  'sell',
  'swap',
  'alert',
  'delete',
  'change',
  'edit',
]);
