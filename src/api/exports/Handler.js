const autoBind = require('auto-bind');
const { succesResponse } = require('../../utils/responses');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    autoBind(this);
  }

  async postExportPlaylistsHandler({ payload, auth, params }, h) {
    const { id: credentialId } = auth.credentials;
    const { playlistId } = params;
    const { targetEmail } = payload;
    const message = {
      targetEmail,
      playlistId,
    };

    this._validator.validateExportPlaylistPayload({ targetEmail });
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

    return succesResponse(h, {
      message: 'Permintaan Anda sedang kami proses',
      statusCode: 201,
    });
  }
}

module.exports = ExportsHandler;
