const autoBind = require('auto-bind');
const { succesResponse } = require('../../utils/responses');

class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postUploadPictureHandler({ payload }, h) {
    const { data } = payload;

    this._validator.validatePictureHeaders(data.hapi.headers);
    const filename = await this._service.writeFile(data, data.hapi);

    return succesResponse(h, {
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
      },
      statusCode: 201,
    });
  }
}

module.exports = UploadsHandler;
