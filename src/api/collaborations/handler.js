const autoBind = require('auto-bind');
const { succesResponse } = require('../../utils/responses');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;
    autoBind(this);
  }

  async postCollaborationHandler({ payload, auth }, h) {
    const { id: credentialId } = auth.credentials;

    this._validator.validatePostCollaborationPayload(payload);
    await this._playlistsService.verifyPlaylistOwner(payload.playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(payload);

    return succesResponse(h, {
      message: 'Kolaborasi berhasil ditambahkan',
      data: { collaborationId },
      statusCode: 201,
    });
  }

  async deleteCollaborationByIdHandler({ payload, auth }, h) {
    const { id: credentialId } = auth.credentials;

    this._validator.validateDeleteCollaborationPayload(payload);
    await this._playlistsService.verifyPlaylistOwner(payload.playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(payload);

    return succesResponse(h, { message: 'Kolaborasi berhasil dihapus' });
  }
}

module.exports = CollaborationsHandler;
