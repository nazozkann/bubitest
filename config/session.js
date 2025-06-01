require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");

function createSessionConfig() {
  return {
    secret: process.env.SESSION_SECRET || "strc-wrb-gks-bb-esnnaziko",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      dbName: "bubiwear",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 gün
    },
  };
}

module.exports = createSessionConfig;
