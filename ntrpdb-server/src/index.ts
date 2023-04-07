import express, { Application } from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { typeDefs, resolvers } from "./graphql";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.js";

const mount = async (app: Application) => {
  const db = await connectDatabase();

  app.use(bodyParser.json({ limit: "2mb" }));
  app.use(cookieParser(process.env.SECRET));
  app.use(compression());
  app.use(graphqlUploadExpress());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });

  const corsOptions = {
    origin: true,
    credentials: true,
  };

  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });
  app.listen(process.env.PORT);
  console.log(`[app]: http://localhost:${process.env.PORT}`);
};

mount(express());
