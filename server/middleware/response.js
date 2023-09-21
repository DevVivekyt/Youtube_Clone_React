export const createError = (status, message) => {
  return {
    success: false,
    status,
    message,
  };
};
export const createSuccess = (status, message, result) => {
  return {
    success: true,
    status,
    message,
    result,
  };
};
