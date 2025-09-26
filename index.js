import express from 'express'
import dbConnection from './config/database.js'
import mountRoutes from './modules/bootstrap.js'
import dotenv from 'dotenv'
import cors from 'cors';
// import Redis from 'ioredis'
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from './schema/schema.js';
import playground from 'graphql-playground-middleware-express';
const expressPlayground = playground.default;

dotenv.config()
const port = process.env.PORT || 3000;
const app = express();

app.use('/graphql', createHandler({ schema }));
app.get('/gui', expressPlayground({ endpoint: '/graphql' }))

// export const redis = new Redis()
// redis.on("connect", () => console.log("redis connected"))
// redis.on("error", () => console.log("redis error"))

app.use(cors())
app.use('/uploads', express.static('uploads'));
app.use(express.json());
dbConnection();

mountRoutes(app);

const server = app.listen(port, () => console.log(`App listening on port ${port}!`));

process.on("unhandledRejection", (err) => {
  console.log(`unhandled Rejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Server is shutting down...");
    process.exit(1);
  });
});