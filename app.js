console.log("▶️ app.js başladı");

const path = require("path");
const express = require("express");
const ejs = require("ejs");
const csrf = require("csurf");
const expressSession = require("express-session");
const initializeCart = require("./middlewares/cart");
const createSessionConfig = require("./config/session");
const db = require("./data/database");
const addCsrfTokenMiddleware = require("./middlewares/csrf-token");
const errorHandlerMiddleware = require("./middlewares/error-handler"); //bu ek
const {
  imageUploadErrorHandler,
  handleErrors,
} = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const authRoutes = require("./routes/auth-routes");
const productsRoutes = require("./routes/products-routes");
const baseRoutes = require("./routes/base-routes");
const adminRoutes = require("./routes/admin-routes");
const cartRoutes = require("./routes/cart-routes");
const ordersRoutes = require("./routes/orders-routes");
const designRoutes = require("./routes/design-routes");
const Order = require("./models/order-model");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/products/assets",
  express.static(path.join(__dirname, "product-data"))
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf());

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(cartMiddleware);
app.use(initializeCart);
app.use(addCsrfTokenMiddleware);
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use(designRoutes);
app.use("/cart", cartRoutes);
app.use(protectRoutesMiddleware);
app.use("/orders", ordersRoutes);
app.use("/admin", adminRoutes);

app.use(handleErrors);

console.log("▶️ DB.connectToDatabase() çağrılacak");
db.connectToDatabase()
  .then(() => {
    console.log("✅ DB bağlantısı başarılı — app.listen başlıyor");
    app.listen(3000, () =>
      console.log("➡️ Server listening on http://localhost:3000")
    );
  })
  .catch((err) => {
    console.error("🔴 DB bağlantı hatası:", err);
    process.exit(1);
  });
