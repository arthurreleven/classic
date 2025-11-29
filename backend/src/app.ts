import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import rankingRoutes from "./routes/ranking.routes";
import chatRoutes from "./routes/chat";
import jogodavelhaRoutes from "./routes/jogodavelha.routes"

import { setupSwagger } from "./config/swagger";
import { configurePassport } from "./config/passport";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);


const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error("SECRET_KEY não definida no .env");
}

app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport();

app.use(express.static(path.join(__dirname, "../../frontend")));

setupSwagger(app);

app.use("/api", authRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/", jogodavelhaRoutes);

app.use("/__routes", (_req, res) => {
  res.json({ ok: true });
});

export default app;
