const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistsHandler,
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}',
    handler: handler.deletePlaylistByIdHandler,
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'POST',
    path: '/playlists/{playlistId}/songs',
    handler: handler.postSongToPlaylistByIdHandler,
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'GET',
    path: '/playlists/{playlistId}/songs',
    handler: handler.getSongOnPlaylistByIdHandler,
    options: { auth: 'openmusic_jwt' },
  },
  {
    method: 'DELETE',
    path: '/playlists/{playlistId}/songs',
    handler: handler.deleteSongOnPlaylistByIdHandler,
    options: { auth: 'openmusic_jwt' },
  },
];

module.exports = routes;
