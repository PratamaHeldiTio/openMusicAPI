const succesResponse = (h, { message, data, statusCode = 200 }) => {
  const response = h.response({
    status: 'success',
    message,
    data,
  }).code(statusCode);
  return response;
};

const failResponses = (h, error) => {
  const response = h.response({
    status: 'fail',
    message: error.message,
  }).code(error.statusCode);
  return response;
};

const serverErrorResponse = (h) => {
  const response = h.response({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  }).code(500);
  return response;
};

module.exports = {
  succesResponse,
  failResponses,
  serverErrorResponse,
};
