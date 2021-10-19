const Joi = require('joi');

const postCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().max(50).required(),
  userId: Joi.string().max(50).required(),
});

const deleteCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().max(50).required(),
  userId: Joi.string().max(50).required(),
});

module.exports = {
  postCollaborationPayloadSchema,
  deleteCollaborationPayloadSchema,
};
