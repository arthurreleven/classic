import { Router } from "express";
import passport from "passport";
import { loginEmail, logout } from "../controllers/auth.controller";

const router = Router();

router.post("/login_email", loginEmail);

router.get("/login", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    req.session.user = {
      nome: req.user.nome,
      email: req.user.email,
      ...(req.user.avatar && { avatar: req.user.avatar }),
    };

    req.session.provedor = "google";

    res.redirect(process.env.FRONTEND_URL!);
  }
);

router.get("/logout", logout);

router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }

  res.json(req.session.user);
});

console.log("✅ auth.routes carregado");

<<<<<<< HEAD

export default router;
=======
export default router;
>>>>>>> 77524ba (Add Files)
