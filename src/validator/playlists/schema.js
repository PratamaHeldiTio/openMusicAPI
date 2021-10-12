const Joi = require('joi');

const postPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});
module.exports = postPlaylistsPayloadSchema;
