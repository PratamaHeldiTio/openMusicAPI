/* eslint-disable camelcase */
const mapDBtoModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  inserted_at,
  updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAT: updated_at,
});

module.exports = mapDBtoModel;
