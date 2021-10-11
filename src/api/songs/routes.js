const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler,
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'GET',
    path: '/songs/{songId}',
    handler: handler.getSongByIdHandler,
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'PUT',
    path: '/songs/{songId}',
    handler: handler.putSongByIdHandler,
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'DELETE',
    path: '/songs/{songId}',
    handler: handler.deleteSongByIdHandler,
    options: { auth: 'openmusic_jwt' },
  },
];

module.exports = routes;
