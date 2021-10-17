const autoBind = require('auto-bind');
const { succesResponse } = require('../../utils/responses');

class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
    autoBind(this);
  }

  async postExportPlaylistsHandler({ payload, auth, params }, h) {
    const message = {
      userId: auth.credentials.id,
      targetEmail: payload.targetEmail,
      playlistId: params.playlistId,

    };

    this._validator.validateExportPlaylistPayload(payload);
    await this._service.sendMessage('export:playlists', JSON.stringify(message));

    return succesResponse(h, { message: 'Permintaan Anda sedang kami proses' });
  }
}

module.exports = ExportsHandler;
