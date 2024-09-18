"use strict";

const path = require("node:path");
const AutoLoad = require("@fastify/autoload");
const Fastify = require("fastify");

const port = process.env.PORT || 3000;

const fastify = Fastify({
  logger: true,
});

fastify.register(AutoLoad, {
  dir: path.join(__dirname, "plugins"),
  options: {},
});

fastify.register(AutoLoad, {
  dir: path.join(__dirname, "routes"),
  options: {},
});

const start = async () => {
  try {
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server is running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
