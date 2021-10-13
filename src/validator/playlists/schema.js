const Joi = require('joi');

const postPlaylistsPayloadSchema = Joi.object({
  name: Joi.string().required(),
});

const postSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

const deleteSongOnPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  postPlaylistsPayloadSchema,
  postSongToPlaylistPayloadSchema,
  deleteSongOnPlaylistPayloadSchema,
};
