export default () => ({
  app: {
    port: parseInt(process.env.PORT ?? "3000", 10),
    env: process.env.NODE_ENV || "development",
    url_base: process.env.URL_BASE,
  },
  rmq: {
    url: process.env.RABBITMQ_URL,
  },
});
