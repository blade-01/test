export function generateErrorMessage(error: any) {
  return (
    error.data.message ||
    error.message ||
    error.statusMessage ||
    error.response._data.message ||
    error.response._data.name
  );
}
