import { Router } from "express";
import { User } from "../models/User"
import bcrypt from "bcryptjs";

const router = Router();

router.post("/add_user", async (req, res) => {
<<<<<<< HEAD
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Por favor, envie nome, email e senha" });

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email já cadastrado" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash: hash, provider: "email" });

  res.status(201).json({ message: "Usuário criado", id: user.id });
=======
  console.log("🔵 Rota /add_user chamada"); // LOG
  console.log("📦 Body recebido:", req.body); // LOG
  
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      console.log("❌ Dados faltando"); // LOG
      return res.status(400).json({ error: "Por favor, envie nome, email e senha" });
    }

    console.log("🔍 Verificando email existente..."); // LOG
    const existing = await User.findOne({ email });
    
    if (existing) {
      console.log("❌ Email já existe"); // LOG
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    console.log("🔐 Gerando hash..."); // LOG
    const hash = await bcrypt.hash(password, 10);
    const avatarId = Math.floor(Math.random() * 12) + 1;
    
    console.log("💾 Criando usuário com avatarId:", avatarId); // LOG
    const user = await User.create({ 
      name, 
      email, 
      passwordHash: hash, 
      provider: "email",
      avatarId
    });

    console.log("✅ Usuário criado com sucesso:", user.id); // LOG
    res.status(201).json({ 
      message: "Usuário criado", 
      id: user.id,
      avatarId: user.avatarId
    });
  } catch (error: any) {
    console.error("❌ ERRO COMPLETO:", error); // LOG DETALHADO
    res.status(500).json({ 
      error: "Erro ao criar usuário", 
      details: error.message 
    });
  }
>>>>>>> 77524ba (Add Files)
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