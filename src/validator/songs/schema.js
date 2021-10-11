/* eslint-disable newline-per-chained-call */
const Joi = require('joi');

const songPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1990).max(new Date().getFullYear()).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().min(0).required(),
});

module.exports = songPayloadSchema;
