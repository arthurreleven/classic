import { Router } from "express";
import { User } from "../models/User"
import bcrypt from "bcryptjs";

const router = Router();

router.post("/add_user", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Por favor, envie nome, email e senha" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email já cadastrado" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash: hash, provider: "email" });

  res.status(201).json({ message: "Usuário criado", id: user.id });
});

router.get("/", async (req, res) => {
  const name = req.query.name as string | undefined;
  const query = name ? { name: new RegExp(name, "i") } : {};
  const users = await User.find(query);
  res.json(users);
});

router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = await User.findByIdAndDelete(userId);
  if (!result) return res.status(400).json({ error: "Usuário não encontrado" });
  res.json({ message: "Usuário deletado com sucesso" });
});

export default router;