import path from "path";
import url from "url";
import express from "express"; // eslint-disable-line import/no-unresolved
import helmet from "helmet";

import Account from "./support/account";
import getProvider from "./oidc-provider";
import { routes } from "./routes";

import config from "../config";

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;

const configuration = getConfiguration(config, Account.findAccount);

const app = express();
app.use(helmet());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let server;
try {
  startServer();
} catch (err) {
  if (server && server.listening) server.close();
  console.error(err);
  process.exitCode = 1;
}

async function startServer(): Promise<void> {
  let adapter;
  if (process.env.MONGODB_URI) {
    adapter = require("./adapters/mongodb"); // eslint-disable-line global-require
    await adapter.connect();
  }
  const provider = getProvider(ISSUER, configuration, adapter);

  const prod = process.env.NODE_ENV === "production";

  if (prod) {
    app.enable("trust proxy");
    provider.proxy = true;

    app.use((req, res, next) => {
      if (req.secure) {
        next();
      } else if (req.method === "GET" || req.method === "HEAD") {
        res.redirect(
          url.format({
            protocol: "https",
            host: req.get("host"),
            pathname: req.originalUrl,
          })
        );
      } else {
        res.status(400).json({
          error: "invalid_request",
          error_description: "do yourself a favor and only use https",
        });
      }
    });
  }

  routes(app, provider);
  app.use(provider.callback());
  server = app.listen(PORT, () => {
    console.log(
      `application is listening on port ${PORT}, check its /.well-known/openid-configuration`
    );
  });
}

function getConfiguration(config, findAccount) {
  return { ...config, ...findAccount };
}
