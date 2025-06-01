const session = require("express-session");
const mongoDbStore = require("connect-mongodb-session")(session);

function createSessionStore() {
  const store = new mongoDbStore({
    uri: process.env.MONGODB_URI,
    databaseName: "bubiwear",
    collection: "sessions",
  });

  store.on("error", function (error) {
    console.error("Session store error:", error);
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: "strc-wrb-gks-bb-esnnaziko",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    },
  };
}

module.exports = createSessionConfig;
