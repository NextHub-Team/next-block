import { createEnum } from '../../utils/types/helper.type';

export const EventLogStatusEnum = createEnum([
	'Pending',
	'Complete',
	'Failed',
	'Expired',
]);
