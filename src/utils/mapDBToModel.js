/* eslint-disable camelcase */
const mapDBtoModel = ({ inserted_at, updated_at, ...args }) => ({
  ...args,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

module.exports = mapDBtoModel;
