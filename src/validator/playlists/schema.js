const Joi = require('joi');

const postPlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const postSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const deleteSongOnPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  postPlaylistPayloadSchema,
  postSongToPlaylistPayloadSchema,
  deleteSongOnPlaylistPayloadSchema,
};
