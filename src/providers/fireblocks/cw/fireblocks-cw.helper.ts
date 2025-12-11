export const isRateLimitError = (error: any): boolean =>
  Boolean(error?.response?.status === 429);

export const isPolicyRejection = (error: any): boolean =>
  error?.response?.data?.status === 'REJECTED' ||
  error?.response?.data?.code === 'POLICY_REJECTION';

export const isPendingPolicy = (error: any): boolean =>
  error?.response?.data?.status === 'PENDING_AUTHORIZATION';

export const isInvalidRequest = (error: any): boolean => {
  const status = error?.response?.status;
  return status === 400 || status === 404 || status === 422;
};
