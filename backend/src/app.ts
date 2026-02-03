import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes";
import rankingRoutes from "./routes/ranking.routes";
import chatRoutes from "./routes/chat";
import jogodavelhaRoutes from "./routes/jogodavelha.routes"
<<<<<<< HEAD
=======
import userRoutes from "./routes/users.routes"
import damaRoutes from "./routes/dama.routes"
import jokenpoRoutes from "./routes/jokenpo.routes"
>>>>>>> 77524ba (Add Files)

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

<<<<<<< HEAD

=======
>>>>>>> 77524ba (Add Files)
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
<<<<<<< HEAD
=======
app.use("/api/add", userRoutes)
app.use("/dama", damaRoutes)
app.use("/jokenpo", jokenpoRoutes)
>>>>>>> 77524ba (Add Files)

app.use("/__routes", (_req, res) => {
  res.json({ ok: true });
});

export default app;
