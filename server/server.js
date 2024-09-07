const Hapi = require('@hapi/hapi');
const productRoutes = require('./routes/productRoutes');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  server.route(productRoutes);

  await server.start();
  console.log('Server running on %s', server.info.uri);

  // Sync database
  // try {
  //   await sequelize.sync({ force: false });
  //   console.log('Database connected and synced');
  // } catch (error) {
  //   console.error('Unable to sync database:', error);
  // }
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
