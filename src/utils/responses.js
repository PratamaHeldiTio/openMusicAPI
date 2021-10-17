const succesResponse = (h, { message, data, statusCode = 200 }) => h.response({
  status: 'success',
  message,
  data,
}).code(statusCode);

const failResponses = (h, error) => h.response({
  status: 'fail',
  message: error.message,
}).code(error.statusCode);

const serverErrorResponse = (h) => h.response({
  status: 'error',
  message: 'Maaf, terjadi kegagalan pada server kami.',
}).code(500);

module.exports = {
  succesResponse,
  failResponses,
  serverErrorResponse,
};
