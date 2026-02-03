import { Request, Response } from "express";
import { loginEmailService } from "../services/user.service";

export const loginEmail = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const resp = await loginEmailService(email, password);

  if (resp.error) return res.status(400).json({ error: resp.error });

  const user = resp.user;

  req.session.user = {
<<<<<<< HEAD
    nome: user.nome,
    email: user.email,
    avatar: user.avatar,
=======
    nome: user.nome || user.name, // Adicionar fallback para 'name'
    email: user.email,
    avatar: user.avatar,
    avatarId: user.avatarId, // ADICIONAR ESTA LINHA
>>>>>>> 77524ba (Add Files)
  };
  
  req.session.provedor = "email";

  res.json({ message: "Login realizado com sucesso" });
};

export const logout = async (req: Request, res: Response) => {
  req.session.destroy(() => {
    res.json({ message: "Logout efetuado" });
  });
<<<<<<< HEAD
};
=======
};
>>>>>>> 77524ba (Add Files)
