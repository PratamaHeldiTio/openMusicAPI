const Joi = require('joi');

const postCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

const deleteCollaborationPayloadSchema = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {
  postCollaborationPayloadSchema,
  deleteCollaborationPayloadSchema,
};
