const Hapi = require('@hapi/hapi');
const productRoutes = require('./routes/productRoutes');

const init = async () => {
  const server = Hapi.server({
    port: 8080,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Content-Type'],
        additionalHeaders: ['X-Requested-With']
      }
    }
  });

  server.route(productRoutes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
