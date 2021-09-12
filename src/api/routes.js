const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler,
  },
  // {
  //   method:
  //   path:
  //   handler:
  // },
  // {
  //   method:
  //   path:
  //   handler:
  // },
  // {
  //   method: 'POST',
  //   path: '/songs'
  //   handler:
  // },
  // {
  //   method:
  //   path:
  //   handler:
  // },
];

module.exports = routes;
