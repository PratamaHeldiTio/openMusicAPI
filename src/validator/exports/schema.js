const Joi = require('joi');

const exportPlaylistsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = { exportPlaylistsPayloadSchema };
